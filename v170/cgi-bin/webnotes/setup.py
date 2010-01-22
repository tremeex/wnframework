# Setup

import webnotes


def backup_all():
	# backups folder
	import os
	dblist = sql_accounts('select db_name from tabAccount')

	# backup -all in /backups folder
	for d in dblist:
		backup_db(d[0], 1)
	
	# dump all in /daily folder
	import time, datetime
	fname = 'daily-' + time.strftime('%Y-%m-%d') + '.tar.gz'
	
	# daily dump
	os.system('tar czf ../backups/daily/%s ../backups/dumps' % fname) 

	# keep only three files
	if len(os.listdir('../backups/daily')) > 3:
		delete_oldest_file('../backups/daily')

	# if sunday, then copy to weekly
	if datetime.datetime.now().weekday()==6:
		os.system('cp ../backups/daily/'+fname+' ../backups/weekly/'+fname)
	
		# keep only three files
		if len(os.listdir('../backups/weekly')) > 3:
			delete_oldest_file('../backups/weekly')
	
def delete_oldest_file(folder):
	import os
	a = sorted(os.listdir(folder), key=lambda fn: os.stat(folder+'/'+fn).st_mtime, reverse=False)
	if a:
		os.system('rm %s/%s' % (folder, a[0]))

def mysqldump(db, folder=''):
	global mysql_path
	import os
	os.system('%(path)smysqldump %(db)s > %(folder)s%(db)s.sql -u %(db)s -p%(pwd)s --ignore-table=%(db)s.__DocTypeCache' % {'path':mysql_path, 'db':db, 'pwd':db_password, 'folder':folder})

def backup_db(db, from_all=0):
	import os

	if defs.root_login:
		global conn
		conn = MySQLdb.connect(user=defs.root_login, host=db_host, passwd=defs.root_password)
		
	sql('use %s' % db)

	try:
		p = '../backups'
		if from_all: p = '../backups/dumps'	
		
		os.system('rm %s/%s.tar.gz' % (p,db))
	
		# dump
		mysqldump(db, p+'/')
		
		# zip
		os.system('tar czf %s/%s.tar.gz %s/%s.sql' % (p, db, p, db))
		os.system('rm %s/%s.sql' % (p, db))
		#sql('unlock tables')
	except Exception, e:
		#sql('unlock tables')
		raise e

def copy_db(source, target=''):
	if not server_prefix:
		webnotes.msgprint("Server Prefix must be set in defs.py")
		raise Exception

	import os
	os.chdir(os.path.normpath('../data'))
	
	# dump
	mysqldump(source)

	# import
	target = import_db(source, target)
	
	# delete dump
	os.system('rm %s.sql' % source)
	
	return target

def import_db(source, target='', is_accounts=0):
	# dump source
	global mysql_path
	import MySQLdb
	import os

	if defs.root_login:
		global conn
		conn = MySQLdb.connect(user=defs.root_login, host=db_host, passwd=defs.root_password)

	if not target:
		res = sql('SHOW DATABASES')
		db_list = []
		for r in res:
			if r[0] and r[0].startswith(server_prefix):
				db_list.append(r[0])
		db_list.sort()
			
		if db_list:
			dbn = server_prefix + ('%.3i' % (int(db_list[-1][-3:]) + 1))
		else:
			dbn = server_prefix + '001'
		target = dbn
	
	os.chdir('../data')

	# create user and db
	sql("CREATE USER '%s'@'localhost' IDENTIFIED BY '%s'" % (target, db_password))
	sql("CREATE DATABASE IF NOT EXISTS `%s` ;" % target)
	sql("GRANT ALL PRIVILEGES ON `%s` . * TO '%s'@'localhost';" % (target, target))
	sql("FLUSH PRIVILEGES")
	sql("SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;")

	# import in target
	os.system('%smysql -u %s -p%s %s < %s.sql' % (mysql_path, target, db_password, target, source))

	sql("use %s;" % target)
	sql("create table `__DocTypeCache` (name VARCHAR(120), modified DATETIME, content TEXT)")
	sql("update tabProfile set password = password('admin') where name='Administrator'")

	# temp
 	sql("alter table tabSessions change sessiondata sessiondata longtext") 
	
	return target

def create_account_doctype():
	
	from webnotes.model.doc import Document
	import webnotes.model.db_schema

	# create tabAccount
	ac = Document('DocType')
	ac.name = 'Account'
	ac.autoname = 'AC.#####'
	ac.save(1)
		
	f = addchild(ac, 'fields', 'DocField')
	f.label = 'Account Name'
	f.fieldname = 'ac_name'
	f.fieldtype = 'Data'
	f.save()

	f = addchild(ac, 'fields', 'DocField')
	f.label = 'Database Name'
	f.fieldname = 'db_name'
	f.fieldtype = 'Data'
	f.save()

	f = addchild(ac, 'fields', 'DocField')
	f.label = 'Database Login'
	f.fieldname = 'db_login'
	f.fieldtype = 'Data'
	f.save()
		
	f = addchild(ac, 'permissions', 'DocPerm')
	f.role = 'Administrator'
	f.read = 1
	f.write = 1
	f.create = 1
	f.save()
	
	# udpate schema
	webnotes.model.db_schema.update_db('Account')
	
def create_account_record(ac_name):
	# update accounts
	from webnotes.model.doc import Document
	
	webnotes.conn = webnotes.db.Database(use_default = 1)
	ac = Document('Account')
	ac.ac_name = ac_name
	ac.db_name = newdb
	ac.name = newdb

	if not webnotes.conn.in_transaction:
		webnotes.conn.sql("start transaction")
	ac.save(1)
	webnotes.conn.sql("commit")


def create_account(ac_name, ac_type='Framework'):

	newdb = import_db(ac_type)

	# set account id
	use_account(my_db_name = newdb)
	if not in_transaction:
		sql("start transaction")
	sql("update tabSingles set value=%s where doctype='Control Panel' and field='account_id'", ac_name)
		
	sql("commit")

	return "Created %s (%s)" % (ac_name, newdb)

if __name__=='__main__':
	import sys, os
	
	# set path
	sys.path.append(os.path.abspath(os.path.dirname(sys.argv[0]) + '/../../'))	
	
	if sys.argv[1]=='install':
		# create the first account
		
		import webnotes.db
		
		print "Connecting to MySQL..." 
		webnotes.conn = webnotes.db.Database(use_default = 1)
		
		print "Importing Framework.sql..." 
		import_db("Framework", "accounts")
		
		print "Setting up Account..."
		create_account_doctype()
		