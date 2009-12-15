class BaseDocType:
	def __init__(self):
		pass
		
	def __getattr__(self, name):
		if self.__dict__.has_key(name):
			return self.__dict__[name]
		elif self.super and hasattr(self.super, name):
			return getattr(self.super, name)
		else:
			raise AttributeError, 'BaseDocType Attribute Error'

class Document:
	def __init__(self, doctype = '', name = '', fielddata = {}):
		if fielddata: 
			self.fields = fielddata
		else: 
			self.fields = {}
		
		if not self.fields.has_key('name'):
			self.fields['name']='' # required on save
		if not self.fields.has_key('doctype'):
			self.fields['doctype']='' # required on save			
		if not self.fields.has_key('owner'):
			self.fields['owner']='' # required on save			

		if doctype:
			self.fields['doctype'] = doctype
		if name:
			self.fields['name'] = name
		self.__initialized = 1
			
		if (doctype and name):
			self.loadfromdb(doctype, name)

	# Load Document
	# -------------

	def loadfromdb(self, doctype = None, name = None):
		global conn
		
		if name: self.name = name
		if doctype: self.doctype = doctype
		
		r = sql("select issingle from tabDocType where name='%s'" % self.doctype)
		issingle = r and r[0][0] or 0
				
		if issingle:
			self.loadsingle()
		else:
			dataset = sql('select * from `tab%s` where name="%s"' % (self.doctype, self.name.replace('"', '\"')))
			if not dataset:
				msgprint('%s %s does not exist' % (self.doctype, self.name))
				raise Exception
			self.loadfields(dataset, 0, conn.cursor.description)

	# Load Fields from dataset
	# ------------------------

	def loadfields(self, dataset, rid, description):
		try: import decimal # for decimal Python 2.5 (?)
		except: pass
		import datetime
		for i in range(len(description)):
			v = dataset[rid][i]
			if type(v)==datetime.date:
				v = str(v)
			elif type(v)==datetime.timedelta:
				v = ':'.join(str(v).split(':')[:2])
			elif type(v)==datetime.datetime:
				v = str(v)
			elif type(v)==long: v=int(v)
			try:
				if type(v)==decimal.Decimal: v=float(v)
			except: pass
			
			self.fields[description[i][0]] = v

	# Load Single Type
	# ----------------

	def loadsingle(self):
		self.name = self.doctype
		dataset = sql("select field, value from tabSingles where doctype='%s'" % self.doctype)
		for d in dataset: self.fields[d[0]] = d[1]

	# Setter
	# ------
			
	def __setattr__(self, name, value):
		# normal attribute
		if not self.__dict__.has_key('_Document__initialized'): 
			self.__dict__[name] = value
		elif self.__dict__.has_key(name):
			self.__dict__[name] = value
		else:
			# field attribute
			f = self.__dict__['fields']
			f[name] = value

	# Getter
	# ------

	def __getattr__(self, name):
		if self.__dict__.has_key(name):
			return self.__dict__[name]
		elif self.fields.has_key(name):
			return self.fields[name]	
		else:
			return ''
	
	# Make New
	# --------
	
	def makenew(self, autoname, istable, case=''):
		global in_transaction
		so = get_server_obj(self, [])
		started_transaction = 0
		
		self.localname = self.name

		if self.amended_from:
			am_id = 1
			am_prefix = self.amended_from
			if sql('select amended_from from `tab%s` where name = "%s"' % (self.doctype, self.amended_from))[0][0] or '':
				am_id = cint(self.amended_from.split('-')[-1]) + 1
				am_prefix = '-'.join(self.amended_from.split('-')[:-1]) # except the last hyphen
			
			self.name = am_prefix + '-' + str(am_id)
		
		elif so and hasattr(so, 'autoname'):
			r = run_server_obj(so, 'autoname')
			if r:
				return r

		elif autoname and autoname.startswith('field:'):
			n = self.fields[autoname[6:]]
			if not n:
				raise Exception, 'Name is required'
			self.name = n.strip()
			
		elif self.fields.get('__newname',''): # new from client
			self.name = self.fields['__newname']

		elif autoname and autoname!='Prompt': # autoname
			self.name = make_autoname(autoname, self.doctype)

		elif istable:
			self.name = make_autoname('#########', self.doctype)

		if not self.owner:
			self.owner = session['user']

		if db_exists(self.doctype, self.name):
			raise NameError, 'Name %s already exists' % self.name
		
		if not self.name:
			return 'No Name Specified for %s' % self.doctype
		
		if case=='Title Case': self.name = self.name.title()
		if case=='UPPER CASE': self.name = self.name.upper()
		
		self.name = self.name.strip() # no leading and trailing blanks

		forbidden = ['%',"'",'"']
		for f in forbidden:
			if f in self.name:
				raise NameError, '%s not allowed in ID (name)' % f
		
		sql("""insert into 
			`tab%s` (name, owner, creation, modified, modified_by) 
			 values ('%s', '%s', '%s', '%s', '%s')""" % (self.doctype, self.name, session['user'], now(), now(), session['user']))


	# Update Values
	# ------------
	
	def update_single(self, link_list):
		update_str = ["(%s, 'modified', %s)",]
		values = [self.doctype, now()]
		
		sql("delete from tabSingles where doctype='%s'" % self.doctype)
		for f in self.fields.keys():
			if not (f in ('modified', 'doctype', 'name', 'perm', 'localname', 'creation'))\
				and (not f.startswith('__')): # fields not saved

				# validate links
				if link_list and link_list.get(f):
					self.fields[f] = self.validate_link(link_list[f], self.fields[f])

				if self.fields[f]==None:
					update_str.append("(%s,%s,NULL)")
					values.append(self.doctype)
					values.append(f)
				else:
					update_str.append("(%s,%s,%s)")
					values.append(self.doctype)
					values.append(f)
					values.append(self.fields[f])
		sql("insert into tabSingles(doctype, field, value) values %s" % (', '.join(update_str)), values)

	# Validate Links
	# --------------

	def validate_links(self, link_list):
		err_list = []
		for f in self.fields.keys():
			# validate links
			old_val = self.fields[f]
			if link_list and link_list.get(f):
				self.fields[f] = self.validate_link(link_list[f], self.fields[f])

			if old_val and not self.fields[f]:
				err_list.append(old_val)
				
		return err_list

	def make_link_list(self):
		res = sql("""
			SELECT fieldname, options
			FROM tabDocField
			WHERE parent='%s' and (fieldtype='Link' or (fieldtype='Select' and `options` like 'link:%%'))""" % (self.doctype))
			
		link_list = {}
		for i in res: link_list[i[0]] = i[1]
		return link_list
	
	def validate_link(self, dt, dn):
		if not dt: return dn
		if dt.lower().startswith('link:'):
			dt = dt[5:]
		if '\n' in dt:
			dt = dt.split('\n')[0]
		tmp = sql("""SELECT name FROM `tab%s` WHERE name = '%s' """ % (dt, dn))
		return tmp and tmp[0][0] or ''# match case
	
	def update_values(self, issingle, link_list, ignore_fields=0):
		if issingle:
			self.update_single(link_list)
		else:
			update_str, values = [], []
			# set modified timestamp
			self.modified = now()
			self.modified_by = session['user']
			for f in self.fields.keys():
				if (not (f in ('doctype', 'name', 'perm', 'localname', 'creation'))) \
					and (not f.startswith('__')): # fields not saved
					
					# validate links
					if link_list and link_list.get(f):
						self.fields[f] = self.validate_link(link_list[f], self.fields[f])

					if self.fields[f]==None:
						update_str.append("`%s`=NULL" % f)
						if ignore_fields:
							try: r = sql("update `tab%s` set `%s`=NULL where name=%s" % (self.doctype, f, '%s'), self.name)
							except: pass
					else:
						values.append(self.fields[f])
						update_str.append("`%s`=%s" % (f, '%s'))
						if ignore_fields:
							try: r = sql("update `tab%s` set `%s`=%s where name=%s" % (self.doctype, f, '%s', '%s'), (self.fields[f], self.name))
							except: pass
			if values:
				if not ignore_fields:
					# update all in one query
					r = sql("update `tab%s` set %s where name='%s'" % (self.doctype, ', '.join(update_str), self.name), values)
	
	# Save values
	# -----------
	
	def save(self, new=0, check_links=1, ignore_fields=0):

		res = sql('select autoname, issingle, istable, name_case from tabDocType where name="%s"' % self.doctype, as_dict=1)
		res = res and res[0] or {}

		# make new		
		if new or (not new and self.fields.get('__islocal')) and (not res.get('issingle')):
			r = self.makenew(res.get('autoname'), res.get('istable'), res.get('name_case'))
			if r: 
				return r

		self.update_values(res.get('issingle'), check_links and self.make_link_list() or {}, ignore_fields)
		self.clear_temp_fields()
		
	def clear_temp_fields(self):
		# clear temp stuff
		keys = self.fields.keys()
		for f in keys:
			if f.startswith('__'): 
				del self.fields[f]

	def clear_table(self, doclist, tablefield, save=0):
		for d in getlist(doclist, tablefield):
			d.fields['__oldparent'] = d.parent
			d.parent = 'old_parent:' + d.parent # for client to send it back while saving
			d.docstatus = 2
			if save and not d.fields.get('__islocal'):
				d.save()
		self.fields['__unsaved'] = 1

	def addchild(self, fieldname, childtype = '', local=0, doclist=None):
		if not childtype:
			childtype = db_getchildtype(self.doctype, fieldname)
	
		d = Document()
		d.parent = parent.name
		d.parenttype = parent.doctype
		d.parentfield = fieldname
		d.doctype = childtype
		d.docstatus = 0;
		d.name = ''
		d.owner = session['user']
		
		if local:
			d.fields['__islocal'] = '1' # for Client to identify unsaved doc
		else: 
			d.save(new=1)
	
		if doclist != None:
			doclist.append(d)
	
		return d

def addchild(parent, fieldname, childtype = '', local=0, doclist=None):
	parent.addchild(fieldname, childtype, local, doclist)

# Remove Child
# ------------

def removechild(d, is_local = 0):
	if not is_local:
		set(d, 'docstatus', 2)
		set(d, 'parent', 'old_parent:' + d.parent)
	else:
		d.parent = 'old_parent:' + d.parent
		d.docstatus = 2
			
# Naming
# ------

def make_autoname(key, doctype=''):
	n = ''
	l = key.split('.')
	for e in l:
		en = ''
		if e.startswith('#'):
			digits = len(e)
			en = getseries(n, digits, doctype)
		elif e=='YY': 
			import time
			en = time.strftime('%y')
		elif e=='MM': 
			import time
			en = time.strftime('%m')		
		elif e=='YYYY': 
			import time
			en = time.strftime('%Y')		
		else: en = e
		n+=en
	return n

# Get Series for Autoname
# -----------------------

def getseries(key, digits, doctype=''):
	if db_has_series(key, doctype):
		n = db_series_next(key, doctype)
	else:
		db_make_series(key, doctype)
		n = 1
	return ('%0'+str(digits)+'d') % n

def get(dt, dn=''):
	import webnotes.model.doclist
	dn = dn or dt
	return webnotes.model.doclist.make(dt, dn)