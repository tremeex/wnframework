// App.js
var ui_effects = 1;

// dialog container
var popup_cont;

function startup() {

	//initialize our DHTML history
	dhtmlHistory.initialize();

	//subscribe to DHTML history change events
	dhtmlHistory.addListener(historyChange);
	
	if($.browser.msie && flt($.browser.version) < 8) ui_effects = 0;
	if($.browser.mozilla && flt($.browser.version) < 1.9) ui_effects = 0;

	popup_cont = $a(document.getElementsByTagName('body')[0], 'div');

	// Globals
	// ---------------------------------
	var setup_globals = function(r) {
		profile = r.profile;
		user = r.profile.name;		
		user_fullname = profile.first_name + (r.profile.last_name ? (' ' + r.profile.last_name) : '');
		user_defaults = profile.defaults;
		user_roles = profile.roles;
		user_email = profile.email;
		profile.start_items = r.start_items;
		account_name = r.account_name;
		home_page = r.home_page;

		sys_defaults = r.sysdefaults;		
	}
	
	var setup_history = function(r) {
		rename_observers.push(nav_obj);
	}
	
	var setup_events = function() {
		addEvent('keypress', function(ev, target) {
			for(var i in keypress_observers) {
				if(keypress_observers[i])
					keypress_observers[i].notify_keypress(ev, (ev.keyCode ? ev.keyCode : ev.charCode));
			}
		});
		addEvent('click', function(ev, target) {
			for(var i=0; i<click_observers.length; i++) {
				if(click_observers[i])
					click_observers[i].notify_click(ev, target);
			}
		});
		
		// Transparent background for IE
		if(isIE) {
			$op($i('dialog_back'), 60);
		}
	}
	
	var callback = function(r,rt) {
		if(r.exc) msgprint(r.ext);
		
		setup_globals(r);
		setup_history(r);
		setup_events();

		page_body = new Body();
		page_body.run_startup_code();		
		page_body.setup_sidebar_menu();
		
		for(var i=0; i<startup_list.length; i++) {
			startup_list[i]();
		}		
		
		$dh('startup_div');
		$ds('body_div');
				
		var t = to_open();
		if(t) {
			historyChange(t);
		} else if(home_page) {
			loadpage(home_page);
		}
	}
	if($i('startup_div'))
		$c('startup',{},callback,null,1);
}

function to_open() {
	if(get_url_arg('page'))
		return get_url_arg('page');
	//if(document.location.href.search('#')!=-1) {
	//	return document.location.href.split('#')[1];
	//}
}

function logout() {
	$c('logout', args = {}, function() { 
		if(login_file) window.location.href = login_file;
		else window.location.reload();
	});
}

// default print style
_p.def_print_style = "html, body{ font-family: Arial, Helvetica; font-size: 12px; }"
	+"\nbody { margin: 12px; }"
	+"\npre { margin:0; padding:0;}"	
	+"\n.simpletable, .noborder { border-collapse: collapse; margin-bottom: 10px;}"
	+"\n.simpletable td {border: 1pt solid #000; vertical-align: top; padding: 2px; }"
	+"\n.noborder td { vertical-align: top; }"

_p.go = function(html) {
	var w = window.open('');
	w.document.write(html);
	w.document.close();
}

// setup calendar
function setup_calendar() {

	var p = new Page('_calendar');
	p.cont.style.height = '100%'; // IE FIX
	p.cont.onshow = function() { 
		if(!_c.calendar) {
			new_widget('Calendar', function(c) { 
				_c.calendar = c;
				_c.calendar.init(p.cont);
				rename_observers.push(_c.calendar);
				
			});
		}
	}
}

startup_list.push(setup_calendar);

 $(document).ready(startup);
