# Database Module
# --------------------

import MySQLdb
from webnotes import defs

class Database:
	def __init__(self, host='', user='', password='', use_default = 0):
		self.host = host or 'localhost'
		self.user = user or defs.db_login
		self.password = password or defs.db_password
		
		if use_default:
			self.user = defs.db_login
			self.password = defs.db_password
		
		self.is_testing = 0
		self.in_transaction = 0
		self.testing_tables = []
		
		self.connect()
	
		if use_default:
			self.use(defs.db_name)
		
	def connect(self):
		self._conn = MySQLdb.connect(user=self.user, host=self.host, passwd=self.password)
		self._cursor = self._conn.cursor()
		
		return self._cursor
	
	def use(self, db_name):
		self._conn.select_db(db_name)
	
	def check_transaction_status(self, query):
		if query and query.strip().lower()=='start transaction':
			self.in_transaction = 1

		if query and query.strip().lower() in ['commit', 'rollback']:
			self.in_transaction = 0
	
	def fetch_as_dict(self):
		result = self._cursor.fetchall()
		ret = []
		for r in result:
			dict = {}
			for i in range(len(r)):
				dict[self._cursor.description[i][0]] = r[i]
			ret.append(dict)
		return ret
	
	def validate_query(self, q):
		cmd = q.strip().lower().split()[0]
		if cmd in ['alter', 'drop', 'truncate'] and webnotes.user.name != 'Administrator':
			webnotes.msgprint('Not allowed to execute query')
			raise Execption
	
	def sql(self, query, values=(), as_dict = 0, as_list = 0, allow_testing = 1):
		# check security
		#self.validate_query(query)
	
		# replace 'tab' by 'test' if testing
		if self.is_testing and allow_testing:
			query = self.replace_tab_by_test(query)

		# in transaction validations
		self.check_transaction_status(query)
		
		# execute
		if values:
			self._cursor.execute(query, values)
		else:
			self._cursor.execute(query)	

		# scrub out put if required
		if as_dict:
			return self.fetch_as_dict()
		elif as_list:
			return self.convert_to_lists(self._cursor.fetchall())
		else:
			return self._cursor.fetchall()

	def get_description(self):
		return self._cursor.description

	def convert_to_lists(self, res):
		try: import decimal # for decimal Python 2.5 (?)
		except: pass
		nres = []
		for r in res:
			nr = []
			for c in r:
				try:
					if type(c)==decimal.Decimal: c=float(c)
				except: pass
	
				if c == None: c=''
				elif hasattr(c, 'seconds'): c = ':'.join(str(c).split(':')[:2])
				elif hasattr(c, 'strftime'): 
					try:
						c = c.strftime('%Y-%m-%d')
					except ValueError, e:
						c = 'ERR'
				elif type(c) == long: c = int(c)
				nr.append(c)
			nres.append(nr)
		return nres

	def replace_tab_by_test(self, query):
		if self.is_testing:
			tl = self.get_testing_tables()
			for t in tl:
				query = query.replace(t, 'test' + t[3:])
		return query
		
	def get_testing_tables(self):
		if not self.testing_tables:
			testing_tables = ['tab'+r[0] for r in self.sql('SELECT name from tabDocType where docstatus<2 and (issingle=0 or issingle is null)', allow_testing = 0)]
			testing_tables+=['tabSeries','tabSingles'] # tabSessions is not included here
		return self.testing_tables

	# get a single value from a record
	def get_value(self, doctype, docname, fieldname):
		if docname:
			try:
				r = self.sql("select `%s` from `tab%s` where name='%s'" % (fieldname, doctype, docname))
				return r and r[0][0] or ''
			except:
				return None
		else:
			r = self.sql("select value from tabSingles where field=%s and doctype=%s", (fieldname, doctype))
			return r and r[0][0] or None

	def set(self, doc, field, val):
		self.sql("update `tab"+doc.doctype+"` set `"+field+"`=%s where name=%s", (val, doc.name))
		doc.fields[field] = val

	def field_exists(self, dt, fn):
		return self.sql("select name from tabDocField where fieldname=%s and parent=%s", (dt, fn))

	def exists(self, dt, dn):
		try:
			return self.sql('select name from `tab%s` where name="%s"' % (dt, dn.replace('"',"'")))
		except:
			return None

	def close(self):
		self._conn.close()