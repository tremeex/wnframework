// Tabbed Page

function TabbedPage(parent, only_labels) { 
	this.tabs = {};
	this.cur_tab = null;

	var lw = $a(parent, 'div','box_label_wrapper'); // for border
	var lb = $a(lw, 'div', 'box_label_body'); // for height
	this.label_area = $a(lb, 'ul', 'box_tabs');
	if(!only_labels)this.body_area = $a(parent, 'div');
	else this.body_area = null;
}

TabbedPage.prototype.add_tab = function(n, onshow) { 

	var tab = $a(this.label_area, 'li');
	tab.label = $a(tab,'a');
	tab.label.innerHTML = n;
	
	if(this.body_area){
		tab.tab_body = $a(this.body_area, 'div', 'box_tabs_body');
		$dh(tab.tab_body);
	} else { tab.tab_body = null; }
	tab.onshow = onshow;
	var me = this;

	tab.hide = function() { 
		if(this.tab_body)$dh(this.tab_body); this.className = '';
		hide_autosuggest();
	}
	tab.set_selected = function() { 
		if(me.cur_tab) me.cur_tab.hide();
		this.className = 'box_tab_selected';
		$op(this, 100); 
		me.cur_tab = this;
	}
	tab.show = function(arg) { 
		this.set_selected(); 
		if(this.tab_body) $ds(this.tab_body);
		if(this.onshow)this.onshow(arg); 
	}
	tab.onmouseover = function() { 
		if(me.cur_tab!=this) $op(this, 60);
		//this.className = 'box_tab_mouseover'; 
	}
	tab.onmouseout = function() {
		$op(this, 100); 
		//else this.className = 'box_tab_selected'; 
	}
	tab.onclick = function() { this.show(); }
	this.tabs[n] = tab;
	return tab;
}

TabbedPage.prototype.disable_tab = function(n) {
	if(this.cur_tab==this.tabs[n]) this.tabs[n].hide();
	$dh(this.tabs[n]) // hide label
}
TabbedPage.prototype.enable_tab = function(n) {
	$di(this.tabs[n]) // show label
}
