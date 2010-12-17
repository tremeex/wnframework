
# Note:
# Before "accounts", there must be a valid login id and a database to start off with
# 
# After "accounts" is created, login and pwd should point to accounts db

db_name = 's3u001'
db_login = 's3u001'
db_password = 'ac_user09'

# root
root_login = 'root'
root_password = 'route'
	
# default mail server
mail_server = 'localhost'
mail_login = 'test'
mail_password = 'test'

# new accounts will be created with this prefix
server_prefix = 's3u'

mysql_path = ''
files_path = ''

#LOG SETTINGS
log_file_path = '/home/anand/workspace/webnotes/wnframework/trunk/v170/log'
debug_log_dbs = ['accounts','s3u001']
log_level = 'logging.INFO' #possible values: logging.critical,error,warning,info,debug,notset
log_file_size = 1000 #In max bytes
log_file_backup_count = 5 #It is a rotating file handler. keeps upto 5 files


#MODULE MANAGER SETTINGS
modules_path = '/home/anand/workspace/webnotes/wnframework-modules/trunk'
developer_mode = 1
user_timezone = 'Asia/Calcutta'
