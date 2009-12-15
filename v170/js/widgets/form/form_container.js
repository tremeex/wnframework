function FrmContainer() {  }

FrmContainer.prototype = new Container()
FrmContainer.prototype.oninit = function() {
	this.make_head();
	this.make_toolbar();
	make_text_dialog();
}

FrmContainer.prototype.make_head = function() {
	this.head_div = $a(this.head, 'div', '', {borderBottom:'1px solid #AAA', margin:'0px 4px'});

	// Row 1
	// ------------------

	this.tbartab = make_table($a(this.head_div, 'div'), 1, 2, '100%', ['50%','50%'],{backgroundColor: "#DDD"});

	// left side - headers
	// -------------------
	$y($td(this.tbartab,0,0),{padding:'4px'});
	this.main_title = $a($td(this.tbartab,0,0), 'h2', '',{margin: '0px 8px', display:'inline'});
	this.sub_title = $a($td(this.tbartab,0,0), 'div','',{display:'inline'});
	this.sub_title.is_inline = 1;
	this.status_title = $a($td(this.tbartab,0,0), 'span','',{marginLeft:'8px'});
	this.status_title.is_inline = 1;
	
	// right side - actions, comments & close btn
	// ------------------------------------------
	this.tbar_div = $a($td(this.tbartab,0,1),'div','',{marginRight:'8px', textAlign:'right'})
	var tab2 = make_table(this.tbar_div, 1, 4, '400px', ['60px','120px','160px','60px'], {textAlign: 'center', padding:'3px', verticalAlign:'middle'}); 
	$y(tab2,{cssFloat:'right'});


	// (Tweets) Comments
	// -----------------
	$y($td(tab2,0,0),{textAlign:'right'});
	var comm_img = $a($td(tab2,0,0),'img','',{marginRight:'4px', paddingTop:'2px'});
	comm_img.src = 'images/icons/comments.gif';

	var c = $td(tab2,0,1); 
	this.comments_btn = $a(c,'div','link_type',{padding:'0px 2px',position:'relative',display:'inline'});
	
	$y(c,{textAlign:'left'});
	this.comments_btn.dropdown = new DropdownMenu(c, '240px'); // Tweets Dropdown
	$y(this.comments_btn.dropdown.body, {height:'400px'});

	c.set_unselected = function() { // called by dropdown on hide
		tweet_dialog.hide();
	}
	this.comments_btn.onmouseover = function() { // custom mouseover
		$y(c,{backgroundColor:'#EEE'});
		if(cur_frm.doc.__islocal) {
			return;
		}
		this.dropdown.body.appendChild(tweet_dialog);
		this.dropdown.show();
		tweet_dialog.show(); 
	}
	this.comments_btn.onmouseout = function() {
		$y(c,{backgroundColor:'#DDD'});
		this.dropdown.clear();
	}
		
	this.comments_btn.innerHTML = 'Comments';

	// Actions...
	// -------------
	this.tbarlinks = $a($td(tab2,0,2),'select','',{width:'120px'});
	select_register[select_register.length] = this.tbarlinks; // for IE 6

	// close button
	// ---------------
	$y($td(tab2,0,3),{padding:'6px 0px 2px 0px', textAlign:'right'});
	this.close_btn = $a($td(tab2,0,3), 'img','',{cursor:'pointer'}); this.close_btn.src="images/icons/close.gif";
	this.close_btn.onclick = function() { nav_obj.show_last_open(); }

	// Row 2
	// ------------------

	this.tbartab2 = make_table($a(this.head_div, 'div'), 1, 2, '100%', ['50%','50%']);
	var t = make_table($a($td(this.tbartab2,0,0),'div'),1,2,'100%',['38%','62%'])
	
	// buttons
	this.button_area = $a($td(t,0,1), 'div', '', {margin:'4px'});
	this.last_update_area = $a($td(t,0,1), 'div', '', {margin:'0px 4px 4px 4px',color:"#888"});
	
	// created / modified
	this.owner_img = $a($td(t,0,0), 'img','',{margin:'4px 8px 4px 0px',width:'40px',display:'inline'});
	this.owner_img.is_inline = 1;
	this.mod_img = $a($td(t,0,0), 'img','',{margin:'4px 8px 4px 0px',width:'40px',display:'inline'});
	this.mod_img.is_inline = 1;

	// last comment area
	// -----------------
	this.last_comment = $a($td(this.tbartab2,0,1),'div','',{display:'none', paddingTop:'4px'});
	
	var t = make_table(this.last_comment,1,2,'100%',['40px','']);
	this.last_comment.img = $a($td(t,0,0), 'img','',{width:'40px',marginBottom:'8px'});
	this.last_comment.comment = $a($td(t,0,1),'div','',{backgroundColor:'#FFFAAA', padding:'4px', height:'32px'})


	// header elements
	this.head_elements = [this.button_area, this.tbar_div, this.owner_img, this.mod_img, this.sub_title, this.status_title, this.last_update_area];
	
}

FrmContainer.prototype.show_head = function() { 
	$ds(this.head_div); 
}

FrmContainer.prototype.hide_head = function() { 
	$dh(this.head_div); 
}

FrmContainer.prototype.refresh = function() { }

FrmContainer.prototype.make_toolbar = function() {
	this.btns = {};
	var me = this;
	var makebtn = function(label, fn, bold) {
		var btn = $a(me.button_area,'button');
		btn.l_area = $a(btn,'span');
		btn.l_area.innerHTML = label; btn.onclick = fn;
		if(bold)$y(btn.l_area, {fontWeight: 'bold'});
		btn.show = function() { 
			if(isFF)$y(this,{display:'-moz-inline-box'});
			else $y(this,{display:'inline-block'});
		}
		btn.hide = function() { $dh(this); }
		me.btns[label] = btn;
	}

	makebtn('Edit', edit_doc);
	makebtn('Save', function() { save_doc('Save');}, 1);
	makebtn('Submit', savesubmit);
	makebtn('Cancel', savecancel);
	makebtn('Amend', amend_doc);
	
	me.tbarlinks.onchange= function() {
		var v = sel_val(this);
		if(v=='New') new_doc();
		else if(v=='Refresh') reload_doc();
		else if(v=='Print') print_doc();
		else if(v=='Email') email_doc();
		else if(v=='Copy') copy_doc();
	}
	// make email dialog
	makeemail();
	makeprintdialog();
}

FrmContainer.prototype.refresh_save_btns= function() {
	var frm = cur_frm;
	var p = frm.get_doc_perms();

	if(cur_frm.editable) this.btns['Edit'].hide();
	else this.btns['Edit'].show();
	
	if(cur_frm.editable && cint(frm.doc.docstatus)==0 && p[WRITE]) this.btns['Save'].show();
	else this.btns['Save'].hide();

	if(cur_frm.editable && cint(frm.doc.docstatus)==0 && p[SUBMIT] && (!frm.doc.__islocal)) this.btns['Submit'].show();
	else this.btns['Submit'].hide();

	if(cur_frm.editable && cint(frm.doc.docstatus)==1  && p[CANCEL]) this.btns['Cancel'].show();
	else this.btns['Cancel'].hide();

	if(cint(frm.doc.docstatus)==2  && p[AMEND]) this.btns['Amend'].show();
	else this.btns['Amend'].hide();
}

FrmContainer.prototype.refresh_opt_btns = function() {
	var frm = cur_frm;

	var ol = ['Actions...','New','Refresh'];

	if(!frm.meta.allow_print) ol.push('Print');
	if(!frm.meta.allow_email) ol.push('Email');
	if(!frm.meta.allow_copy) ol.push('Copy');

	empty_select(this.tbarlinks);
	add_sel_options(this.tbarlinks, ol, 'Actions...');
}

FrmContainer.prototype.show_toolbar = function() {
	for(var i=0; i<this.head_elements.length; i++) this.head_elements[i].is_inline ? $di(this.head_elements[i]) : $ds(this.head_elements[i]);

	this.refresh_save_btns();
	this.refresh_opt_btns();
}

FrmContainer.prototype.hide_toolbar = function() {
	for(var i=0; i<this.head_elements.length; i++) $dh(this.head_elements[i]);
}

FrmContainer.prototype.refresh_toolbar = function() {
	var frm = cur_frm;
	if(frm.meta.hide_heading) { this.hide_head(); }
	else {
		this.show_head();
		
		if(frm.meta.hide_toolbar) { 
			this.hide_toolbar();
		} else {
			this.show_toolbar();
		}
	}
}

FrmContainer.prototype.add_frm = function(doctype, onload, opt_name) {
	// dont open doctype and docname from the same session
	if(frms['DocType'] && frms['DocType'].opendocs[doctype]) {
		msgprint("error:Cannot create an instance of \"" + doctype+ "\" when the DocType is open.");
		return;
	}

	if(frms[doctype]) { return frms[doctype]; }

	// Load Doctype from server
	var me = this;
	var fn = function(r,rt) {
		if(!locals['DocType'][doctype]) {
			return;
		}
		new Frm(doctype, me.body);

		if(onload)onload(r,rt);
	}
	if(opt_name && (!is_doc_loaded(doctype, opt_name))) {
		// get both
		$c('getdoc', {'name':opt_name, 'doctype':doctype, 'getdoctype':1, 'user':user}, fn, null, null, 'Loading ' + opt_name);
	} else {
		// get doctype only
		$c('getdoctype', args={'doctype':doctype}, fn, null, null, 'Loading ' + doctype);
	}
}