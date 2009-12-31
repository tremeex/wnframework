function addEvent(ev, fn) {
	if(isIE) {
		document.attachEvent('on'+ev, function() { 
			fn(window.event, window.event.srcElement); 
		});
	} else {
		document.addEventListener(ev, function(e) { fn(e, e.target); }, true);
	}
}

function set_opacity(ele, ieop) {
	var op = ieop / 100;
	if (ele.filters) { // internet explorer
		try { 
			ele.filters.item("DXImageTransform.Microsoft.Alpha").opacity = ieop;
		} catch (e) { 
			ele.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity='+ieop+')';
		}
	} else  { // other browsers 
		ele.style.opacity = op; 
	}
}

function animate(ele, style_key, from, to, callback) {
	steps = 10; intervals = 20; powr = 0.5
    if (ele.animateMemInt) {
    	window.clearInterval(ele.animateMemInt);
    }
    var actStep = 0;
    ele.animateMemInt = window.setInterval(
		function() { 
		  ele.currentAnimateVal = easeInOut(cint(from),cint(to),steps,actStep,powr);
		  if(in_list(['width','height','top','left'],style_key)) 
		  	ele.currentAnimateVal = ele.currentAnimateVal + "px";
		  if(style_key=='opacity')
		  	set_opacity(ele, ele.currentAnimateVal);
		  else
		  	ele.style[style_key] = ele.currentAnimateVal;
		  	
		  actStep++;
		  if (actStep > steps) {
		  	window.clearInterval(ele.animateMemInt);
		  	if(callback)callback(ele);
		  }
		} 
		,intervals
	)
}

function easeInOut(minValue,maxValue,totalSteps,actualStep,powr) { 
	var delta = maxValue - minValue; 
	var stepp = minValue+(Math.pow(((1 / totalSteps) * actualStep), powr) * delta); 
	return Math.ceil(stepp) 
}

// Dom

function empty_select(s) {
	if(s.custom_select) s.empty();
	if(s) { 
		var tmplen = s.length; for(var i=0;i<tmplen; i++) s.options[0] = null; 
	} 
}

function sel_val(sel) { 
	if(sel.custom_select) {
		return sel.inp.value ? sel.inp.value : '';
	}
	try {
		if(sel.selectedIndex<sel.options.length) return sel.options[sel.selectedIndex].value;
		else return '';
	} catch(err) { return ''; /* IE fix */ }
}

function add_sel_options(s, list, sel_val, o_style) {
	if(s.custom_select) {
		s.set_options(list)
		if(sel_val) s.inp.value = sel_val;
		return;
	}
	for(var i in list){
		var o = new Option(list[i], list[i], false, (list[i]==sel_val? true : false));
		if(o_style) $y(o, o_style);
		s.options[s.options.length] = o				
	}
}

function cint(v, def) { v=v+''; v=lstrip(v, ['0',]); v=parseInt(v); if(isNaN(v))v=def?def:0; return v; }
function validate_email(id) { if(strip(id).search("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")==-1) return 0; else return 1; }
	
function d2h(d) {return d.toString(16);}
function h2d(h) {return parseInt(h,16);} 

function get_darker_shade(col, factor) {
	if(!factor) factor = 0.5;
	if(col.length==3) { var r = col[0]; var g=col[1]; var b=col[2] }
	else if(col.length==6) { var r = col.substr(0,2); var g = col.substr(2,2); var b = col.substr(4,2) }
	else return col;
	return "" + d2h(cint(h2d(r)*factor)) + d2h(cint(h2d(g)*factor)) + d2h(cint(h2d(b)*factor));
}

var $n = '\n';
var $f_lab = '<div style="padding: 4px; color: #888;">Fetching...</div>';

var my_title = 'Home'; var title_prefix = '';
function set_title(t) {
	document.title = (title_prefix ? (title_prefix + ' - ') : '') + t;
}

function $a(parent, newtag, className, cs) {
	if(parent && parent.substr)parent = $i(parent);
	var c = document.createElement(newtag);
	if(parent)
		parent.appendChild(c);
	if(className)c.className = className;
	if(cs)$y(c,cs);
	return c;
}
function $a_input(p, in_type, attributes, cs) {
	if(!attributes) attributes = {};
	if(in_type) attributes.type = in_type 
	if(isIE) {
		var s= '<input ';
		for(key in attributes)
			s+= ' ' + key + '="'+ attributes[key] + '"';
		s+= '>'
		p.innerHTML = s
		var o = p.childNodes[0];
	} else {
		var o = $a(p, 'input'); 
		for(key in attributes)
			o.setAttribute(key, attributes[key]);
	}
	if(cs)$y(o,cs);
	return o;
}

function $dh(d) { if(d && d.substr)d=$i(d); if(d && d.style.display.toLowerCase() != 'none') d.style.display = 'none'; }
function $ds(d) { if(d && d.substr)d=$i(d); if(d && d.style.display.toLowerCase() != 'block') d.style.display = 'block'; }
function $di(d) { if(d && d.substr)d=$i(d); if(d)d.style.display = 'inline'; }
function $i(id) { 
	if(!id) return null; 
	if(id && id.appendChild)return id; // already an element
	return document.getElementById(id); 
}
function $t(parent, txt) { 	if(parent.substr)parent = $i(parent); return parent.appendChild(document.createTextNode(txt)); }
function $w(e,w) { if(e && e.style && w)e.style.width = w; }
function $h(e,h) { if(e && e.style && h)e.style.height = h; }
function $bg(e,w) { if(e && e.style && w)e.style.backgroundColor = w; }
function $fg(e,w) { if(e && e.style && w)e.style.color = w; }
function $op(e,w) { if(e && e.style && w) { set_opacity(e,w); } }

function $y(ele, s) { if(ele && s) { for(var i in s) ele.style[i]=s[i]; }}
function $yt(tab, r, c, s) { /// set style on tables with wildcards
	var rmin = r; var rmax = r;
	if(r=='*') { rmin = 0; rmax = tab.rows.length-1; }
	if(r.search && r.search('-')!= -1) {
	  r = r.split('-');
	  rmin = cint(r[0]); rmax = cint(r[1]);
	}

	var cmin = c; var cmax = c;
	if(c=='*') { cmin = 0; cmax = tab.rows[0].cells.length-1; }
	if(c.search && c.search('-')!= -1) {
	  c = c.split('-');
	  rmin = cint(c[0]); rmax = cint(c[1]);
	}
	
	for(var ri = rmin; ri<=rmax; ri++) {
		for(var ci = cmin; ci<=cmax; ci++)
			$y($td(tab,ri,ci),s);
	}
}

// add css classes etc

function set_style(txt) {
	var se = document.createElement('style');
	se.type = "text/css";
	if (se.styleSheet) {
		se.styleSheet.cssText = txt;
	} else {
		se.appendChild(document.createTextNode(txt));
	}
	document.getElementsByTagName('head')[0].appendChild(se);	
}

// Make table

function make_table(parent, nr, nc, table_width, widths, cell_style) {
	var t = $a(parent, 'table');
	t.style.borderCollapse = 'collapse';
	if(table_width) t.style.width = table_width;
	if(cell_style) t.cell_style=cell_style;
	for(var ri=0;ri<nr;ri++) {
		var r = t.insertRow(ri);
		for(var ci=0;ci<nc;ci++) {
			var c = r.insertCell(ci);
			if(ri==0 && widths && widths[ci]) {
				// set widths
				c.style.width = widths[ci];
			}
			if(cell_style) {
			  for(var s in cell_style) c.style[s] = cell_style[s];
			}
		}
	}
	t.append_row = function() { return append_row(this); }
	return t;
}

function append_row(t) {
	var r = t.insertRow(t.rows.length);
	if(t.rows.length>1) {
		for(var i=0;i<t.rows[0].cells.length;i++) {
			var c = r.insertCell(i);
			if(t.cell_style) {
				for(var s in t.cell_style) c.style[s] = t.cell_style[s];
			}
		}
	}
	return r
}

function $td(t,r,c) { 
	if(r<0)r=t.rows.length+r;
	if(c<0)c=t.rows[0].cells.length+c;
	return t.rows[r].cells[c]; 
}
// sum of values in a table column
function $sum(t, cidx) {
	var s = 0;
	if(cidx<1)cidx = t.rows[0].cells.length + cidx;
	for(var ri=0; ri<t.rows.length; ri++) {
		var c = t.rows[ri].cells[cidx];
		if(c.div) s += flt(c.div.innerHTML);
		else if(c.value) s+= flt(c.value);
		else s += flt(c.innerHTML);
	}
	return s;
}

function objpos(obj){
  if(obj.substr)obj = $i(obj);
  var acc_lefts = 0; var acc_tops = 0;
  if(!obj)show_alert("No Object Specified");
  var co={};
  while (obj){ 
  	acc_lefts += obj.offsetLeft; 
  	acc_tops += obj.offsetTop;

	if(isIE) {
	    if (obj!= window.document.body){
    		acc_tops -= obj.scrollTop; 
    		//acc_lefts -= obj.scrollLeft;
    	}
    } else { // only for ff
	    var op = obj.offsetParent
	    var scr_obj = obj;
	    
	    while(scr_obj&&(scr_obj!=op)&&(scr_obj!=window.document.body)) { // scan all elements for scrolls
		    acc_tops -= scr_obj.scrollTop; 
		    //acc_lefts -= scr_obj.scrollLeft;
			scr_obj = scr_obj.parentNode;
		}
	}
	obj = obj.offsetParent;
  }
  co.x=acc_lefts, co.y=acc_tops; return co;
}

function get_screen_dims() {
  var d={};
  d.w = 0; d.h = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    d.w = window.innerWidth;
    d.h = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    d.w = document.documentElement.clientWidth;
    d.h = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    d.w = document.body.clientWidth;
    d.h = document.body.clientHeight;
  }	
  return d

}

// set user image
var user_img = {};
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
		$c('webnotes.profile.get_user_img',{username:username},function(r,rt) { user_img[username] = r.message; set_it(); }, null, 1);
}

function get_url_arg(name) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )
		return "";
	else
		return results[1];
}
