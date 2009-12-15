/* Copyright 2005-2008, Rushabh Mehta (RMEHTA _AT_ GMAIL) 

    Web Notes Framework is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    For a copy of the GNU General Public License see 
    <http://www.gnu.org/licenses/>.
    
    Web Notes Framework is also available under a commercial license with
    patches, upgrades and support. For more information see 
    <http://webnotestech.com>
*/


var fixh = 50;
var fixw = 182;
var toolbarh = 24;
var select_register = [];
var account_id = '';
var pagewidth = 480;
var NULL_CHAR = '^\5*';
var startup_lst = [];
var login_file = 'login.html';
var datatables = {} // deprecated
var __sid150; // session id required to store here for cross domain logins
var tinyMCE;
var editAreaLoader;

// Globals
var calendar; var Calendar; 
var GraphViewer;
var text_dialog;

try {
 document.execCommand('BackgroundImageCache', false, true);
} catch(e) {}


/* Version Detect */

var agt=navigator.userAgent.toLowerCase();
var appVer = navigator.appVersion.toLowerCase();
var is_minor = parseFloat(appVer);
var is_major = parseInt(is_minor);
var iePos = appVer.indexOf('msie');
if (iePos !=-1) {
	is_minor = parseFloat(appVer.substring(iePos+5,appVer.indexOf(';',iePos)))
	is_major = parseInt(is_minor);
}
var isIE = (iePos!=-1);
var isIE6 = (isIE && is_major <= 6);
var isIE7 = (isIE && is_minor >= 7);
if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
	var isFF = 1;
	var ffversion=new Number(RegExp.$1) // capture x.x portion and store as a number
	if (ffversion>=3) var isFF3 = 1;
	else if (ffversion>=2) var isFF2 = 1;
	else if (ffversion>=1) var isFF1 = 1;
}

/* History */

var _history_current;
function historyChange(newLocation, historyData) {
	//if(newLocation == _history_current) // already there
		//return;
		
	if(window.location.href.search('iwebnotes.com')!=-1) return; // no history for iwebnotes
	
	var t = newLocation.replace(/\%20/g, ' ');
	t = t.split('~~~');

	var c = nav_obj.ol[nav_obj.ol.length-1];

	if(t.length==2)	{
		if(c[0]==t[0] && c[1]==t[1]) return;
	} else {
		if(c[0]==t[0] && c[1]==t[1] && c[2]==t[2]) return;
	}
	
	if(t[0]=='DocType') {
		_history_current = newLocation;
		loaddoc(t[1], t[2]);
	} else if(t[0]=='Report') {
		_history_current = newLocation;
		loadreport(t[1], t[2]);
	} else if(t[0]=='Page') {
		_history_current = newLocation;
		loadpage(t[1]);
	} else if(t[0]=='Application') {
		_history_current = newLocation;
		loadapp(t[1]);
	}
	
};

var profile;
var session;

function startup() {
	fm = new FloatingMessage();

	//initialize our DHTML history
	dhtmlHistory.initialize();

	//subscribe to DHTML history change events
	dhtmlHistory.addListener(historyChange);

	// click on empty space
	addEvent('click', function(e, target) {
		if(target.className.substr(0,2)!='cp') {
			if(grid_click_event)grid_click_event(e, target);
			for (var i=0; i<popup_list.length; i++) { // clear all calendars
				if (popup_list[i]) { popup_list[i].hideIfNotClicked(e); show_selects(); }
			}
		}
	});
	
	addEvent('keydown', function(e, target) {
		if(isIE)var kc = window.event.keyCode;
		else var kc = e.keyCode;
		if(grid_selected_cell){ grid_selected_cell.grid.cell_keypress(e, kc); }
		
		// execute search on enter key ??
		if(kc==13 && cur_cont && cur_cont.page && cur_cont.page.name=='_search') {
			if(search_page.cur_finder 
				&& search_page.cur_finder.dt && (!selector.display)
						&& inList(['Result', 'Set Filters', 'Select Columns'], search_page.cur_finder.mytabs.cur_tab.label.innerHTML)) {
				search_page.cur_finder.dt.run();
				search_page.cur_finder.mytabs.tabs['Result'].show();
			}
		}
		
		// escape
		if(kc==27 && cur_dialog) cur_dialog.hide();
	});

	// Call backs
	// ----------
	var call_back1 = function(r,rt) {

		if(r.exc) { msgprint(r.exc); return; }

		// globals
		profile = r.profile
		user = r.profile.name;		
		user_fullname = profile.first_name + (r.profile.last_name ? (' ' + r.profile.last_name) : '');
		user_defaults = profile.defaults;
		user_roles = profile.roles;
		user_email = profile.email;

		sys_defaults = r.sysdefaults;
		
		session.startup = r.startup;
		session.rt = profile.;
		session.m_rt = r.m_rt;
		session.nt = r.nt;
		session.mi = eval(r.mi);
		session.from_gateway = r.from_gateway;
		session.n_online = r.n_online;
		account_id = r.account; // db_name
		session.account_name = r.account_id; // account name (from control panel)

		// home page
		home_page = r.home_page;

		makeui(r,rt);
	}


	var args = {}; 
	if(get_url_param('sid150')) { 
		args.sid150 = get_url_param('sid150'); 
		__sid150 = args.sid150; 
	}
	if(get_url_param('dbx')) args['dbx']=get_url_param('dbx');
	if(get_url_param('__account')) account_id = get_url_param('__account');
	$c('startup', args, call_back1);
	window.onscroll = function() { $i('loading_div').style.top = (get_scroll_top()+10)+'px'; }
}


/* 

Utility

*/

// URL Parameters

function get_url_param(name) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )
		return "";
	else
		return results[1];
}

// Load Script

function loadscript(src, call_back) {
	set_loading();
	var script = $a('head','script');
	script.type = 'text/javascript';
	script.src = src;
	script.onload = function() { 
		if(call_back)call_back(); hide_loading(); 
	}
	// IE 6 & 7
	script.onreadystatechange = function() {
		if (this.readyState == 'complete' || this.readyState == 'loaded') {
			hide_loading();
			call_back();
		}
	}
}

// Applications

var apps=[]; var cur_app; var last_app; var frame_adj = 0;
function Application(app_name) {
	var me = this;
	this.name = app_name;
	this.cont = new Container(app_name);
	this.cont.init();
	this.cont.has_frame = 1;
	this.cont.onhide = function() {
		//if(isFF && user=='rushabh@webnotestech.com') { // to save firefox from perpetually reloading
		//	$y(me.frame,{height:'0px'});
		//}
	}
	this.cont.onshow = function() {
		if(!this.frame_loaded)
			this.body.appendChild(me.frame);
		this.frame_loaded = 1;
	}
	apps[app_name] = this;
	return this;
}

function loadapp(app_name, sub_id) {
	if(apps[app_name]) {
		apps[app_name].cont.show();
		set_title(app_name);
		nav_obj.open_notify('Application',app_name,'');

		cur_page = null;
		cur_app = apps[app_name];
	} else {
		callback = function(r,rt) {
			if(r.exc) { msgprint(r.exc); return; }

			var app = new Application(app_name);
			app.frame = document.createElement('iframe');
			app.frame.className = 'app_frame';
			app.frame.app_name = app_name;
			app.frame.frameBorder = 0;

			// session details
			args={sid150:r.sid}; if(r.dbx)args.dbx=r.dbx; if(r.__account)args.__account=r.__account;
			nav_obj.open_notify('Application',app_name,'');
			app.frame.src = 'http://'+r.url+ '/index.cgi?'+makeArgString(args,1);
			cur_app = app;
			cur_app.cont.show();
			set_frame_dims();
			set_title(app_name);
			
		}
		var args = {'app_name':app_name}; if(sub_id) args.sub_id = sub_id;
		$c("login_app",args,callback);
	}
}


// Events

function addEvent(ev, fn) {
	if(isIE) {
		document.attachEvent('on'+ev, function() { 
			fn(window.event, window.event.srcElement); 
		});
	} else {
		document.addEventListener(ev, function(e) { fn(e, e.target); }, true);
	}
}



function get_content_dims() {
	var d = get_screen_dims();
	d.h = (d.h - fixh) + 'px';
	d.w = (d.w - fixw - 30) + 'px';
	return d;
}


//// document loading



// CHANGE NOTE ! redesign to observer pattern

function rename_from_local(doc) {
	// when a document is newly saved, it gets its localname from the server
	// as doc.localname

	if(doc.localname) { 
		// delete from local
		
		try {
			var old = locals[doc.doctype][doc.localname]; 
			old.parent = null; old.__deleted = 1;
		} catch(e) {
			alert("[rename_from_local] No Document for: "+ doc.localname);
		}

		var frm = frms[doc.doctype];

		if(frm && frm.opendocs[doc.localname]) {
			// local doctype copy
			local_dt[doc.doctype][doc.name] = local_dt[doc.doctype][doc.localname];
			local_dt[doc.doctype][doc.localname] = null;
			
			// update recent
			rdocs.remove(doc.doctype, doc.localname);
			rdocs.add(doc.doctype, doc.name, 1);

			// sections
			frm.cur_section[doc.name] = frm.cur_section[doc.localname];
			delete frm.cur_section[doc.localname];

			// editable
			frm.is_editable[doc.name] = frm.is_editable[doc.localname];
			delete frm.is_editable[doc.localname];

			// attach
			if(frm.attachments[doc.localname]) {
				frm.attachments[doc.name] = frm.attachments[doc.localname];
				frm.attachments[doc.localname] = null;
				for(var i in frm.attachments[doc.name]){ // rename each attachment
					frm.attachments[doc.name][i].docname = doc.name;
				}
			}

			// from form
			if(frm.docname == doc.localname)
				frm.docname = doc.name;	

			nav_obj.rename_notify(doc.doctype, doc.localname, doc.name)

			// cleanup
			frm.opendocs[doc.localname] = false;
			frm.opendocs[doc.name] = true;
		}
		
		// calendar
		if(calendar && calendar.has_event[doc.localname])
			calendar.has_event[doc.localname] = false;
		
		// todo
		if(todo && todo.docs[doc.localname]) {
			todo.docs[doc.name] = todo.docs[doc.localname];
			todo.docs[doc.name].docname = doc.name;
			todo.docs[doc.localname] = null;
		}
		delete doc.localname;
	}
}
	
///// dict type

function keys(obj) { var mykeys=[];for (key in obj) mykeys[mykeys.length]=key;return mykeys;}
function values(obj) { var myvalues=[];for (key in obj) myvalues[myvalues.length]=obj[key];return myvalues;}
function seval(s) { return eval('var a='+s+';a'); }

function in_list(list, item) {
	for(var i=0;i<list.length;i++) {
		if(list[i]==item) return true;
	}
	return false;
}
function has_common(list1, list2) {
	if(!list1 || !list2) return false;
	for(var i=0; i<list1.length; i++) {
		if(in_list(list2, list1[i]))return true;
	}
	return false;
}
var inList = in_list; // bc
function add_lists(l1, l2) {
	var l = [];
	for(var k in l1) l[l.length] = l1[k];
	for(var k in l2) l[l.length] = l2[k];
	return l;
}

function docstring(obj)  {
	var l = [];
	for(key in obj) {
		var v = obj[key];
		if(v!=null) {
			if(typeof(v)==typeof(1)) {
				l[l.length] = "'"+ key + "':" + (v + '');
			} else {
	   			v = v+''; // convert to string
   				l[l.length] = "'"+ key + "':'" + v.replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'";
   			}
   		}
	}
	return  "{" + l.join(',') + '}';
}

function ie_refresh(e) { $dh(e); $ds(e); }


/// Report Page
var Finder;

function ReportPage(parent) {
	var me = this;
	this.finders = {};

	// tool bar

	var div = $a(parent, 'div','',{margin:'0px 8px'});
	var htab = make_table($a(div,'div','',{padding:'4px', backgroundColor:'#DDD'}), 1,2, '100%', ['80%','20%']);
	
	this.main_title = $a($td(htab,0,0),'h2','',{margin: '0px 4px', display:'inline'});
		
	// close button
	$y($td(htab,0,1),{textAlign:'right'});
	this.close_btn = $a($a($td(htab,0,1),'div','',{padding: '2px', margin:'0px'}), 'img', '', {cursor:'pointer'});
	this.close_btn.src="images/icons/close.gif";
	this.close_btn.onclick = function() { nav_obj.show_last_open(); }

	this.button_area2 = $a($td(htab,0,1),'div',{marginTop:'8px'});

	// row 2
	var htab = make_table($a(div,'div','',{padding:'4px'}), 1,2, '100%', ['80%','20%']);

	this.button_area = $a($td(htab,0,0),'div');
	this.button_area2 = $a($td(htab,0,1),'div',{marginTop:'8px'});
	$y($td(htab,0,1),{textAlign:'right'});

	// new
	if(has_common(['Administrator', 'System Manager'], user_roles)) {
		// save
		var savebtn = $a(this.button_area2,'span','link_type',{marginRight:'8px'});
		savebtn.innerHTML = 'Save';
		savebtn.onclick = function() {if(me.cur_finder) me.cur_finder.save_criteria(); };
		
		// advanced
		var advancedbtn = $a(this.button_area2,'span','link_type');
		advancedbtn.innerHTML = 'Advanced';
		advancedbtn.onclick = function() { 
			if(me.cur_finder) {
				if(!me.cur_finder.current_loaded) {
					msgprint("error:You must save the report before you can set Advanced features");
					return;
				}
				loaddoc('Search Criteria', me.cur_finder.sc_dict[me.cur_finder.current_loaded]);
			}
		};
	}
	
	// buttons
	var runbtn = $a(this.button_area, 'button');
	runbtn.innerHTML = 'Run'.bold();
	runbtn.onclick = function() { if(me.cur_finder){
		me.cur_finder.dt.start_rec = 1;
		me.cur_finder.dt.run();} 
	}
	$dh(this.button_area);
	
	this.finder_area = $a(parent, 'div');

	// set a type
	this.set_dt = function(dt, onload) {
		// show finder
		$dh(me.home_area);
		$ds(me.finder_area);
		$ds(me.button_area);
		my_onload = function(f) {
			me.cur_finder = f;
			me.cur_finder.mytabs.tabs['Result'].show();
			if(onload)onload(f);
		}
	
		if(me.cur_finder)
			me.cur_finder.hide();
		if(me.finders[dt]){
			me.finders[dt].show(my_onload);
		} else {
			me.finders[dt] = new Finder(me.finder_area, dt, my_onload);
		}

	}
}
function loadreport(dt, rep_name, onload, menuitem) {
	var cb2 = function() { _loadreport(dt, rep_name, onload, menuitem); }

	if(Finder) { cb2(); }
	else loadscript('js/widgets/report_table.js', cb2);
}
function _loadreport(dt, rep_name, onload, menuitem) {
	search_page.set_dt(dt, function(finder) { 
		if(rep_name) {
			var t = finder.current_loaded;
			finder.load_criteria(rep_name);
			if(onload)onload(finder);
			if(menuitem) finder.menuitems[rep_name] = menuitem;
			if((finder.dt) && (!finder.dt.has_data() || finder.current_loaded!=t))finder.dt.run();
			if(finder.menuitems[rep_name]) finder.menuitems[rep_name].show_selected();
		}
		nav_obj.open_notify('Report',dt,rep_name);
	} );
	if(cur_page!='_search')loadpage('_search');
}


function addImg(parent, src, cls, w, h, opt_id) {
	var extn = src.split('.');
	extn = extn[1];
	if(isIE&&(extn.toLowerCase()=='png')) {
		var sp = $a(parent, 'span', cls);
		if(opt_id)opt_id = ' id="'+opt_id+'" ';
		else opt_id = '';
		var newhtml = "<span class=\""+cls+"\" style=\"width: "+w+"; height: "+h+"; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'" + src + "\', sizingMethod='scale');\""+opt_id+"></span>";
		//alert(newhtml);
		sp.outerHTML = newhtml;
    	return sp;
    } else {
    	var im = $a(parent, 'img', cls);
    	im.src = src;
    	return im;
    }
}


function hide_selects() {
	if(!isIE6)return;
	$dh('form_newsel');
	for(var i=0;i<select_register.length;i++) {
		select_register[i].style.visibility = 'hidden';
	}
}

function show_selects() {
	if(!isIE6)return;
	$ds('form_newsel');
	for(var i=0;i<select_register.length;i++) {
		select_register[i].style.visibility = 'visible';
	}
}

var fcount = 0;
var frozen = 0;
//var fmessage;

function get_scroll_top() {
	var st = 0;
	if(document.documentElement && document.documentElement.scrollTop)
		st = document.documentElement.scrollTop;
	else if(document.body && document.body.scrollTop)
		st = document.body.scrollTop;
	return st;
}

function set_loading() {
	var d = $i('loading_div')
	if(!d)return;
	d.style.top = (get_scroll_top()+10)+'px';
	$ds(d);
	pending_req++;
}
function hide_loading() {
	var d = $i('loading_div')
	if(!d)return;
	pending_req--;
	if(!pending_req)$dh(d);
}



function freeze(msg, do_freeze) {
	// show message
	if(msg) {
		var div = $i('dialog_message');

		var d = get_screen_dims();
		div.style.left = ((d.w - 250)/2) + 'px';
		div.style.top  = (get_scroll_top() + 200) + 'px';
		
		div.innerHTML = '<div style="font-size:16px; color: #444; font-weight: bold; text-align: center;">'+msg+'</div>';
		$ds(div);
	} 
	
	// blur
	hide_selects();	
	$ds($i('dialog_back'));
	$h($i('dialog_back'), document.body.offsetHeight+'px');
	fcount++;
	frozen = 1;
}
function unfreeze() {
	$dh($i('dialog_message'));
	if(!fcount)return; // anything open?
	fcount--;
	if(!fcount) {
		$dh($i('dialog_back'));
		show_selects();
		frozen = 0;
	}
}
// Floating Message

function FloatingMessage() {
	if($i('fm_cancel')) {
		$i('fm_cancel').onclick = function() {
			$dh($i('floating_message'));	
		}
		this.show = function(content) {
			$i('fm_content').innerHTML = content;
			$ds($i('floating_message'));
		}
	}
}

// Error Console:

var err_console;
var err_list = [];

function errprint(t) {
	err_list[err_list.length] = ('<pre style="font-family: Courier, Fixed; font-size: 11px; border-bottom: 1px solid #AAA; overflow: auto; width: 90%;">'+t+'</pre>');
}
function show_errors() {
	msgprint(err_list.join('\n'));
}

function submit_error(e) {
	if(isIE) {
		var t = 'Explorer: ' + e + '\n' + e.description;
	} else {
		var t = 'Mozilla: ' + e.toString() + '\n' + e.message + '\nLine Number:' + e.lineNumber;// + '\nStack:' + e.stack;
	}
	$c('client_err_log', args ={'error':t});
	errprint(e + '\nLine Number:' + e.lineNumber + '\nStack:' + e.stack);
}

function setup_err_console() {
	err_console = new Dialog(640, 480, 'Error Console')
	err_console.make_body([
		['HTML', 'Error List'],
		['Button', 'Ok'],
		['Button', 'Clear']
	]);
	err_console.widgets['Ok'].onclick = function() {
		err_console.hide();
	}
	err_console.widgets['Clear'].onclick = function() {
		err_list = [];
		err_console.rows['Error List'].innerHTML = '';
	}
	err_console.onshow = function() {
		about_dialog.hide();
		err_console.rows['Error List'].innerHTML = '<div style="padding: 16px; height: 360px; width: 90%; overflow: auto;">' 
			+ err_list.join('<div style="height: 10px; margin-bottom: 10px; border-bottom: 1px solid #AAA"></div>') + '</div>';
	}
}
startup_lst[startup_lst.length] = setup_err_console;
function show_alert(m) { fm.show(m); }

// Container
var cur_cont = '';
var containers = [];

function Container(name) { }

Container.prototype.init = function() {
	this.wrapper = $a(cont_area, 'div', 'container_div');
	if(isFF) {
		$dh(this.wrapper);
		$y(this.wrapper,{overflow:'hidden'});
	}
	this.head = $a(this.wrapper, 'div', 'container_head');
	this.body = $a(this.wrapper, 'div', 'container_body');
	if(this.oninit)this.oninit();
}

Container.prototype.show = function() {
	if(this.onshow)	this.onshow();
	if(cur_cont)cur_cont.hide();
	cur_cont = this;
	if(this.wrapper.style.display.toLowerCase()=='none') {
		$ds(this.wrapper);
		return;
	}
	//$ds(this.wrapper);
	if(isFF && this.has_frame) {
		$y(this.wrapper,{height:null})
	} else {
		$ds(this.wrapper); 
	}
}

Container.prototype.hide = function() { 
	if(this.onhide)	this.onhide();
	if(isFF && this.has_frame) {
		$y(this.wrapper,{height:'0px'})
	} else {
		$dh(this.wrapper); 
	}
	
	// hide autosuggest
	hide_autosuggest();
	cur_cont = ''; 
}

// Toolbar

function make_tbar_link(parent, label, fn, icon, isactive) {
	var div = $a(parent,'div','',{cursor:'pointer'});
	var t = make_table(div, 1, 2, '90%', ['20px',null]);
	var img = $a($td(t,0,0),'img');
	img.src = 'images/icons/'+icon;
	var l = $a($td(t,0,1),'span','link_type');
	l.style.fontSize = '11px';
	l.innerHTML = label;
	div.onclick = fn;
	div.show = function() { $ds(this); }
	div.hide = function() { $dh(this); }

	$td(t,0,0).isactive = isactive;
	$td(t,0,1).isactive = isactive;
	l.isactive = isactive;
	div.isactive = isactive;

	return div;
}

function Tool_Bar(parent, bottom_rounded, in_grid, btn_col) {
	this.body = $a(parent, 'div', 'tbar_body');
	this.buttons= {};
	this.btn_col = btn_col;
	this.in_grid = in_grid;
	
	if(bottom_rounded) {
		make_rounded(this.body, [0,0,1,1]);
	}

	this.hide = function() { $dh(this.body) }
	this.show = function() { $ds(this.body) }
}

Tool_Bar.prototype.make_button = function(name, onclick, imagesrc, w, bg, border) {
	var btn = $a(this.body, 'div');
	btn.my_class = 'tbar_button';
	if(!w)w=60;
	if(bg)$bg(btn,bg);
	if(border)$b(btn);
	$w(btn, w + 'px');
	
	if(imagesrc) {
		var t = $a(btn, 'table');
		var r = t.insertRow(0);r.insertCell(0); r.insertCell(1);
		$w(r.cells[0], '20px');
		btn.img = $a(r.cells[0], 'img');
		btn.img.src = 'images/icons/' + imagesrc;
		btn.my_class = 'tbar_imgbutton';
		r.cells[1].innerHTML = name;
		if(this.btn_col)
			r.cells[1].style.color = this.btn_col;
		btn.img.btn = btn;
		btn.img.isactive = this.in_grid;
		r.cells[0].isactive = this.in_grid;
		r.cells[1].isactive = this.in_grid;

	} else { btn.innerHTML = name; }

	btn.className = btn.my_class;
	btn.isactive = this.in_grid;

	btn.user_onclick = onclick;
	btn.onclick = function() { if(!this.is_disabled) { this.user_onclick(this); } };
	btn.set_disabled = function() { this.className = this.my_class + ' tbar_btn_disabled'; this.is_disabled = true; }
	btn.set_enabled = function() { this.className = this.my_class; this.is_disabled = false; }
	btn.onmouseover = function() { if(!this.is_disabled) { this.className = this.my_class + ' tbar_btn_over'; } }
 	btn.onmouseout = function() { if(!this.is_disabled) { this.className = this.my_class; } }
 	btn.onmousedown = function() { if(!this.is_disabled) { this.className = this.my_class + ' tbar_btn_down'; } }
 	btn.onmouseup = function() { if(!this.is_disabled) { this.className = this.my_class + ' tbar_btn_over'; } }
	btn.hide = function() { $dh(this); }
	btn.show = function() { $ds(this); }

	if(btn.img)btn.img.onclick = function() { if(!btn.is_disabled) this.btn.user_onclick(btn); }
	
	this.buttons[name] = btn;
	return btn;
}


function execJS(node)
{
  var bSaf = (navigator.userAgent.indexOf('Safari') != -1);
  var bOpera = (navigator.userAgent.indexOf('Opera') != -1);
  var bMoz = (navigator.appName == 'Netscape');

  if (!node) return;

  /* IE wants it uppercase */
  var st = node.getElementsByTagName('SCRIPT');
  var strExec;

  for(var i=0;i<st.length; i++) {
    if (bSaf) {
      strExec = st[i].innerHTML;
      st[i].innerHTML = "";
    } else if (bOpera) {
      strExec = st[i].text;
      st[i].text = "";
    } else if (bMoz) {
      strExec = st[i].textContent;
      st[i].textContent = "";
    } else {
      strExec = st[i].text;
      st[i].text = "";
    }

    try {
      var x = document.createElement("script");
      x.type = "text/javascript";

      /* In IE we must use .text! */
      if ((bSaf) || (bOpera) || (bMoz))
        x.innerHTML = strExec;
      else x.text = strExec;

      document.getElementsByTagName("head")[0].appendChild(x);
    } catch(e) {
      alert(e);
    }
  }
}


function set_message(t) { byId('messages').innerHTML = t; }

var known = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten',
    11: 'eleven',
    12: 'twelve',
    13: 'thirteen',
    14: 'fourteen',
    15: 'fifteen',
    16: 'sixteen',
    17: 'seventeen',
    18: 'eighteen',
    19: 'nineteen',
    20: 'twenty',
    30: 'thirty',
    40: 'forty',
    50: 'fifty',
    60: 'sixty',
    70: 'seventy',
    80: 'eighty',
    90: 'ninety'
    }

function in_words(n) {
    n=cint(n)
    if(known[n]) return known[n];
    var bestguess = n + '';
    var remainder = 0
    if(n<=20)
    	alert('Error while converting to words');
    else if(n<100) {
        return in_words(Math.floor(n/10)*10) + '-' + in_words(n%10);
    } else if(n<1000) {
        bestguess= in_words(Math.floor(n/100)) + ' ' + 'hundred';
        remainder = n%100;
    } else if(n<100000) {
        bestguess= in_words(Math.floor(n/1000)) + ' ' + 'thousand';
        remainder = n%1000;
    } else if(n < 10000000) {
        bestguess= in_words(Math.floor(n/100000)) + ' ' + 'lakh';
        remainder = n%100000;
    } else {
        bestguess= in_words(Math.floor(n/10000000)) + ' ' + 'crore'
        remainder = n%10000000
    }
    if(remainder) {
        if(remainder >= 100) comma = ','
        else comma = ''
        return bestguess + comma + ' ' + in_words(remainder);
    } else {
        return bestguess;
    }
}


/// OLD APP 2

var READ = 0; var WRITE = 1; var CREATE = 2; var SUBMIT = 3; var CANCEL = 4; var AMEND = 5;
var NEWLINE = '\n';

var exp_icon = "images/ui/right-arrow.gif"; 
var min_icon = "images/ui/down-arrow.gif";

var FG1 = "#FFFFAA";
var FG2 = "#DDDDDD";
var BG1 = "#FFFFFF";
var BG2 = "#F8F8F8";

var user;
var frms = {};
var frm_con;
var session = {};
var cal;
var selector;
var is_testing = false;
var tree;
var user_defaults; var user_roles; var user_fullname; var user_recent; var user_email;
var user_img = {};
var recent_docs = [];
session.al = [];
var max_dd_rows;
var cur_frm;
var popup_list = [];
var scroll_list=[];
var grid_selected_cell;
var cont_area;

var tables_parents;
var no_value_fields = ['Section Break', 'Column Break', 'HTML', 'Table', 'FlexTable', 'Button', 'Image'];

function makeui(r, rt) {
	// load data

	if(r.exc) { msgprint(r.exc); return; }

	if(!user) {
		msgprint('Not Logged In',0,logout);
		return;
	}

	// check if password has expired
	check_pwd_expiry();

	session.al = r.al;
	user_recent = r.recent_documents;
	
	if(cint(r.testing_mode)) {
		alert(r.testing_mode);
		is_testing = true;
	}

	// exec startup functions;
	for(var i=0;i<startup_lst.length;i++) {
		startup_lst[i]();
	}
	
	if(session.from_gateway) { $dh('user_div')}
	$i('user_id').innerHTML = user_fullname ? user_fullname : user;
	$ds('body_div');
	
	// force vertical scroll for IE * except in Gateway account
	if(isIE)$y(document.getElementsByTagName('html')[0],{overflowY:'scroll'});
	$dh('startup_div');
	if(isIE) {
		$i('dialog_back').style['filter'] = 'alpha(opacity=60)';
	}
	
	// display
	window.onresize = set_frame_dims;
	set_frame_dims();

	loadpage('_home');
	
	if(sys_defaults.login_file)login_file = sys_defaults.login_file;	
}

var export_dialog;
function export_ask_for_max_rows(query, callback) {

	if(!export_dialog) {
		var d = new Dialog(400, 300, "Export...");
		d.make_body([
			['Data', 'Max rows', 'Blank to export all rows'],
			['Button', 'Go'],
		]);	
		d.widgets['Go'].onclick = function() {
			export_dialog.hide();
			n = export_dialog.widgets['Max rows'].value;
			if(cint(n))
				export_dialog.query += ' LIMIT 0,' + cint(n);
			callback(export_dialog.query);
		}
		d.onshow = function() {
			this.widgets['Max rows'].value = '500';
		}
		export_dialog = d;
	}
	export_dialog.query = query;
	export_dialog.show();
}

function open_url_post(URL, PARAMS) {
	var temp=document.createElement("form");
	temp.action=URL;
	temp.method="POST";
	temp.style.display="none";
	for(var x in PARAMS) {
		var opt=document.createElement("textarea");
		opt.name=x;
		opt.value=PARAMS[x];
		temp.appendChild(opt);
	}
	document.body.appendChild(temp);
	temp.submit();
	return temp;
}

function export_csv(q, report_name, sc_id, is_simple, filter_values, colnames) {
	var args = {}
	args.cmd = 'runquery_csv';
	args.__account = account_id;
	if(__sid150) args.sid150 = __sid150;
    if(is_simple) args.simple_query = q; else args.query = q;
    args.sc_id = sc_id ? sc_id : '';
    args.filter_values = filter_values ? filter_values: '';
    if(colnames) args.colnames = colnames.join(',');
	args.report_name = report_name ? report_name : '';
	args.defaults = pack_defaults();
	args.roles = '["'+user_roles.join('","')+'"]';
	open_url_post(outUrl, args);
}

var print_dialog;
function show_print_dialog(args) {
	if(!print_dialog) {
		var d = new Dialog(400, 300, "Print");
		d.make_body([
			['Data', 'Max rows', 'Blank to print all rows'],
			['Data', 'Rows per page'],
			['Button', 'Go'],
		]);	
		d.widgets['Go'].onclick = function() {
			print_dialog.hide();
			go_print_query(print_dialog.args, cint(print_dialog.widgets['Max rows'].value), cint(print_dialog.widgets['Rows per page'].value))
		}
		d.onshow = function() {
			this.widgets['Rows per page'].value = '35';
			this.widgets['Max rows'].value = '500';
		}
		print_dialog = d;
	}
	print_dialog.args = args;
	print_dialog.show();
}

function print_query(args) { show_print_dialog(args); }

function go_print_query(args, max_rows, page_len) {
 //q, title, colnames, colwidths, coltypes, has_index, check_limit, is_simple
 
	// limit for max rows
    if(cint(max_rows)!=0) args.query += ' LIMIT 0,' + cint(max_rows);

	if(!args.query) return;

	var callback = function(r,rt) {

		if(!r.values) { return; }
		if(!page_len) page_len = r.values.length;

		// add serial num column
				
		if(r.colnames && r.colnames.length) 
			args.colnames = args.has_index ? add_lists(['Sr'],r.colnames) : r.colnames;
		if(r.colwidths && r.colwidths.length) 
			args.colwidths = args.has_index ? add_lists(['25px'],r.colwidths) : r.colwidths;
		if(r.coltypes) 
			args.coltypes = args.has_index ? add_lists(['Data'],r.coltypes) : r.coltypes;

		if(args.coltypes) {
			for(var i in args.coltypes) 
				if(args.coltypes[i]=='Link') args.coltypes[i]='Data';
		}

		// fix widths to %
		if(args.colwidths) {
			var tw = 0;
			for(var i=0; i<args.colwidths.length; i++) tw+=cint(args.colwidths[i] ? args.colwidths[i]: 100);
			for(var i=0; i<args.colwidths.length; i++) args.colwidths[i]= cint(cint(args.colwidths[i] ? args.colwidths[i] : 100) / tw * 100) + '%';
		}
		

		var has_heading = args.colnames ? 1 : 0;
		if(!args.has_headings) has_heading = 0;
		
		var tl = []
		for(var st=0; st< r.values.length; st = st + page_len) {
			tl.push(print_query_table(r, st, page_len, has_heading, args.finder))
		}
		
		var html = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'
			+ '<html><head>'
			+'<title>'+args.title+'</title>'
			+'<style>'+def_print_style+'</style>'
			+'</head><body>'
			+ (r.header_html ? r.header_html : '')
			+ tl.join('\n<div style="page-break-after: always;"></div>\n')
			+ (r.footer_html ? r.footer_html : '')
			+'</body></html>';
		print_go(html)    
	}
	var out_args = copy_dict(args);
	if(args.is_simple) {
		out_args.simple_query = args.query;
		delete out_args.query;
	} else {
		out_args.defaults = pack_defaults();
		out_args.roles = '["'+user_roles.join('","')+'"]';
	}
	// add filter values
	if(args.filter_values) 
		out_args.filter_values = args.filter_values;
	$c('runquery', out_args, callback);
}

function print_query_table(r, start, page_len, has_heading, finder) {
	// print a table
	var div = document.createElement('div');
	
	if(!r.page_template) {
		var head = $a(div,'div',null,{fontSize:'20px', fontWeight:'bold', margin:'16px 0px', borderBottom: '1px solid #CCC', paddingBottom:'8px'});
		head.innerHTML = args.title;
	}

	var m = start + page_len;
	if(m>r.values.length) m = r.values.length
		
	var t = make_table(div, m + has_heading - start, r.values[0].length + args.has_index, '100%', null);
	t.className = 'simpletable';
	if(args.colwidths)
		$y(t,{tableLayout:'fixed'});

	if(has_heading) {
		for(var i=0; i < args.colnames.length; i++) {
			$td(t,0,i).innerHTML = args.colnames[i].bold();
			if(args.colwidths && args.colwidths[i]) {
				$w($td(t,0,i),args.colwidths[i]);
			}
		}
	}

	for(var ri=start; ri<m; ri++) {
		// Sr No
		if(args.has_index)
			$td(t,ri+has_heading-start,0).innerHTML=ri+1;
		for(var ci=0; ci<r.values[0].length; ci++) {
			if(ri-start==0 && args.colwidths && args.colwidths[i]){
				$w($td(t,0,i), args.colwidths[i]); // colwidths for all
			}
			var c = $td(t,ri+has_heading-start,ci + args.has_index)
			c.div = $a(c, 'div');
			$s(
				c.div, 
				r.values[ri][ci],
				args.coltypes ? args.coltypes[ci + args.has_index] : null
			);
		}
	}

	// user style
	if(r.style) {
		for(var i=0;i<r.style.length;i++) {
			$yt(t,r.style[i][0],r.style[i][1],r.style[i][2]);
		}
	}

	if(finder && finder.aftertableprint) {
		finder.aftertableprint(t);
	}
		
	if(r.page_template) return repl(r.page_template, {table:div.innerHTML});
	else return div.innerHTML;

}
var wn_toolbar;
var left_sidebar_width = 0;
var right_sidebar_width = 0;
var header_height = 40;
var footer_height = 0;
var overall_width = 0;
var home_page;
var hide_webnotes_toolbar = false;

function setup_display() {
	var cp = locals['Control Panel']['Control Panel'];
	
	// top menu
	wn_toolbar = new MenuToolbar($i('topmenu_div'))
	
	// background
	if(cp.background_color) {
		$y($i('center_div'),{backgroundColor:cp.background_color});
		$y($i('menu_div'),{backgroundColor:cp.background_color});
		$y($i('footer_div'),{backgroundColor:cp.background_color});
	}
	
	// header
	if(cint(cp.header_height)) {
		header_height = cint(cp.header_height);
	}

	// header
	if(cint(cp.footer_height)) {
		footer_height = cint(cp.footer_height);
		if(cp.footer_html)$i('footer_div').innerHTML = cp.footer_html;
	}

	// left sidebar
	if(cint(cp.left_sidebar_width)) {
		left_sidebar_width = cint(cp.left_sidebar_width);
	}
	
	// right sidebar
	if(cint(cp.right_sidebar_width)) {
		right_sidebar_width = cint(cp.right_sidebar_width);
	}

	// webnotes toolbar
	hide_webnotes_toolbar = cint(user_defaults.hide_webnotes_toolbar)
	
	if(!hide_webnotes_toolbar)
		hide_webnotes_toolbar = cint(cp.hide_webnotes_toolbar);
		
	if(user=='Administrator') hide_webnotes_toolbar = false;
	
	if(hide_webnotes_toolbar) { $dh('wn_toolbar'); }
	
	// container area
	cont_area = $a('center_div','div','center_area');
		
	// client logo
	if(cp.client_logo){
		var img = $a('head_banner', 'img');
		img.src = 'images/' +cp.client_logo;
		img.setAttribute('height','40px');
	} else if(cp.client_name) {
		$i('head_banner').innerHTML = cp.client_name;
	}

	// width
	if(cp.page_width) {
		set_overall_width(cp.page_width);
		pagewidth = overall_width - left_sidebar_width - right_sidebar_width - 32;
	} else {
		pagewidth = screen.width - left_sidebar_width - right_sidebar_width - cint(screen.width * 0.1);
	}
	max_dd_rows = 15;
	
	// selector
	if(cint(cp.new_style_search))
		makeselector2();
	else
		makeselector();
		
	// startup
	if(cp.startup_code)
		eval(cp.startup_code)
	if(pscript.client_startup)
		pscript.client_startup();
	
}
startup_lst[startup_lst.length] = setup_display;

function set_overall_width(w) {
	overall_width = cint(w);
	pagewidth = overall_width - left_sidebar_width - right_sidebar_width - 32;
}

// Quick Search
var search_sel;
function setup_search_select() { 
	// Set Quick Search
	search_sel = $a('qsearch_sel', 'select');
	add_sel_options(search_sel, session.m_rt);
	search_sel.selectedIndex = 0;
	search_sel.onchange = function() { open_quick_search(); }
	select_register[select_register.length] = search_sel;

	var search_btn = $a('qsearch_btn', 'button');
	search_btn.innerHTML = 'Search';
	search_btn.onclick = function() { open_quick_search(); }
}
function open_quick_search() {
	selector.set_search(sel_val(search_sel));
	search_sel.disabled = 1;
	selector.show();
}
startup_lst[startup_lst.length] = setup_search_select;

var load_todo = function() { 
	loadpage('_todo');
}
var load_cal = function() { 
	loadpage('_calendar');
}

// Start
function setup_more() {

	//if(!session.mi.length)return;
	
	var tm = wn_toolbar.add_top_menu('Start', function() { });
	
	var fn = function() {
		if(this.dt=='Page')
			loadpage(this.dn);
		else
			loaddoc(this.dt, this.dn);
		mclose();
	}

	wn_toolbar.add_item('Start','To Do', load_todo);
	wn_toolbar.add_item('Start','Calendar', load_cal);

	// add menu items
	session.mi.sort(function(a,b){return (a[4]-b[4])});
	for(var i=0;i< session.mi.length;i++) {
		var d = session.mi[i];
		var mi = wn_toolbar.add_item('Start',d[1], fn);
		mi.dt = d[0]; mi.dn = d[5]?d[5]:d[1];
	}
}

startup_lst[startup_lst.length] = setup_more;

// home
function setup_home() {
	wn_toolbar.add_top_menu('Home', function() { loadpage(home_page); } );
}

startup_lst[startup_lst.length] = setup_home;

// new docs
function setup_new_docs() {
	wn_toolbar.add_top_menu('New', function() {  } );

	var fn = function() {
		new_doc(this.dt);
		mclose();
	}
	
	// add menu items
	for (var i=0;i<session.nt.length;i++) {
		var mi = wn_toolbar.add_item('New',session.nt[i], fn);
		mi.dt = session.nt[i];
	}
}

startup_lst[startup_lst.length] = setup_new_docs;

// recent docs
var rdocs;
function setup_recent_docs() {

	rdocs = wn_toolbar.add_top_menu('Recent', function() { /*loadpage('_recent');*/ } );
	rdocs.items = {};

	var fn = function() { // recent is only for forms
		loaddoc(this.dt, this.dn);
		mclose();
	}
	
	rdocs.add = function(dt, dn, on_top) {
		if(!in_list(['Start Page','ToDo Item','Event','Search Criteria'], dt)) {

			// if there in list, only bring it to top
			if(this.items[dt+'-'+dn]) {
				var mi = this.items[dt+'-'+dn];
				mi.bring_to_top();
				return;
			}

			var tdn = dn;
			//if(dn.length>20)tdn = dn.substr(0,20) + '...';
			var rec_label = '<table style="width: 100%" cellspacing=0><tr>'
				+'<td style="width: 10%; vertical-align: middle;"><div class="status_flag" id="rec_'+dt+'-'+dn+'"></div></td>'
				+'<td style="width: 50%; text-decoration: underline; color: #22B; padding: 2px;">'+tdn+'</td>'
				+'<td style="font-size: 11px;">'+dt+'</td></tr></table>';
		
			var mi = wn_toolbar.add_item('Recent',rec_label,fn, on_top);
			mi.dt = dt; mi.dn = dn;	
			this.items[dt+'-'+dn] = mi;
			if(pscript.on_recent_update)pscript.on_recent_update();
		}
	}
	rdocs.remove = function(dt, dn) {
		var it = rdocs.items[dt+'-'+dn];
		if(it)$dh(it);
		if(pscript.on_recent_update)pscript.on_recent_update();
	}
	// add menu items
	var rlist = user_recent.split('\n');
	var m = rlist.length;
	if(m>15)m=15;
	for (var i=0;i<m;i++) {
		var t = rlist[i].split('~~~');
		if(t[1]) {
			var dn = t[0]; var dt = t[1];
			rdocs.add(dt, dn, 0);
		}
	}
}

startup_lst[startup_lst.length] = setup_recent_docs;

// Reports
var search_page;
function setup_search_page() {

	var tmp = new Page('_search');
	tmp.cont.body.style.height = '100%'; // IE FIX
	search_page = new ReportPage(tmp.cont.body);

	wn_toolbar.add_top_menu('Report Builder', function() {  } );

	var fn = function() {
		loadreport(this.dt);
		mclose();
	}
	
	// add menu items
	for (var i=0;i<session.rt.length;i++) {
		var mi = wn_toolbar.add_item('Report Builder',session.rt[i], fn);
		mi.dt = session.rt[i];
	}
}

startup_lst[startup_lst.length] = setup_search_page;

// start To Do
var ToDoList;
var todo;
function setup_todo() {
	var hpage = new Page('_todo');
	hpage.cont.body.style.height = '100%'; // IE FIX
	hpage.cont.onshow = function() { 
		if(!todo) todo = new ToDoList(hpage.cont.body); 
		todo.organize_by_priority();
	}
}
startup_lst[startup_lst.length] = setup_todo;

// calendar
function setup_calendar() {
	calpage = new Page('_calendar');
	calpage.cont.body.style.height = '100%'; // IE FIX
	calpage.cont.onshow = function() { 
		if(!calendar) {
			calendar = new Calendar();
			calendar.init(calpage.cont.body);
		}
	}
}
startup_lst[startup_lst.length] = setup_calendar;

// Back Link
var has_back_link = 0;
function setup_back_link() {
	if($i('back_link')) {
		has_back_link = 1;
		$i('back_link').onclick = function() {
			nav_obj.show_last_open();
		}
	}
}

startup_lst[startup_lst.length] = setup_back_link;


function check_perm_match(p, dt, dn) {
	if(!dn) return true;
	var out =false;
	if(p.match) {
		if(user_defaults[p.match]) {
			for(var i=0;i<user_defaults[p.match].length;i++) {
				 // user must have match field in defaults
				if(user_defaults[p.match][i]==locals[dt][dn][p.match]) {
				    // must match document
		  			return true;
				}
			}
			return false;
		} else if(!locals[dt][dn][p.match]) { // blanks are true
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
}

/*

Note: Submitted docstatus overrides the permissions. To ignore submit condition
pass ignore_submit=1

*/

function get_perm(doctype, dn, ignore_submit) {

	var perm = [[0,0],];
	if(in_list(user_roles, 'Administrator')) perm[0][READ] = 1;
	var plist = getchildren('DocPerm', doctype, 'permissions', 'DocType');
	for(var pidx in plist) {
		var p = plist[pidx];
		var pl = cint(p.permlevel?p.permlevel:0);
		// if user role
		if(in_list(user_roles, p.role)) {
			// if field match
			if(check_perm_match(p, doctype, dn)) { // new style
				if(!perm[pl])perm[pl] = [];
				if(!perm[pl][READ]) { 
					if(cint(p.read))  perm[pl][READ]=1;   else perm[pl][READ]=0;
				}
				if(!perm[pl][WRITE]) { 
					if(cint(p.write)) { perm[pl][WRITE]=1; perm[pl][READ]=1; }else perm[pl][WRITE]=0;
				}
				if(!perm[pl][CREATE]) { 
					if(cint(p.create))perm[pl][CREATE]=1; else perm[pl][CREATE]=0;
				}
				if(!perm[pl][SUBMIT]) { 
					if(cint(p.submit))perm[pl][SUBMIT]=1; else perm[pl][SUBMIT]=0;
				}
				if(!perm[pl][CANCEL]) { 
					if(cint(p.cancel))perm[pl][CANCEL]=1; else perm[pl][CANCEL]=0;
				}
				if(!perm[pl][AMEND]) { 
					if(cint(p.amend)) perm[pl][AMEND]=1;  else perm[pl][AMEND]=0;
				}
			}
		}
	}

	if((!ignore_submit) && dn && locals[doctype][dn].docstatus>0) {
		for(pl in perm)
			perm[pl][WRITE]=0; // read only
	}
	return perm;
}

//
// Startup
//

var grid_click_event;

function set_frame_dims() {
	var d = get_screen_dims();

	var toolbar_height = 26;
	if(hide_webnotes_toolbar) toolbar_height = 0;

	var main_top = header_height + toolbar_height;
	var head_h = main_top ? (main_top + 1) : 0;
	if(isIE && head_h)head_h = head_h + 1;
	
	// overall width
	if(overall_width) { 
		d.w = overall_width;
		if(isIE) { d.w = d.w - 1; }
		
		$w($i('main_div'), d.w + 'px');
		$w($i('head_div'), d.w + 'px');
		$w($i('center_div'), (d.w - left_sidebar_width - right_sidebar_width) + 'px');
	}
	
	// set heights
	$h($i('head_div'), head_h + 'px');
	if(footer_height)
		$h($i('footer_div'), footer_height + 'px');

	// set widths
	
	if(left_sidebar_width) 	$w($i('menu_div'), left_sidebar_width + 'px');
	else					$w($i('menu_div'), '0px');

	if(right_sidebar_width) $w($i('right_sidebar_div'), right_sidebar_width + 'px');
	else					$w($i('right_sidebar_div'), '0px');
	
	// set app iframe dims
	if(cur_app) {
		var footer_buff = 4;
		$y(cont_area,{margin:'0px',border:'0px'});
		$y(cur_app.frame,{height:(d.h - main_top - footer_height - footer_buff - frame_adj) + 'px'})
	}
}

function edit_profile() { loaddoc("Profile", user); }
function logout() {
	$c('logout', args = {}, function() { window.location = login_file; });
}



function DocLink(p, doctype, name, onload) {
	var a = $a(p,'span','link_type'); a.innerHTML = a.dn = name; a.dt = doctype;
	a.onclick=function() { loaddoc(this.dt,this.dn,onload) }; return a;
}
var doc_link = DocLink;

function page_link(p, name, onload) {
	var a = $a(p,'span','link_type'); a.innerHTML = a.pn = name;
	a.onclick=function() { loadpage(this.pn,onload) }; return a;
}

function setlinkvalue(name) {
	selector.hide();
	selector.input.set(name);// in local
	selector.input.set_input(name); // on screen
	if(selector.input.txt)selector.input.txt.onchange();
}

function pack_defaults() {
	myd = [];
	for(var d in user_defaults) {
		myd[myd.length] = '"'+d+'":["' + user_defaults[d].join('", "') + '"]';
	}
	return '{'+myd.join(',')+'}';
}

// Calculator 
// ----------
var calc_dialog;
function show_calc(tab, colnames, coltypes, add_idx) {
	if(!add_idx) add_idx = 0;
	if(!tab || !tab.rows.length) { msgprint("No Data"); return; }
	
	if(!calc_dialog) {
		var d = new Dialog(400,400,"Calculator")
		d.make_body([
			['Select','Column']
			,['Data','Sum']
			,['Data','Average']
			,['Data','Min']
			,['Data','Max']
		])
		d.widgets['Sum'].readonly = 'readonly';
		d.widgets['Average'].readonly = 'readonly';
		d.widgets['Min'].readonly = 'readonly';
		d.widgets['Max'].readonly = 'readonly';
		d.widgets['Column'].onchange = function() {
			d.set_calc();
		}
		d.set_calc = function() {
			// get the current column of the data table
			var cn = sel_val(this.widgets['Column']);
			var cidx = 0; var sum=0; var avg=0; var minv = null; var maxv = null;
			for(var i=0;i<this.colnames.length;i++) {if(this.colnames[i]==cn){ cidx=i+add_idx; break; } }
			for(var i=0; i<this.datatab.rows.length; i++) {
				var c = this.datatab.rows[i].cells[cidx];
				var v = c.div ? flt(c.div.innerHTML) : flt(c.innerHTML);
				sum += v;
				if(minv == null) minv = v;
				if(maxv == null) maxv = v;
				if(v > maxv)maxv = v;
				if(v < minv)minv = v;
			}
			d.widgets['Sum'].value = fmt_money(sum);
			d.widgets['Average'].value = fmt_money(sum / this.datatab.rows.length);
			d.widgets['Min'].value = fmt_money(minv);
			d.widgets['Max'].value = fmt_money(maxv);
			calc_dialog = d;
		}
		d.onshow = function() {
			// set columns
			var cl = []; 
			for(var i in calc_dialog.colnames) {
				if(in_list(['Currency','Int','Float'],calc_dialog.coltypes[i])) 
					cl.push(calc_dialog.colnames[i]);
			}
			if(!cl.length) {
				this.hide();
				alert("No Numeric Column");
				return;
			}
			var s = this.widgets['Column'];
			empty_select(s);
			add_sel_options(s, cl); s.selectedIndex = 0;
			this.set_calc();
		}
		calc_dialog = d;
	}
	calc_dialog.datatab = tab;
	calc_dialog.colnames = colnames;
	calc_dialog.coltypes = coltypes;
	calc_dialog.show();
}


/* Document */

// RENAME

function rename_doc() {
	if(!cur_frm)return; var f = cur_frm;
	new_name = prompt('Enter a new name for ' + f.docname, '');
	if(new_name) {
		$c('rename', args = {'dt': f.doctype, 'old':f.docname, 'new':new_name}, 
		function(r, rtxt) { f.refresh(); });
	}
}

// NEW
function new_doc(doctype, onload) {
	loadfrm(function() { _new_doc(doctype, onload); });
}

function _new_doc(doctype, onload) {	
	if(!doctype) {
		if(cur_frm)doctype = cur_frm.doctype; else return;
	}
	
	var fn = function() {
		frm = frms[doctype];
		// load new doc	
		if (frm.perm[0][CREATE]==1) {
			if(frm.meta.issingle) {
				var d = doctype;
				set_default_values(locals[doctype][doctype]);
			} else 
				var d = LocalDB.create(doctype);
				
			if(onload)onload(d);
			nav_obj.open_notify('DocType',doctype,d);
			frm.show(d);
		} else {
			msgprint('error:Not Allowed To Create '+doctype+'\nContact your Admin for help');
		}
	}
	
	if(!frms[doctype]) frm_con.add_frm(doctype, fn); // load
	else fn(frms[doctype]); // directly
}
var newdoc = new_doc;

// RELOAD

function reload_doc() {
	if(frms['DocType'] && frms['DocType'].opendocs[cur_frm.doctype]) {
		msgprint("error:Cannot refresh an instance of \"" + cur_frm.doctype+ "\" when the DocType is open.");
		return;
	}

	var ret_fn = function(r, rtxt) {
		// n tweets and last comment
		var t = cur_frm.doctype + '/' + cur_frm.docname;
		if(r.n_tweets) n_tweets[t] = r.n_tweets;
		if(r.last_comment) last_comments[t] = r.last_comment;
		
		cur_frm.runclientscript('setup', cur_frm.doctype, cur_frm.docname);
		cur_frm.refresh();
	}

	if(cur_frm.doc.__islocal) { 
		// reload only doctype
		$c('getdoctype', {'doctype':cur_frm.doctype }, ret_fn, null, null, 'Refreshing ' + cur_frm.doctype + '...');
	} else {
		// delete all unsaved rows
		var gl = cur_frm.grids;
		for(var i = 0; i < gl.length; i++) {
			var dt = gl[i].df.options;
			for(var dn in locals[dt]) {
				if(locals[dt][dn].__islocal && locals[dt][dn].parent == cur_frm.docname) {
					var d = locals[dt][dn];
					d.parent = '';
					d.docstatus = 2;
					d.__deleted = 1;
				}
			}
		}
		// reload doc and docytpe
		$c('getdoc', {'name':cur_frm.docname, 'doctype':cur_frm.doctype, 'getdoctype':1, 'user':user}, ret_fn, null, null, 'Refreshing ' + cur_frm.docname + '...');
	}
}

// LOADDOC

function loadfrm(call_back) {
	var fn = function() {
		frm_con = new FrmContainer();
		frm_con.init();
		call_back();
	}
	if(!frm_con) fn();
	else call_back();
}

function loaddoc(doctype, name, onload, menuitem) {
	loadfrm(function() { _loaddoc(doctype, name, onload, menuitem); });
}
function _loaddoc(doctype, name, onload, menuitem) {

	selector.hide(); // if loaded	
	if(!name)name = doctype; // single
	
	var fn = function(r,rt) {

		if(locals[doctype] && locals[doctype][name]) {
			var frm = frms[doctype];
			// menu item
			if(menuitem) frm.menuitem = menuitem;
			if(onload)onload(frm);
			
			// back button
			nav_obj.open_notify('DocType',doctype,name);
			
			// tweets
			if(r && r.n_tweets) n_tweets[doctype+'/'+name] = r.n_tweets;
			if(r && r.last_comment) last_comments[doctype+'/'+name] = r.last_comment;

			
			// show
			frm.show(name);

			// show menuitem selected
			if(frm.menuitem) frm.menuitem.show_selected();
			cur_page = null;
		} else {
			msgprint('error:There where errors while loading ' + doctype + ',' + name);
		}
	}
	
	// dont open doctype and docname from the same session
	if(frms['DocType'] && frms['DocType'].opendocs[doctype]) {
		msgprint("Cannot open an instance of \"" + doctype + "\" when the DocType is open.");
		return;
	}
	
	if(!frms[doctype]) {
		frm_con.add_frm(doctype, fn, name); // load
	} else {		
		if(is_doc_loaded(doctype, name)) {
			// DocTypes must always be reloaded (because their instances may not have scripts)
			fn(); // directly	
		} else {
			$c('getdoc', {'name':name, 'doctype':doctype, 'user':user}, fn, null, null, 'Loading ' + name);	// onload
		}
	}
}
var load_doc = loaddoc;
var loaded_doctypes = [];


window.onload = startup;

// Local DB 
//-----------

var locals = {};
var fields = {}; // fields[doctype][fieldname]
var fields_list = {}; // fields_list[doctype]
var LocalDB={};

LocalDB.getchildren = function(child_dt, parent, parentfield, parenttype) { 
	var l = []; 
	for(var key in locals[child_dt]) {
		var d = locals[child_dt][key];
		if((d.parent == parent)&&(d.parentfield == parentfield)) {
			if(parenttype) {
				if(d.parenttype==parenttype)l.push(d);
			} else { // ignore for now
				l.push(d);
			}
		}
	} 
	l.sort(function(a,b){return (cint(a.idx)-cint(b.idx))}); return l; 
}

// Add Doc

LocalDB.add=function(dt, dn) {
	if(!locals[dt]) locals[dt] = {}; if(locals[dt][dn]) delete locals[dt][dn];
	locals[dt][dn] = {'name':dn, 'doctype':dt, 'docstatus':0};
	return locals[dt][dn];
}

// Delete Doc

LocalDB.delete_doc=function(dt, dn) {
	var doc = get_local(dt, dn);

	for(var ndt in locals) { // all doctypes
		if(locals[ndt]) {
			for(var ndn in locals[ndt]) {
				var doc = locals[ndt][ndn];
				if(doc && doc.parenttype==dt && (doc.parent==dn||doc.__oldparent==dn)) {
					locals[ndt][ndn];
				}
			}
		}
	}
	delete locals[dt][dn];
}

function get_local(dt, dn) { return locals[dt] ? locals[dt][dn] : null; }

// Sync Records from Server

LocalDB.sync = function(list) {
	if(list._kl)list = expand_doclist(list);
	for(var i=0;i<list.length;i++) {
		var d = list[i];
		if(!d.name) // get name (local if required)
			d.name = LocalDB.get_localname(d.doctype);

		LocalDB.add(d.doctype, d.name);
		locals[d.doctype][d.name] = d;

		// cleanup for a second-loading
		if(d.doctype=='DocType') {
			fields_list[d.name] = [];
		} else if(d.doctype=='DocField') { // field dictionary / list 
			if(!fields_list[d.parent])fields_list[d.parent] = [];
			fields_list[d.parent][fields_list[d.parent].length] = d;

			if(d.fieldname) {
				if(!fields[d.parent])fields[d.parent] = {};	
				fields[d.parent][d.fieldname] = d;
			} else if(d.label) {
				if(!fields[d.parent])fields[d.parent] = {};	
				fields[d.parent][d.label] = d;
			}
		} else if(d.doctype=='Event') {
			if((!d.localname) && calendar && (!calendar.has_event[d.name]))
				calendar.set_event(d);
		}
		rename_from_local(d);
	}
}

// Get Local Name
local_name_idx = {};
LocalDB.get_localname=function(doctype) {
	if(!local_name_idx[doctype]) local_name_idx[doctype] = 1;
	var n = 'Unsaved '+ doctype + '-' + local_name_idx[doctype];
	local_name_idx[doctype]++;
	return n;
}

// Create Local Doc
LocalDB.create= function(doctype, n) {
	if(!n) n = LocalDB.get_localname(doctype);
	var doc = LocalDB.add(doctype, n)
	doc.__islocal=1; doc.owner = user;	
	set_default_values(doc);
	return n;
}

LocalDB.get_default_value = function(fn, ft, df) {
	if(df=='_Login' || df=='__user')
		return user;
	else if(df=='_Full Name')
		return user_fullname;
	else if(ft=='Date'&& (df=='Today' || df=='__today')) {
		return get_today(); }
	else if(df)
		return df;
	else if(user_defaults[fn])
		return user_defaults[fn][0];
	else if(sys_defaults[fn])
		return sys_defaults[fn];
}

LocalDB.add_child = function(doc, childtype, parentfield) {
	// create row doc
	var n = LocalDB.create(childtype);
	var d = locals[childtype][n];
	d.parent = doc.name;
	d.parentfield = parentfield;
	d.parenttype = doc.doctype;
	return d;
}

LocalDB.no_copy_list = ['amended_from','amendment_date','cancel_reason'];
LocalDB.copy=function(dt, dn, from_amend) {
	var newdoc = LocalDB.create(dt);
	for(var key in locals[dt][dn]) {
		if(key!=='name' && key.substr(0,2)!='__') { // dont copy name and blank fields
			locals[dt][newdoc][key] = locals[dt][dn][key];
		}
		//if(user_defaults[key]) {
		//	locals[dt][newdoc][key] = user_defaults[key][0];
		//}
		var df = get_field(dt, key);
		if(df && ((!from_amend && cint(df.no_copy)==1) || in_list(LocalDB.no_copy_list, df.fieldname))) { // blank out 'No Copy'
			locals[dt][newdoc][key]='';
		}
	}
	return locals[dt][newdoc];
}
// Meta Data
//----------

var Meta={};
var local_dt = {};

// Make Unique Copy of DocType for each record for client scripting
Meta.make_local_dt = function(dt, dn) {
	var dl = make_doclist('DocType', dt);
	if(!local_dt[dt]) 	  local_dt[dt]={};
	if(!local_dt[dt][dn]) local_dt[dt][dn]={};
	for(var i=0;i<dl.length;i++) {
		var d = dl[i];
		if(d.doctype=='DocField') {
			var key = d.fieldname ? d.fieldname : d.label; 
			local_dt[dt][dn][key] = copy_dict(d);
		}
	}
}

Meta.get_field=function(dt, fn, dn) { 
	if(dn && local_dt[dt]&&local_dt[dt][dn]){
		return local_dt[dt][dn][fn];
	} else {
		if(fields[dt]) var d = fields[dt][fn];
		if(d) return d;
	}
	return {};
}
Meta.set_field_property=function(fn, key, val, doc) {
	if(!doc && (cur_frm.doc))doc = cur_frm.doc;
	try{
		local_dt[doc.doctype][doc.name][fn][key] = val;
		refresh_field(fn);
	} catch(e) {
		alert("Client Script Error: Unknown values for " + doc.name + ',' + fn +'.'+ key +'='+ val);
	}
}
// Globals (Backward Compatibility)
//----------

var getchildren = LocalDB.getchildren;
var get_field = Meta.get_field;
var createLocal = LocalDB.create;



// Password Expiry
// --------------------------------

check_pwd_expiry = function(){
	var check_pwd_callback = function(r,rt){
		if(r.message != 'Yes') return;
		var d = show_reset_pwd_dialog();
		d.widgets['Heading'].innerHTML = 'Your password has expired, please set a new password';
		$dh(d.cancel_img);
	}
	$c_obj('Profile Control','has_pwd_expired','',check_pwd_callback)
}

var reset_pwd_dialog;
function show_reset_pwd_dialog(){
	if(!reset_pwd_dialog) {
		var p = new Dialog(300,400,'Reset Password');
  
		p.make_body([
			['HTML','Heading',''],
			['Password','New Password','Enter New Password'],
			['HTML','','<div id="pwd_new" class="comment" style="margin-left:30%; color: RED"></div>'],
			['Password','Retype New Password'],
			['HTML','','<div id="pwd_retype" class="comment" style="margin-left:30%; color: RED"></div>'],
			['Button','Reset']
		]);
  
		//hide Reset button
		p.onshow = function(){
			$y(p.widgets['Retype New Password'],{backgroundColor: '#FFF'});
			p.widgets['Retype New Password'].value = '';
			p.widgets['New Password'].value = '';
			p.widgets['Reset'].disabled=true;
		}
  
		p.widgets['New Password'].onchange = function(){
			validatePassword(p.widgets['New Password'].value, {
				length: [6, Infinity], lower: 1, upper: 1, numeric: 1, badWords: ["password", "admin"], badSequenceLength: 4
			});
		}
    
		p.widgets['Retype New Password'].onchange = function(){
			if(p.widgets['New Password'].value == p.widgets['Retype New Password'].value && p.widgets['New Password'].value != ''){
				p.widgets['Reset'].disabled=false;
				$i('pwd_retype').innerHTML = '';
				$y(p.widgets['Retype New Password'],{backgroundColor: '#DFD'})
			} else{
				p.widgets['Reset'].disabled=true;
				$y(p.widgets['Retype New Password'],{backgroundColor: '#FFF'})
				$i('pwd_retype').innerHTML = 'Passwords do not matching, Try again';
			}
		}
  
		p.widgets['Reset'].onclick = function(){
			if(p.widgets['New Password'].value == p.widgets['Retype New Password'].value && p.widgets['New Password'].value != ''){
				var reset_pwd_callback = function(r,rt){
					if(r.exc) msgprint(r.exc);
					if(r.message=='ok') {
						p.hide();
						msgprint('ok:Your password has been updated. Please login using the new password');
					} else {
						$i('pwd_new').innerHTML = r.message; // Error
					}
				}
				var pwd = p.widgets['New Password'].value;
				$c_obj('Profile Control','reset_password',pwd,reset_pwd_callback)
			}
		}
  
		reset_pwd_dialog = p;
	}
  
	reset_pwd_dialog.show();
	return p;
}


 
// set user image
function set_user_img(img, username) {
	function set_it() {
		if(user_img[username]=='no_img')
			img.src = 'images/ui/no_img/no_img_m.gif'; // no image
		else
			img.src = repl('cgi-bin/getfile.cgi?ac=%(ac)s&name=%(fn)s', {fn:user_img[username],ac:session.account_name});
	}
	if(user_img[username]) 
		set_it();
	else
		$c('get_user_img',{username:username},function(r,rt) { user_img[username] = r.message; set_it(); }, null, 1);
}