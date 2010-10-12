/** Page Body

	+ body
		+ wntoolbar
		+ banner_area
		+ body
			+ left_sidebar
			+ center
			+ right_sidebar
		+ footer


**/

function Body() { 
	this.left_sidebar = null;
	this.right_sidebar = null;
	var me = this;
	page_body = this;

	this.no_of_columns = function() {
		var n = 1;
		if(cint(this.cp.left_sidebar_width)) n++;
		if(cint(this.cp.right_sidebar_width)) n++;
		return n;
	}
	
	this.setup_page_areas = function() {
		var n = this.no_of_columns();
		if(n==1) 
			// no sidebar
			this.center = this.body;
		else {
			// has sidebars, make a table
			this.body_table = make_table(this.body, 1, n, '100%');
			$y(this.body_table, {tableLayout:'fixed'});
			var c = 0;
			if(cint(this.cp.left_sidebar_width)) {
				this.left_sidebar = $td(this.body_table, 0, c);
				$y(this.left_sidebar, {width:cint(this.cp.left_sidebar_width) + 'px'});
				c++;
			}
			this.center = $a($td(this.body_table, 0, c), 'div');
			c++;
			if(cint(this.cp.right_sidebar_width)) {
				this.right_sidebar = $td(this.body_table, 0, c);
				$y(this.right_sidebar, {width:cint(this.cp.right_sidebar_width) + 'px'})
				c++;
			}			
		}
		this.center.header = $a(this.center, 'div');
		this.center.body = $a(this.center, 'div');
		this.center.loading = $a(this.center, 'div', '', {margin:'200px 0px', fontSize:'14px', color:'#999', textAlign:'center'});
		this.center.loading.innerHTML = 'Loading...'
	}

	this.setup_sidebar_menu = function() {
		if(this.left_sidebar && this.cp.show_sidebar_menu){
			new_widget('SidebarMenu', function(m) { sidebar_menu = m; m.make_menu(''); });
		}
	}
	
	this.setup_header_footer = function() {		
		// header
		var hh = this.cp.header_height ? (cint(this.cp.header_height) + 'px') : '40px';
		$y(this.header, {height:hh, borderBottom:'1px solid #CCC'}); 
		if(this.cp.client_name)this.banner_area.innerHTML = this.cp.client_name;

		// footer
		var fh = this.cp.footer_height ? (cint(this.cp.footer_height) + 'px') : '0px';
		$y(this.footer, {height:fh}); 
		if(this.cp.footer_html)this.footer.innerHTML = this.cp.footer_html;

	}
	
	this.run_startup_code = function() {
		// startup style
		if(this.cp.startup_css)
			set_style(this.cp.startup_css);
		
		// startup code
		try{
			if(this.cp.startup_code)
				eval(this.cp.startup_code);
			if(this.cp.custom_startup_code)
				eval(this.cp.custom_startup_code);
		} catch(e) {
			// pass
		}
	}
	
	this.setup = function() {
		this.cp = locals['Control Panel']['Control Panel'];
		
		this.wntoolbar_area = $a(document.getElementsByTagName('body')[0], 'div');
		this.wrapper = $a($i('body_div'),'div');
		this.banner_area = $a(this.wrapper, 'div');;
		
		this.topmenu = $a(this.wrapper, 'div');
		this.breadcrumbs = $a(this.wrapper, 'div');
		this.body = $a(this.wrapper, 'div');
		this.footer = $a(this.wrapper, 'div');
		
		// sidebars
		if(user_defaults.hide_sidebars) {
			this.cp.left_sidebar_width = null;
			this.cp.right_sidebar_width = null;
		}		

		this.setup_page_areas();
	
		// headers & footer
		this.setup_header_footer();

		// core areas;
		if(user=='Guest') user_defaults.hide_webnotes_toolbar = 1;
		if(!user_defaults.hide_webnotes_toolbar || user=='Administrator') {
			this.wntoolbar = new WNToolbar(this.wntoolbar_area);
			if(isIE) {
				$y(this.wrapper, {marginTop:'32px'});
			} else {
				$y(this.wrapper, {marginTop:'48px'});
			}
		}
		
		// page width
		if(this.cp.page_width) $y(this.wrapper,{width:cint(this.cp.page_width) + 'px'});
		
	}
	
	// Standard containers
	// - Forms
	// - Report Builder
	// - Item List
	// - [Pages by their names]

	this.pages = {};
	this.cur_page = null;
	this.add_page = function(label, onshow, onhide) {
		var c = $a(this.center.body, 'div');
		if(onshow)
			c.onshow = onshow;
		if(onhide)
			c.onhide = onhide;
		this.pages[label] = c;
		$dh(c);
		return c;
	}
	
	this.change_to = function(label) {
		// hide existing
		$dh(this.center.loading);
		if(me.cur_page &&  me.pages[label]!=me.cur_page) {
			if(me.cur_page.onhide)
				me.cur_page.onhide();
			$dh(me.cur_page);
		}
		// show
		me.cur_page = me.pages[label];
		$(me.cur_page).fadeIn();
	
		// on show
		if(me.cur_page.onshow)
			me.cur_page.onshow(me.cur_page);
	}
	
	this.setup();
}