index_template = '''<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head id="head">
<!-- Web Notes Framework : www.webnotesframework.org -->

  <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
  <meta name="robots" content="index, follow" />
  <meta name="keywords" content="%(keywords)s" />
  <meta name="description" content="%(site_description)s" />
  <meta name="generator" content="Web Notes Framework Version v170 - Open Source Web Application Framework" />  
  
  <title>%(title)s</title>
  <link type="text/css" rel="stylesheet" href="css/default.css?v=1.6.0">
  <link type="text/css" rel="stylesheet" href="css/user.css?v=1.6.0">
  <link rel="Shortcut Icon" href="/favicon.ico">
  
  <script language="JavaScript" src="js/wnf.compressed.js"></script>
  %(add_in_head)s
  
  <script type="text/javascript">
    window.dhtmlHistory.create({ debugMode: false });
  </script>
</head>
<body>
<div id="startup_div" style="padding: 8px; font-size: 14px;">Loading...</div>

<!-- Main Starts -->

<div id="loading_div">
	<table><tr>
		<td style='width:20px'><img src='images/ui/loading.gif'></td>
		<td style='width:60px'>Loading...</td>
	</tr></table>
</div>

<div id="body_div"> 

	<!--static (no script) content-->
	<div class="no_script">
		%(content)s
	</div>

</div>
	
<div id="dialogs">
	<div id="dialog_message"></div>
</div>
<div id="dialog_back"></div>

<div id="floating_message">
	<table><tr>
	<td id="fm_content"></div>
	<td id="fm_cancel" class="link_type">Cancel</td>
	</tr></table>
</div>

</body>
</html>
'''

redirect_template = '''<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<title>%s</title>
<meta http-equiv="REFRESH" content="0; url=%s"></HEAD>
<BODY style="font-family: Arial; padding: 8px; font-size: 14px; margin: 0px;">
Redirecting...
</BODY>
</HTML>'''

import webnotes

def get_page_content(page):
	if not page:
		return 'No Title', 'No Content'
	
	if webnotes.conn.sql("select name from tabDocField where fieldname='static_content' and parent='Page'"):
		content = webnotes.conn.sql("select content, static_content from tabPage where name=%s", page)
		if content:
			content = content[0][1] or content[0][0]
	else:
		content = webnotes.conn.sql("select content from tabPage where name=%s", page)
		if content:
			content = content[0][0]
	
	# title
	if webnotes.conn.sql("select name from tabDocField where fieldname='page_title' and parent='Page'"):
		title = webnotes.conn.sql("select page_title from tabPage where name=%s", page)[0][0]
	else:
		title = page
	
	# dynamic (scripted) content
	if content and content.startswith('#python'):
		content = webnotes.model.code.execute(content)

	return title, content

def get_doc_content(dt, dn):
	import webnotes.model.code
	
	if dt in webnotes.user.get_read_list():
		# generate HTML
		do = webnotes.model.code.get_obj(dt, dn, with_children = 1)
		if hasattr(do, 'to_html'):
			return (dt + '-' + dn), do.to_html()
		else:
			import webnotes.model.doclist
			return (dt + '-' + dn), webnotes.model.doclist.to_html(do.doclist)
	else:
		return 'Forbidden - 404', '<h1>Forbidden - 404</h1>'

def get_static_content():
	import webnotes.widgets.page
	import urllib

	form = webnotes.form
	page_url = form.getvalue('page', '')
	
	if page_url:
		page_url = [urllib.unquote(i) for i in page_url.split('/')]		
	else:
		page_url = ['Page', webnotes.user.get_home_page()]
			
	content = ''
	
	# generate the page
	# -----------------	
	if page_url[0] == 'Page':
		title, content = get_page_content(page_url[1])
		
	elif page_url[0] == 'Form' and len(page_url)==3:
		title, content = get_doc_content(page_url[1], page_url[2])
		
	else:
		title, content = get_page_content(webnotes.user.get_home_page())
	
	content_html = content

	return title, content_html
	
def get():
	global index_template
	import webnotes.model.code
	
	template, add_in_head = index_template, ''
	cp = webnotes.model.code.get_obj('Control Panel', 'Control Panel')
	if hasattr(cp, 'get_index_template'):
		template = cp.get_index_template()
		
	if hasattr(cp, 'add_in_head'):
		add_in_head = cp.add_in_head()
		
	if '%(content)s' in template:

		title, content = get_static_content()
		keywords = webnotes.conn.get_value('Control Panel',None,'keywords') or ''
		site_description = webnotes.conn.get_value('Control Panel',None,'site_description') or ''
		
		template = template % {
			'title':title
			,'content':content
			,'keywords':keywords
			,'site_description':site_description
			,'add_in_head':add_in_head
		}
		
	return template