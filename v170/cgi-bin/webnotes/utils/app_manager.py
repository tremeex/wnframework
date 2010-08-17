import webnotes
import webnotes.db
import webnotes.model.import_docs

# Application Manager
# =====================================================================================

class AppManager:
	def __init__(self, master):
		self.master = master
		self.acc_conn = None
		self.app_list = []
		if not webnotes.session:
			webnotes.session = {'user':'Administrator'}
	
	# load list of applications
	# ----------------------------------
	def load_app_list(self, al=[]):
		if not al:
			self.acc_conn = webnotes.db.Database(use_default=1)
			al = [a[0] for a in self.acc_conn.sql('select ac_name from tabAccount where ac_name != %s and ac_name != "ax0000523"',self.master)]
		for a in al:
			self.app_list.append(App(self.master,a))


	# load list of all doctypes, reports and pages in module
	# ------------------------------------------------------------
	def load_dt_list(self, app, mod=[], dt=[]):
		self.dt_list = dt
		if mod:
			transfer_types = ['Role', 'DocType', 'Search Criteria', 'Page', 'Module Def', 'Print Format', 'DocType Mapper', 'DocType Label', 'GL Mapper', 'TDS Rate Chart']
			for m in mod:
				for dt in transfer_types:
					try:
						dl2 = app.master_conn.sql('select name from `tab%s` where module="%s"' % (dt,m))
						self.dt_list += [[dt,e[0]] for e in dl2]
					except:
						pass

	# Delete App List
	# -----------------
	def delete_app_list(self, al=[]):
		import defs
		import webnotes.utils
		acc_conn = webnotes.db.Database(use_default=1)
		acc_conn.sql("delete from tabAccount where ac_name IN %s" % ("('"+"','".join(al)+"')"))
		if defs.root_login:
			root_conn = webnotes.db.Database(user=defs.root_login, password=defs.root_password)
			for a in al:
				db = acc_conn.sql('select db_login, db_name from tabAccount where ac_name = "%s"' % (a))
				db = db and webnotes.utils.cstr(db[0][0]) or webnotes.utils.cstr(db[0][1])
				root_conn.sql("DROP DATABASE '%s'" % (db))
				print "Database : "+db+" deleted"
				print "-------------------------------------"


	# sync all the apps (app_list -> ac_names , mod_list -> modules, dt_list -> [doctypes,docname])
	# ----------------------------------
	def sync_apps(self, app_list=[], mod_list = [], dt_list = []):
		self.app_list, self.dt_list = [], []
		self.load_app_list(app_list)
		print "Source Account : "+self.master
		for app in self.app_list:
			print "---------------------------------------"
			print "Target Account : "+app.ac_name
			print "---------------------------------------"
			if mod_list or dt_list:
				app.connect(app.ac_name)
				self.load_dt_list(app, mod_list, dt_list)
				for d in self.dt_list:
					app.sync_doc(d[0], d[1])
				app.close()
			else:
				app.sync(ac_name = app.ac_name)
	

	# execute a script in all apps
	# ----------------------------------
	def execute_script(self, patch_id = '', script = '', app_list = []):
		self.app_list = []
		self.load_app_list(app_list)
		if patch_id:
			src_app = App(self.master, self.master)
			src_app.connect(self.master)
			script = src_app.conn.sql("select patch_code from `tabPatch` where name = %s", patch_id)
			script =script and script[0][0] or ''
			src_app.close()

		for app in self.app_list:
			print "=========================="
			print "Target Account : "+app.ac_name
			print "--------------------------"
			app.run_script(script)


	# Delete Unwanted Database
	# --------------------------
	def delete_apps(self, app_list=[]):
		if not app_list:
			from webnotes.utils.webservice import FrameworkServer
			fw = FrameworkServer('www.iwebnotes.com','/','__system@webnotestech.com','password')
			app_list = fw.runserverobj('App Control','App Control','get_unwanted_apps','')
		self.delete_app_list(app_list)


	# create a new app
	# ----------------------------------
	def new_app(self, ac_name, source):
		import webnotes.setup

		# setup
		print 'Creating new application...'
		ret = webnotes.setup.create_account(ac_name, source)
		ret, db_name = ret.split(',')
		print ac_name + ' created !!!'
	

	# create multiple apps
	# ----------------------------------
	def create_apps(self, n, source):
		acc_conn = webnotes.db.Database(use_default=1)
		curr_ac_name = acc_conn.sql("select ac_name from tabAccount where ac_name like 'AC%' Order by ac_name desc limit 1")
		curr_ac_name = curr_ac_name and curr_ac_name[0][0] or 0
		if curr_ac_name:
			curr_ac_name = int(curr_ac_name[2:])
		for i in range(n):
			self.new_app('AC%05d' % (curr_ac_name + i + 1), source)
			
	# get the next app in line
	# ----------------------------------
	def register_app(self):
		ret = self.acc_conn.sql("select ac_name from tabAccount where ifnull(registered,0)=0 order by ac_name limit 1")
		if not ret:
			raise Exception, "No more apps to register"

		self.acc_conn.sql("update tabAccount set registered=1 where ac_name=%s", ret[0][0])
		return ret[0][0]
		
		
# Application Instance
# =====================================================================================
class App:
	def __init__(self, master, ac_name):
		#self.ignore_modules = ['Development', 'Recycle Bin', 'System']
		self.ignore_modules = ['Recycle Bin']
		self.ac_name = ac_name
		self.master = master
		self.verbose = 0
	
	# Get db Logintransfer_types = ['Role',  'Print Format','DocType', 'Page', 'DocType Mapper', 'Search Criteria','Menu Item']
	# -------------
	def get_db_login(self, ac_name):
		import webnotes.utils
		acc_conn = webnotes.db.Database(use_default=1)
		det = acc_conn.sql('select db_login, db_name from tabAccount where ac_name = "%s"' % (ac_name))
		return det and webnotes.utils.cstr(det[0][0]) or webnotes.utils.cstr(det[0][1])


	# make connections to master and app
	# ----------------------------------
	def connect(self, ac_name):
		if not webnotes.session:
			webnotes.session = {'user': 'Administrator'}
		self.master_conn = webnotes.db.Database(ac_name = self.master)
		self.master_conn.use(self.get_db_login(self.master))
		self.conn = webnotes.db.Database(ac_name = ac_name)
		self.conn.use(self.get_db_login(ac_name))
	
	# close
	# ----------------------------------
	def close(self):
		self.conn.close()
		self.master_conn.close()
	
	# sync application doctypes
	# ----------------------------------
	def sync(self, verbose = 0, ac_name = ''):			
		self.verbose = verbose
		self.connect(ac_name)
		self.sync_records('Role')
		self.sync_records('DocType')
		self.sync_records('Search Criteria')
		self.sync_records('Page')
		self.sync_records('Module Def')
		self.sync_records('Print Format')
		self.sync_records('DocType Mapper')
		self.sync_records('DocType Label')
		self.sync_records('GL Mapper')
		self.sync_records('TDS Rate Chart')
		self.sync_control_panel()
		self.clear_cache()
		self.close()


	# Clear Cache
	# ------------
	def clear_cache(self):
		self.conn.sql("start transaction")
		self.conn.sql("delete from __DocTypeCache")
		self.conn.sql("delete from __SessionCache")		
		
	# sync control panel
	# ----------------------------------
	def sync_control_panel(self):
		self.conn.sql("start transaction")
		startup_code = self.master_conn.get_value('Control Panel', None, 'startup_code')
		self.conn.set_value('Control Panel', None, 'startup_code', startup_code)

		startup_css = self.master_conn.get_value('Control Panel', None, 'startup_css')
		self.conn.set_value('Control Panel', None, 'startup_css', startup_css)
		self.conn.sql("commit")

	# sync records of a particular type
	# ----------------------------------
	def sync_records(self, dt):
		if self.verbose:
			print "Sync: " + dt
			
		try:
			ml = self.get_master_list(dt)
			for m in ml:
				if self.is_modified(dt, m[0], m[1]):
					self.sync_doc(dt, m[0])
				else:
					if self.verbose:
						print "No update in " + m[0]
		except Exception, e:
			if e.args[0]==1146:
				print "No table %s in master" % dt
			else:
				raise e
	
	# sync a particular record
	# ----------------------------------
	def sync_doc(self, dt, dn):
		import webnotes
		from webnotes.utils import transfer
		
		webnotes.conn = self.master_conn
		import webnotes.model.doc

		# get from master
		doclist = webnotes.model.doc.get(dt, dn)
		
		# put
		webnotes.conn = self.conn
		print transfer.set_doc([d.fields for d in doclist], ovr = 1)
	

	# get the list from master
	# ----------------------------------
	def get_master_list(self, dt):
		c = ''
		
		cl = [i[0] for i in self.master_conn.sql("desc `tab%s`" % dt)]
		
		if 'standard' in cl:
			c += ' and standard="Yes"'
		if 'module' in cl and self.ignore_modules:
			c += ' and (' + ' and '.join(['module!="%s"' % i for i in self.ignore_modules]) + ')'
		return self.master_conn.sql("select name, modified from `tab%s` where docstatus != 2 %s" % (dt, c))
	
	# check if record is modified
	# ----------------------------------
	def is_modified(self, dt, dn, modified):
		ret = self.conn.sql("select modified from `tab%s` where name=%s" % (dt, '%s'), dn)
		if ret and ret[0][0]==modified:
			return 0
		else:
			return 1
	

	# run script remotely
	# ----------------------------------
	def run_script(self, script):
		self.connect(ac_name = self.ac_name)
		webnotes.conn = self.conn
		from webnotes.model import code
		self.conn.sql("start transaction")
		sc = code.execute(script)
		self.conn.sql("commit")
		print sc
		self.close()
