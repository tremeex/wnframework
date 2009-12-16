
var startup_list=[];function fmt_money(v){if(v==null||v=='')return'0.00';v=(v+'').replace(/,/g,'');v=parseFloat(v);if(isNaN(v)){return'';}else{v=v.toFixed(2);var delimiter=",";amount=v+'';var a=amount.split('.',2)
var d=a[1];var i=parseInt(a[0]);if(isNaN(i)){return'';}
var minus='';if(v<0){minus='-';}
i=Math.abs(i);var n=new String(i);var a=[];while(n.length>3)
{var nn=n.substr(n.length-3);a.unshift(nn);n=n.substr(0,n.length-3);}
if(n.length>0){a.unshift(n);}
n=a.join(delimiter);if(d.length<1){amount=n;}
else{amount=n+'.'+d;}
amount=minus+amount;return amount;}}
function $s(ele,v,ftype,fopt){if(v==null)v='';if(ftype=='Text'||ftype=='Small Text'){ele.innerHTML=v?v.replace(/\n/g,'<br>'):'';}else if(ftype=='Date'){v=dateutil.str_to_user(v);if(v==null)v=''
ele.innerHTML=v;}else if(ftype=='Link'&&fopt){ele.innerHTML='';doc_link(ele,fopt,v);}else if(ftype=='Currency'){ele.style.textAlign='right';ele.innerHTML=fmt_money(v);}else if(ftype=='Int'){ele.style.textAlign='right';ele.innerHTML=v;}else if(ftype=='Check'){if(v)ele.innerHTML='<img src="images/ui/tick.gif">';else ele.innerHTML='';}else{ele.innerHTML=v;}}
function clean_smart_quotes(s){if(s){s=s.replace(/\u2018/g,"'");s=s.replace(/\u2019/g,"'");s=s.replace(/\u201c/g,'"');s=s.replace(/\u201d/g,'"');s=s.replace(/\u2013/g,'-');s=s.replace(/\u2014/g,'--');}
return s;}
function copy_dict(d){var n={};for(var k in d)n[k]=d[k];return n;}
function $p(ele,top,left){ele.style.position='absolute';ele.style.top=top+'px';ele.style.left=left+'px';}
function replace_newlines(t){return t?t.replace(/\n/g,'<br>'):'';}
function cstr(s){if(s==null)return'';return s+'';}
function flt(v,decimals){if(v==null||v=='')return 0;v=(v+'').replace(/,/g,'');v=parseFloat(v);if(isNaN(v))
v=0;if(decimals!=null)
return v.toFixed(decimals);return v;}
function esc_quotes(s){if(s==null)s='';return s.replace(/'/,"\'");}
function strip(s,chars){s=lstrip(s,chars);s=rstrip(s,chars);return s;}
function lstrip(s,chars){if(!chars)chars=['\n','\t',' '];var first_char=s.substr(0,1);while(in_list(chars,first_char)){s=s.substr(1);first_char=s.substr(0,1);}
return s;}
function rstrip(s,chars){if(!chars)chars=['\n','\t',' '];var last_char=s.substr(s.length-1);while(in_list(chars,last_char)){s=s.substr(0,s.length-1);last_char=s.substr(s.length-1);}
return s;}
function repl_all(s,s1,s2){var idx=s.indexOf(s1);while(idx!=-1){s=s.replace(s1,s2);idx=s.indexOf(s1);}
return s;}
function repl(s,dict){if(s==null)return'';for(key in dict)s=repl_all(s,'%('+key+')s',dict[key]);return s;}
function validatePassword(pw,options){var o={lower:0,upper:0,alpha:0,numeric:0,special:0,length:[0,Infinity],custom:[],badWords:[],badSequenceLength:0,noQwertySequences:false,noSequential:false};for(var property in options)
o[property]=options[property];var re={lower:/[a-z]/g,upper:/[A-Z]/g,alpha:/[A-Z]/gi,numeric:/[0-9]/g,special:/[\W_]/g},rule,i;if(pw.length<o.length[0]||pw.length>o.length[1]){$i('pwd_new').innerHTML='Password must be atleast 6 characters long.';}else if(!/[A-Z]/.test(pw)||!/[0-9]/.test(pw)||!/[a-z]/.test(pw)){$i('pwd_new').innerHTML='Password must contain atleast one capital letter, one small letter and one number.';}else{$i('pwd_new').innerHTML='';}}
function keys(obj){var mykeys=[];for(key in obj)mykeys[mykeys.length]=key;return mykeys;}
function values(obj){var myvalues=[];for(key in obj)myvalues[myvalues.length]=obj[key];return myvalues;}
function seval(s){return eval('var a='+s+';a');}
function in_list(list,item){for(var i=0;i<list.length;i++){if(list[i]==item)return true;}
return false;}
function has_common(list1,list2){if(!list1||!list2)return false;for(var i=0;i<list1.length;i++){if(in_list(list2,list1[i]))return true;}
return false;}
var inList=in_list;function add_lists(l1,l2){var l=[];for(var k in l1)l[l.length]=l1[k];for(var k in l2)l[l.length]=l2[k];return l;}
function docstring(obj){var l=[];for(key in obj){var v=obj[key];if(v!=null){if(typeof(v)==typeof(1)){l[l.length]="'"+key+"':"+(v+'');}else{v=v+'';l[l.length]="'"+key+"':'"+v.replace(/'/g,"\\'").replace(/\n/g,"\\n")+"'";}}}
return"{"+l.join(',')+'}';}
function ie_refresh(e){$dh(e);$ds(e);}
var agt=navigator.userAgent.toLowerCase();var appVer=navigator.appVersion.toLowerCase();var is_minor=parseFloat(appVer);var is_major=parseInt(is_minor);var iePos=appVer.indexOf('msie');if(iePos!=-1){is_minor=parseFloat(appVer.substring(iePos+5,appVer.indexOf(';',iePos)))
is_major=parseInt(is_minor);}
var isIE=(iePos!=-1);var isIE6=(isIE&&is_major<=6);var isIE7=(isIE&&is_minor>=7);if(/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){var isFF=1;var ffversion=new Number(RegExp.$1)
if(ffversion>=3)var isFF3=1;else if(ffversion>=2)var isFF2=1;else if(ffversion>=1)var isFF1=1;}
function same_day(d1,d2){if(d1.getFullYear()==d2.getFullYear()&&d1.getMonth()==d2.getMonth()&&d1.getDate()==d2.getDate())return true;else return false;}
var month_list=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];var month_last={1:31,2:28,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31}
var month_list_full=['January','February','March','April','May','June','July','August','September','October','November','December'];function int_to_str(i,len){i=''+i;if(i.length<len)for(c=0;c<(len-i.length);c++)i='0'+i;return i}
function DateFn(){this.str_to_obj=function(d){if(!d)return new Date();if(d.search('-')!=-1){var t=d.split('-');return new Date(t[0],t[1]-1,t[2]);}else if(d.search('/')!=-1){var t=d.split('/');return new Date(t[0],t[1]-1,t[2]);}else{return new Date();}}
this.obj_to_str=function(d){return d.getFullYear()+'-'+int_to_str(d.getMonth()+1,2)+'-'+int_to_str(d.getDate(),2);}
this.obj_to_user=function(d){return dateutil.str_to_user(dateutil.obj_to_str(d));}
this.get_diff=function(d1,d2){return((d1-d2)/86400000);}
this.add_days=function(d,days){d.setTime(d.getTime()+(days*24*60*60*1000));return d}
this.month_start=function(){var d=new Date();return d.getFullYear()+'-'+int_to_str(d.getMonth()+1,2)+'-01';}
this.month_end=function(){var d=new Date();var m=d.getMonth()+1;var y=d.getFullYear();last_date=month_last[m];if(m==2&&(y%4)==0&&((y%100)!=0||(y%400)==0))
last_date=29;return y+'-'+int_to_str(m,2)+'-'+last_date;}
this.str_to_user=function(val,no_time_str){var user_fmt=locals['Control Panel']['Control Panel'].date_format;var time_str='';if(!user_fmt)user_fmt='dd-mm-yyyy';if(val==null||val=='')return null;if(val.search(':')!=-1){var tmp=val.split(' ');if(tmp[1])
time_str=' '+tmp[1];var d=tmp[0];}else{var d=val;}
if(no_time_str)time_str='';d=d.split('-');if(d.length==3){if(user_fmt=='dd-mm-yyyy')
val=d[2]+'-'+d[1]+'-'+d[0]+time_str;else if(user_fmt=='dd/mm/yyyy')
val=d[2]+'/'+d[1]+'/'+d[0]+time_str;else if(user_fmt=='yyyy-mm-dd')
val=d[0]+'-'+d[1]+'-'+d[2]+time_str;else if(user_fmt=='mm/dd/yyyy')
val=d[1]+'/'+d[2]+'/'+d[0]+time_str;else if(user_fmt=='mm-dd-yyyy')
val=d[1]+'-'+d[2]+'-'+d[0]+time_str;}
return val;}
this.full_str=function(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '
+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();}}
var dateutil=new DateFn();var date=dateutil;var reversedate=dateutil.str_to_user;function only_date(val){if(val==null||val=='')return null;if(val.search(':')!=-1){var tmp=val.split(' ');var d=tmp[0].split('-');}else{var d=val.split('-');}
if(d.length==3)
val=d[2]+'-'+d[1]+'-'+d[0];return val;}
function time_to_ampm(v){if(!v){var d=new Date();var t=[d.getHours(),cint(d.getMinutes()/5)*5]}else{var t=v.split(':');}
if(t.length!=2){show_alert('[set_time] Incorect time format');return;}
if(cint(t[0])==0)var ret=['12',t[1],'AM'];else if(cint(t[0])<12)var ret=[cint(t[0])+'',t[1],'AM'];else if(cint(t[0])==12)var ret=['12',t[1],'PM'];else var ret=[(cint(t[0])-12)+'',t[1],'PM'];return ret;}
function time_to_hhmm(hh,mm,am){if(am=='AM'&&hh=='12'){hh='00';}else if(am=='PM'&&hh!='12'){hh=cint(hh)+12;}
return hh+':'+mm;}
function set_opacity(ele,ieop){var op=ieop/100;if(ele.filters){try{ele.filters.item("DXImageTransform.Microsoft.Alpha").opacity=ieop;}catch(e){ele.style.filter='progid:DXImageTransform.Microsoft.Alpha(opacity='+ieop+')';}}else{ele.style.opacity=op;}}
function animate(ele,style_key,from,to,callback){steps=10;intervals=20;powr=0.5
if(ele.animateMemInt){window.clearInterval(ele.animateMemInt);}
var actStep=0;ele.animateMemInt=window.setInterval(function(){ele.currentAnimateVal=easeInOut(cint(from),cint(to),steps,actStep,powr);if(in_list(['width','height','top','left'],style_key))
ele.currentAnimateVal=ele.currentAnimateVal+"px";if(style_key=='opacity')
set_opacity(ele,ele.currentAnimateVal);else
ele.style[style_key]=ele.currentAnimateVal;actStep++;if(actStep>steps){window.clearInterval(ele.animateMemInt);if(callback)callback(ele);}},intervals)}
function easeInOut(minValue,maxValue,totalSteps,actualStep,powr){var delta=maxValue-minValue;var stepp=minValue+(Math.pow(((1/totalSteps)*actualStep),powr)*delta);return Math.ceil(stepp)}
function empty_select(s){if(s){var tmplen=s.length;for(var i=0;i<tmplen;i++)s.options[0]=null;}}
function sel_val(sel){try{if(sel.selectedIndex<sel.options.length)return sel.options[sel.selectedIndex].value;else return'';}catch(err){return'';}}
function add_sel_options(s,list,sel_val,o_style){for(var i in list){var o=new Option(list[i],list[i],false,(list[i]==sel_val?true:false));if(o_style)$y(o,o_style);s.options[s.options.length]=o}}
function cint(v,def){v=v+'';v=lstrip(v,['0',]);v=parseInt(v);if(isNaN(v))v=def?def:0;return v;}
function validate_email(id){if(strip(id).search("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")==-1)return 0;else return 1;}
function d2h(d){return d.toString(16);}
function h2d(h){return parseInt(h,16);}
function get_darker_shade(col,factor){if(!factor)factor=0.5;if(col.length==3){var r=col[0];var g=col[1];var b=col[2]}
else if(col.length==6){var r=col.substr(0,2);var g=col.substr(2,2);var b=col.substr(4,2)}
else return col;return""+d2h(cint(h2d(r)*factor))+d2h(cint(h2d(g)*factor))+d2h(cint(h2d(b)*factor));}
var $n='\n';var $f_lab='<div style="padding: 4px; color: #888;">Fetching...</div>';var my_title='Home';var title_prefix='';function set_title(t){document.title=(title_prefix?(title_prefix+' - '):'')+t;}
function $a(parent,newtag,className,cs){if(!parent)alert("Error in adding to DOM element:"+newtag+','+className);if(parent.substr)parent=$i(parent);var c=document.createElement(newtag);parent.appendChild(c);if(className)c.className=className;if(cs)$y(c,cs);return c;}
function $a_input(p,in_type,in_name,cs){if(isIE){p.innerHTML=repl('<input type="%(in_type)s" %(in_name)s>',{in_type:in_type,in_name:(in_name?('name="'+in_name+'"'):'')});var o=p.childNodes[0];}else{var o=$a(p,'input');o.setAttribute('type',in_type);if(in_name)o.setAttribute('name',in_name);}
if(cs)$y(o,cs);return o;}
function $dh(d){if(d&&d.substr)d=$i(d);if(d&&d.style.display.toLowerCase()!='none')d.style.display='none';}
function $ds(d){if(d&&d.substr)d=$i(d);if(d&&d.style.display.toLowerCase()!='block')d.style.display='block';}
function $di(d){if(d&&d.substr)d=$i(d);if(d)d.style.display='inline';}
function $i(id){if(!id)return null;if(id&&id.appendChild)return id;return document.getElementById(id);}
function $t(parent,txt){if(parent.substr)parent=$i(parent);return parent.appendChild(document.createTextNode(txt));}
function $w(e,w){if(e&&e.style&&w)e.style.width=w;}
function $h(e,h){if(e&&e.style&&h)e.style.height=h;}
function $bg(e,w){if(e&&e.style&&w)e.style.backgroundColor=w;}
function $fg(e,w){if(e&&e.style&&w)e.style.color=w;}
function $op(e,w){if(e&&e.style&&w){set_opacity(e,w);}}
function $y(ele,s){if(ele&&s){for(var i in s)ele.style[i]=s[i];}}
function $yt(tab,r,c,s){var rmin=r;var rmax=r;if(r=='*'){rmin=0;rmax=tab.rows.length-1;}
if(r.search&&r.search('-')!=-1){r=r.split('-');rmin=cint(r[0]);rmax=cint(r[1]);}
var cmin=c;var cmax=c;if(c=='*'){cmin=0;cmax=tab.rows[0].cells.length-1;}
if(c.search&&c.search('-')!=-1){c=c.split('-');rmin=cint(c[0]);rmax=cint(c[1]);}
for(var ri=rmin;ri<=rmax;ri++){for(var ci=cmin;ci<=cmax;ci++)
$y($td(tab,ri,ci),s);}}
function set_style(txt){var se=document.createElement('style');se.type="text/css";if(se.styleSheet){se.styleSheet.cssText=txt;}else{se.appendChild(document.createTextNode(txt));}
document.getElementsByTagName('head')[0].appendChild(se);}
function make_table(parent,nr,nc,table_width,widths,cell_style){var t=$a(parent,'table');t.style.borderCollapse='collapse';if(table_width)t.style.width=table_width;if(cell_style)t.cell_style=cell_style;for(var ri=0;ri<nr;ri++){var r=t.insertRow(ri);for(var ci=0;ci<nc;ci++){var c=r.insertCell(ci);if(ri==0&&widths&&widths[ci]){c.style.width=widths[ci];}
if(cell_style){for(var s in cell_style)c.style[s]=cell_style[s];}}}
t.append_row=function(){return append_row(this);}
return t;}
function append_row(t){var r=t.insertRow(t.rows.length);if(t.rows.length>1){for(var i=0;i<t.rows[0].cells.length;i++){var c=r.insertCell(i);if(t.cell_style){for(var s in t.cell_style)c.style[s]=t.cell_style[s];}}}
return r}
function $td(t,r,c){if(r<0)r=t.rows.length+r;if(c<0)c=t.rows[0].cells.length+c;return t.rows[r].cells[c];}
function $sum(t,cidx){var s=0;if(cidx<1)cidx=t.rows[0].cells.length+cidx;for(var ri=0;ri<t.rows.length;ri++){var c=t.rows[ri].cells[cidx];if(c.div)s+=flt(c.div.innerHTML);else if(c.value)s+=flt(c.value);else s+=flt(c.innerHTML);}
return s;}
function objpos(obj){if(obj.substr)obj=$i(obj);var acc_lefts=0;var acc_tops=0;if(!obj)show_alert("No Object Specified");var co={};while(obj){acc_lefts+=obj.offsetLeft;acc_tops+=obj.offsetTop;if(isIE){if(obj!=window.document.body){acc_tops-=obj.scrollTop;acc_lefts-=obj.scrollLeft;}}else{var op=obj.offsetParent
var scr_obj=obj;while(scr_obj&&(scr_obj!=op)&&(scr_obj!=window.document.body)){acc_tops-=scr_obj.scrollTop;acc_lefts-=scr_obj.scrollLeft;scr_obj=scr_obj.parentNode;}}
obj=obj.offsetParent;}
co.x=acc_lefts,co.y=acc_tops;return co;}
function get_screen_dims(){var d={};d.w=0;d.h=0;if(typeof(window.innerWidth)=='number'){d.w=window.innerWidth;d.h=window.innerHeight;}else if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){d.w=document.documentElement.clientWidth;d.h=document.documentElement.clientHeight;}else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){d.w=document.body.clientWidth;d.h=document.body.clientHeight;}
return d}
var outUrl="cgi-bin/run.cgi";function checkResponse(r,on_timeout,no_spinner,freeze_msg){try{if(r.readyState==4&&r.status==200)return true;else return false;}catch(e){msgprint("error:Request timed out, try again");if(on_timeout)
on_timeout();hide_loading();if(freeze_msg)
unfreeze();return false;}}
var pending_req=0;function newHttpReq(){if(!isIE)
var r=new XMLHttpRequest();else if(window.ActiveXObject)
var r=new ActiveXObject("Microsoft.XMLHTTP");return r;}
function $c(command,args,fn,on_timeout,no_spinner,freeze_msg){var req=newHttpReq();ret_fn=function(){if(checkResponse(req,on_timeout,no_spinner,freeze_msg)){var rtxt=req.responseText;if(!no_spinner)hide_loading();rtxt=rtxt.replace(/'\^\\x05\*'/g,'null');r=eval("var a="+rtxt+";a")
if(r.exc&&r.__redirect_login){msgprint(r.exc,0,function(){document.location=login_file});return;}
if(freeze_msg)unfreeze();if(r.exc){errprint(r.exc);};if(r.server_messages){msgprint(r.server_messages);};if(r.docs){LocalDB.sync(r.docs);}
saveAllowed=true;if(fn)fn(r,rtxt);}}
req.onreadystatechange=ret_fn;req.open("POST",outUrl,true);req.setRequestHeader("ENCTYPE","multipart/form-data");req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");args['cmd']=command;req.send(makeArgString(args));if(!no_spinner)set_loading();if(freeze_msg)freeze(freeze_msg,1);}
function $c_obj(doclist,method,arg,call_back,no_spinner,freeze_msg){if(doclist.substr){$c('runserverobj',{'doctype':doclist,'method':method,'arg':arg},call_back);}else{$c('runserverobj',{'docs':compress_doclist(doclist),'method':method,'arg':arg},call_back,no_spinner,freeze_msg);}}
function $c_graph(img,control_dt,method,arg){img.src=outUrl+'?'+makeArgString({cmd:'get_graph',dt:control_dt,method:method,arg:arg});}
function makeArgString(dict){var varList=[];for(key in dict){varList[varList.length]=key+'='+encodeURIComponent(dict[key]);}
return varList.join('&');}
var msg_dialog;function msgprint(msg,static,callback){if(!msg_dialog){msg_dialog=new Dialog(300,200,"Message");msg_dialog.make_body([['HTML','Msg'],])
msg_dialog.onhide=function(){msg_dialog.msg_area.innerHTML='';$dh(msg_dialog.msg_icon);if(msg_dialog.custom_onhide)msg_dialog.custom_onhide();}
var t=make_table(msg_dialog.rows['Msg'],1,2,'100%',['20px','250px'],{padding:'2px',verticalAlign:'Top'});msg_dialog.msg_area=$td(t,0,1);msg_dialog.msg_icon=$a($td(t,0,0),'img');}
if(!msg_dialog.display)msg_dialog.show();var has_msg=msg_dialog.msg_area.innerHTML?1:0;var m=$a(msg_dialog.msg_area,'div','');if(has_msg)$y(m,{marginTop:'4px'});$dh(msg_dialog.msg_icon);if(msg.substr(0,6).toLowerCase()=='error:'){msg_dialog.msg_icon.src='images/icons/error.gif';$di(msg_dialog.msg_icon);msg=msg.substr(6);}else if(msg.substr(0,8).toLowerCase()=='message:'){msg_dialog.msg_icon.src='images/icons/application.gif';$di(msg_dialog.msg_icon);msg=msg.substr(8);}else if(msg.substr(0,3).toLowerCase()=='ok:'){msg_dialog.msg_icon.src='images/icons/accept.gif';$di(msg_dialog.msg_icon);msg=msg.substr(3);}
m.innerHTML=replace_newlines(msg);msg_dialog.custom_onhide=callback;}
function FloatingMessage(){if($i('fm_cancel')){$i('fm_cancel').onclick=function(){$dh($i('floating_message'));}
this.show=function(content){$i('fm_content').innerHTML=content;$ds($i('floating_message'));}}}
window.dhtmlHistory={isIE:false,isOpera:false,isSafari:false,isKonquerer:false,isGecko:false,isSupported:false,create:function(_1){var _2=this;var UA=navigator.userAgent.toLowerCase();var _4=navigator.platform.toLowerCase();var _5=navigator.vendor||"";if(_5==="KDE"){this.isKonqueror=true;this.isSupported=false;}else{if(typeof window.opera!=="undefined"){this.isOpera=true;this.isSupported=true;}else{if(typeof document.all!=="undefined"){this.isIE=true;this.isSupported=true;}else{if(_5.indexOf("Apple Computer, Inc.")>-1){this.isSafari=true;this.isSupported=(_4.indexOf("mac")>-1);}else{if(UA.indexOf("gecko")!=-1){this.isGecko=true;this.isSupported=true;}}}}}window.historyStorage.setup(_1);if(this.isSafari){this.createSafari();}else{if(this.isOpera){this.createOpera();}}var _6=this.getCurrentLocation();this.currentLocation=_6;if(this.isIE){this.createIE(_6);}var _7=function(){_2.firstLoad=null;};this.addEventListener(window,"unload",_7);if(this.isIE){this.ignoreLocationChange=true;}else{if(!historyStorage.hasKey(this.PAGELOADEDSTRING)){this.ignoreLocationChange=true;this.firstLoad=true;historyStorage.put(this.PAGELOADEDSTRING,true);}else{this.ignoreLocationChange=false;this.fireOnNewListener=true;}}var _8=function(){_2.checkLocation();};setInterval(_8,100);},initialize:function(){if(this.isIE){if(!historyStorage.hasKey(this.PAGELOADEDSTRING)){this.fireOnNewListener=false;this.firstLoad=true;historyStorage.put(this.PAGELOADEDSTRING,true);}else{this.fireOnNewListener=true;this.firstLoad=false;}}},addListener:function(_9){this.listener=_9;if(this.fireOnNewListener){this.fireHistoryEvent(this.currentLocation);this.fireOnNewListener=false;}},addEventListener:function(o,e,l){if(o.addEventListener){o.addEventListener(e,l,false);}else{if(o.attachEvent){o.attachEvent("on"+e,function(){l(window.event);});}}},add:function(_d,_e){if(this.isSafari){_d=this.removeHash(_d);historyStorage.put(_d,_e);this.currentLocation=_d;window.location.hash=_d;this.putSafariState(_d);}else{var _f=this;var _10=function(){if(_f.currentWaitTime>0){_f.currentWaitTime=_f.currentWaitTime-_f.waitTime;}_d=_f.removeHash(_d);if(document.getElementById(_d)&&_f.debugMode){var e="Exception: History locations can not have the same value as _any_ IDs that might be in the document,"+" due to a bug in IE; please ask the developer to choose a history location that does not match any HTML"+" IDs in this document. The following ID is already taken and cannot be a location: "+_d;throw new Error(e);}historyStorage.put(_d,_e);_f.ignoreLocationChange=true;_f.ieAtomicLocationChange=true;_f.currentLocation=_d;window.location.hash=_d;if(_f.isIE){_f.iframe.src="blank.html?"+_d;}_f.ieAtomicLocationChange=false;};window.setTimeout(_10,this.currentWaitTime);this.currentWaitTime=this.currentWaitTime+this.waitTime;}},isFirstLoad:function(){return this.firstLoad;},getVersion:function(){return"0.6";},getCurrentLocation:function(){var r=(this.isSafari?this.getSafariState():this.getCurrentHash());return r;},getCurrentHash:function(){var r=window.location.href;var i=r.indexOf("#");return(i>=0?r.substr(i+1):"");},PAGELOADEDSTRING:"DhtmlHistory_pageLoaded",listener:null,waitTime:200,currentWaitTime:0,currentLocation:null,iframe:null,safariHistoryStartPoint:null,safariStack:null,safariLength:null,ignoreLocationChange:null,fireOnNewListener:null,firstLoad:null,ieAtomicLocationChange:null,createIE:function(_15){this.waitTime=400;var _16=(historyStorage.debugMode?"width: 800px;height:80px;border:1px solid black;":historyStorage.hideStyles);var _17="rshHistoryFrame";var _18="<iframe frameborder=\"0\" id=\""+_17+"\" style=\""+_16+"\" src=\"blank.html?"+_15+"\"></iframe>";document.write(_18);this.iframe=document.getElementById(_17);},createOpera:function(){this.waitTime=400;var _19="<img src=\"javascript:location.href='javascript:dhtmlHistory.checkLocation();';\" style=\""+historyStorage.hideStyles+"\" />";document.write(_19);},createSafari:function(){var _1a="rshSafariForm";var _1b="rshSafariStack";var _1c="rshSafariLength";var _1d=historyStorage.debugMode?historyStorage.showStyles:historyStorage.hideStyles;var _1e=(historyStorage.debugMode?"width:800px;height:20px;border:1px solid black;margin:0;padding:0;":historyStorage.hideStyles);var _1f="<form id=\""+_1a+"\" style=\""+_1d+"\">"+"<input type=\"text\" style=\""+_1e+"\" id=\""+_1b+"\" value=\"[]\"/>"+"<input type=\"text\" style=\""+_1e+"\" id=\""+_1c+"\" value=\"\"/>"+"</form>";document.write(_1f);this.safariStack=document.getElementById(_1b);this.safariLength=document.getElementById(_1c);if(!historyStorage.hasKey(this.PAGELOADEDSTRING)){this.safariHistoryStartPoint=history.length;this.safariLength.value=this.safariHistoryStartPoint;}else{this.safariHistoryStartPoint=this.safariLength.value;}},getSafariStack:function(){var r=this.safariStack.value;return historyStorage.fromJSON(r);},getSafariState:function(){var _21=this.getSafariStack();var _22=_21[history.length-this.safariHistoryStartPoint-1];return _22;},putSafariState:function(_23){var _24=this.getSafariStack();_24[history.length-this.safariHistoryStartPoint]=_23;this.safariStack.value=historyStorage.toJSON(_24);},fireHistoryEvent:function(_25){var _26=historyStorage.get(_25);this.listener.call(null,_25,_26);},checkLocation:function(){if(!this.isIE&&this.ignoreLocationChange){this.ignoreLocationChange=false;return;}if(!this.isIE&&this.ieAtomicLocationChange){return;}var _27=this.getCurrentLocation();if(_27==this.currentLocation){return;}this.ieAtomicLocationChange=true;if(this.isIE&&this.getIframeHash()!=_27){this.iframe.src="blank.html?"+_27;}else{if(this.isIE){return;}}this.currentLocation=_27;this.ieAtomicLocationChange=false;this.fireHistoryEvent(_27);},getIframeHash:function(){var doc=this.iframe.contentWindow.document;var _29=String(doc.location.search);if(_29.length==1&&_29.charAt(0)=="?"){_29="";}else{if(_29.length>=2&&_29.charAt(0)=="?"){_29=_29.substring(1);}}return _29;},removeHash:function(_2a){var r;if(_2a===null||_2a===undefined){r=null;}else{if(_2a===""){r="";}else{if(_2a.length==1&&_2a.charAt(0)=="#"){r="";}else{if(_2a.length>1&&_2a.charAt(0)=="#"){r=_2a.substring(1);}else{r=_2a;}}}}return r;},iframeLoaded:function(_2c){if(this.ignoreLocationChange){this.ignoreLocationChange=false;return;}var _2d=String(_2c.search);if(_2d.length==1&&_2d.charAt(0)=="?"){_2d="";}else{if(_2d.length>=2&&_2d.charAt(0)=="?"){_2d=_2d.substring(1);}}window.location.hash=_2d;this.fireHistoryEvent(_2d);}};window.historyStorage={setup:function(_2e){if(typeof _2e!=="undefined"){if(_2e.debugMode){this.debugMode=_2e.debugMode;}if(_2e.toJSON){this.toJSON=_2e.toJSON;}if(_2e.fromJSON){this.fromJSON=_2e.fromJSON;}}var _2f="rshStorageForm";var _30="rshStorageField";var _31=this.debugMode?historyStorage.showStyles:historyStorage.hideStyles;var _32=(historyStorage.debugMode?"width: 800px;height:80px;border:1px solid black;":historyStorage.hideStyles);var _33="<form id=\""+_2f+"\" style=\""+_31+"\">"+"<textarea id=\""+_30+"\" style=\""+_32+"\"></textarea>"+"</form>";document.write(_33);this.storageField=document.getElementById(_30);if(typeof window.opera!=="undefined"){this.storageField.focus();}},put:function(key,_35){this.assertValidKey(key);if(this.hasKey(key)){this.remove(key);}this.storageHash[key]=_35;this.saveHashTable();},get:function(key){this.assertValidKey(key);this.loadHashTable();var _37=this.storageHash[key];if(_37===undefined){_37=null;}return _37;},remove:function(key){this.assertValidKey(key);this.loadHashTable();delete this.storageHash[key];this.saveHashTable();},reset:function(){this.storageField.value="";this.storageHash={};},hasKey:function(key){this.assertValidKey(key);this.loadHashTable();return(typeof this.storageHash[key]!=="undefined");},isValidKey:function(key){return(typeof key==="string");},showStyles:"border:0;margin:0;padding:0;",hideStyles:"left:-1000px;top:-1000px;width:1px;height:1px;border:0;position:absolute;",debugMode:false,storageHash:{},hashLoaded:false,storageField:null,assertValidKey:function(key){var _3c=this.isValidKey(key);if(!_3c&&this.debugMode){throw new Error("Please provide a valid key for window.historyStorage. Invalid key = "+key+".");}},loadHashTable:function(){if(!this.hashLoaded){var _3d=this.storageField.value;if(_3d!==""&&_3d!==null){this.storageHash=this.fromJSON(_3d);this.hashLoaded=true;}}},saveHashTable:function(){this.loadHashTable();var _3e=this.toJSON(this.storageHash);this.storageField.value=_3e;},toJSON:function(o){return o;},fromJSON:function(s){return s;}};var cur_dialog;var top_index=91;function Dialog(w,h,title,content){this.wrapper=$a('dialogs','div','dialog_wrapper');this.w=w;this.h=h;$w(this.wrapper,w+'px');this.head=$a(this.wrapper,'div','dialog_head');this.body=$a(this.wrapper,'div','dialog_body');this.make_head(title);if(content)this.make_body(content);this.onshow='';this.oncancel='';this.display=false;var me=this;}
Dialog.prototype.make_head=function(title){var t=make_table(this.head,1,2,'100%',['100%','16px'],{padding:'2px'});$y($td(t,0,0),{paddingLeft:'16px',fontWeight:'bold',fontSize:'14px',textAlign:'center'});$y($td(t,0,1),{textAlign:'right'});var img=$a($td(t,0,01),'img','',{cursor:'pointer'});img.src='images/icons/close.gif';this.title_text=$td(t,0,0);if(!title)title='';this.title_text.innerHTML=title;var me=this;img.onclick=function(){if(me.oncancel)me.oncancel();me.hide();}
this.cancel_img=img;}
Dialog.prototype.show=function(){freeze();var d=get_screen_dims();this.wrapper.style.left=((d.w-this.w)/2)+'px';this.wrapper.style.top=(get_scroll_top()+((d.h-this.h)/2))+'px';top_index++;$y(this.wrapper,{zIndex:top_index});$ds(this.wrapper);this.display=true;cur_dialog=this;if(this.onshow)this.onshow();}
Dialog.prototype.hide=function(){var me=this;unfreeze();if(this.onhide)this.onhide();$dh(this.wrapper);this.display=false;cur_dialog=null;}
Dialog.prototype.set_title=function(title){if(!title)title='';this.title_text.innerHTML=title.bold();}
Dialog.prototype.make_body=function(content){this.rows={};this.widgets={};for(var i in content)this.make_row(content[i]);}
Dialog.prototype.make_row=function(d){var me=this;this.rows[d[1]]=$a(this.body,'div','dialog_row');var row=this.rows[d[1]];if(d[0]!='HTML'){var t=make_table(row,1,2,'100%',['30%','70%']);row.tab=t;var c1=$td(t,0,0);var c2=$td(t,0,1);if(d[0]!='Check'&&d[0]!='Button')
$t(c1,d[1]);}
if(d[0]=='HTML'){if(d[2])row.innerHTML=d[2];this.widgets[d[1]]=row;}else if(d[0]=='Check'){var i=$a_input(c2,'checkbox','',{width:'20px'});c1.innerHTML=d[1];this.widgets[d[1]]=i;}else if(d[0]=='Data'){c1.innerHTML=d[1];c2.style.overflow='auto';this.widgets[d[1]]=$a(c2,'input');if(d[2])$a(c2,'div','comment').innerHTML=d[2];}else if(d[0]=='Password'){c1.innerHTML=d[1];c2.style.overflow='auto';this.widgets[d[1]]=$a_input(c2,'password');if(d[3])$a(c2,'div','comment').innerHTML=d[3];}else if(d[0]=='Select'){c1.innerHTML=d[1];this.widgets[d[1]]=$a(c2,'select');if(d[2])$a(c2,'div','comment').innerHTML=d[2];}else if(d[0]=='Text'){c1.innerHTML=d[1];c2.style.overflow='auto';this.widgets[d[1]]=$a(c2,'textarea');if(d[2])$a(c2,'div','comment').innerHTML=d[2];}else if(d[0]=='Button'){c2.style.height='32px';c2.style.textAlign='right';var b=$a(c2,'button');b.innerHTML=d[1];b.dialog=me;if(d[2]){b._onclick=d[2];b.onclick=function(){this._onclick(me);}}
this.widgets[d[1]]=b;}}
list_opts={cell_style:{padding:'3px 2px',borderRight:'1px solid #CCC'},alt_cell_style:{backgroundColor:'#F2F2FF'},head_style:{backgroundColor:'#F2F2F2',height:'20px',overflow:'hidden',verticalAlign:'middle',textAlign:'center',fontWeight:'bold',padding:'1px'},head_main_style:{padding:'0px',borderRight:'1px solid #CCC'},hide_export:0,hide_print:0,hide_refresh:0,hide_rec_label:0,show_calc:1,show_empty_tab:1,show_bottom_paging:1,round_corners:1,no_border:0};function Listing(head_text,no_index,no_loading){this.start=0;this.page_len=20;this.paging_len=5;this.filters_per_line=3;this.head_text=head_text?head_text:'Result';this.keyword='records';this.no_index=no_index;this.underline=1;this.show_cell=null;this.show_result=null;this.colnames=null;this.colwidths=null;this.coltypes=null;this.coloptions=null;this.filters={};this.sort_list={};this.sort_order_dict={};this.is_std_query=false;this.server_call=null;this.no_loading=no_loading;this.opts=copy_dict(list_opts);}
Listing.prototype.make=function(parent){var me=this;this.wrapper=parent;this.filter_wrapper=$a(parent,'div','srs_filter_wrapper');this.filter_area=$a(this.filter_wrapper,'div','srs_filter_area');$dh(this.filter_wrapper);this.btn_area=$a(parent,'div','',{margin:'8px 0px'});this.body_area=$a(parent,'div','srs_body_area');var div=$a(this.body_area,'div','srs_paging_area');this.body_head=make_table(div,1,2,'100%',['50%','50%'],{verticalAlign:'middle'});$y(this.body_head,{borderCollapse:'collapse'});this.rec_label=$td(this.body_head,0,0);if(this.opts.hide_rec_label){$y($td(this.body_head,0,0),{width:'0%'});$y($td(this.body_head,0,1),{width:'100%'});}
this.results=$a($a(this.body_area,'div','srs_results_area'),'div');this.fetching_area=$a(this.body_area,'div','',{height:'120px',background:'url("images/ui/square_loading.gif") center no-repeat',display:'none'});if(this.opts.show_empty_tab)
this.make_result_tab();this.bottom_div=$a(this.body_area,'div','',{paddingTop:'8px',height:'22px'});var t=make_table(me.btn_area,1,12,'',['20px','','20px','','20px','','20px','','20px','','20px',''],{height:'36px',verticalAlign:'middle'});var cnt=0;this.btns={};var make_btn=function(label,src,onclick,bold){$w($td(t,0,cnt+1),(20+6*label.length)+'px');var img=$a($td(t,0,cnt+0),'img','');img.src="images/icons/"+src+".gif";var span=$a($td(t,0,cnt+1),'span','link_type',{margin:'0px 8px 0px 4px'});if(bold)$y(span,{fontSize:'14px',fontWeight:'bold'});span.innerHTML=label;span.onclick=onclick;me.btns[label]=[img,span];}
var tmp=0;if(!this.opts.hide_refresh){make_btn('Refresh','page_refresh',function(){me.run();},1);cnt+=2;}
if(this.opts.show_new){make_btn('New ','page_add',function(){new_doc(me.dt);},1);cnt+=2;}
if(this.opts.show_report){make_btn('Report Builder','table',function(){loadreport(me.dt);},0);cnt+=2;}
if(!this.opts.hide_export){make_btn('Export','page_excel',function(){me.do_export();});cnt+=2;}
if(!this.opts.hide_print){make_btn('Print','printer',function(){me.do_print();});cnt+=2;}
if(this.opts.show_calc){make_btn('Calc','calculator',function(){me.do_calc();});cnt+=2;$dh(this.btns['Calc'][0]);$dh(this.btns['Calc'][1]);}
if(!cnt)$dh(this.btn_area);this.paging_nav={};this.make_paging_area('top',$td(this.body_head,0,1));if(this.opts.show_bottom_paging)
this.make_paging_area('bottom',this.bottom_div);}
Listing.prototype.do_print=function(){this.build_query();if(!this.query){alert('No Query!');return;}
args={query:this.query,title:this.head_text,colnames:this.colnames,colwidths:this.colwidths,coltypes:this.coltypes,has_index:(this.no_index?0:1),has_headings:1,check_limit:1,is_simple:1}
print_query(args);}
Listing.prototype.do_calc=function(){show_calc(this.result_tab,this.colnames,this.coltypes,0)}
ListPaging=function(id,list,p){var mo_bg='#FFF';this.list=list;this.wrapper=$a(p,'div','paging_area');$dh(this.wrapper);var cw=['15px','50px'];for(var i=0;i<list.paging_len;i++)cw[cw.length]='20px';cw[cw.length]='35px';cw[cw.length]='15px'
var pt=make_table(this.wrapper,1,cw.length,null,cw)
var me=this;var make_link=function(p,label,onclick,rtborder){p.innerHTML=label;p.style.cursor='pointer';p.onmouseover=function(){if(!this.disabled){this.className='srs_paging_item srs_paging_item_mo'}}
p.onmouseout=function(){this.className='srs_paging_item';}
p.user_onclick=onclick;p.onclick=function(){this.user_onclick();}
p.disable=function(b){if(!b)$op(this,30);p.style.cursor='default';this.disabled=1;}
p.enable=function(){$op(this,100);p.style.cursor='pointer';this.disabled=0;}
p.rtborder=rtborder;if(rtborder)p.style.borderRight='1px solid #CCC';return p;}
var goto_rec=function(t,st){if(!t.disabled){list.start=st;list.run(1);}}
this.prev1=make_link($td(pt,0,0),'<img src="images/ui/prev_pointer.gif">',function(){goto_rec(this,me.list.start-me.list.page_len);});this.prev2=make_link($td(pt,0,1),'Previous',function(){goto_rec(this,me.list.start-me.list.page_len);});for(var i=0;i<list.paging_len;i++){this['p_'+i]=make_link($td(pt,0,i+2),'',function(){goto_rec(this,this.st);},((i==list.paging_len-1)?0:1));}
this.next1=make_link($td(pt,0,cw.length-2),'Next',function(){goto_rec(this,me.list.start+me.list.page_len);});this.next2=make_link($td(pt,0,cw.length-1),'<img src="images/ui/next_pointer.gif">',function(){goto_rec(this,me.list.start+me.list.page_len);});list.paging_nav[id]=this;}
ListPaging.prototype.refresh=function(nr){var lst=this.list;if(cint(lst.max_len)<=cint(lst.page_len)){$dh(this.wrapper);return;}
$ds(this.wrapper);var last=0;var cpage=1;var page_from=1;if((lst.start+nr)==lst.max_len)last=1;if(lst.start>0){this.prev1.enable();this.prev2.enable();cpage=cint(lst.start/lst.page_len)+1;if(cpage>3)page_from=cpage-2;}else{this.prev1.disable();this.prev2.disable();}
for(var i=0;i<lst.paging_len;i++){var st=((page_from-1)+i)*lst.page_len;var p=this['p_'+i];if((page_from+i)==cpage){p.innerHTML=((page_from+i)+'').bold();p.disable(1);}else if(st>lst.max_len){p.innerHTML=(page_from+i)+'';p.disable();}else{p.innerHTML=(page_from+i)+'';p.enable();p.st=st;}}
if(!last){this.next1.enable();this.next2.enable();}else{this.next1.disable();this.next2.disable();}}
Listing.prototype.make_paging_area=function(id,p){new ListPaging(id,this,p);}
Listing.prototype.refresh_paging=function(nr){for(var i in this.paging_nav)this.paging_nav[i].refresh(nr);}
Listing.prototype.hide_paging=function(){for(var i in this.paging_nav)$dh(this.paging_nav[i].wrapper);}
Listing.prototype.add_filter=function(label,ftype,options,tname,fname,cond){if(!this.filter_area){alert('[Listing] make() must be called before add_filter');}
var me=this;if(!this.filter_set){var h=$a(this.filter_area,'div','',{fontSize:'14px',fontWeight:'bold',marginBottom:'4px'});h.innerHTML='Apply Filters';this.filter_area.div=$a(this.filter_area,'div');this.perm=[[1,1],]
this.filters={};}
$ds(this.filter_wrapper);if((!this.inp_tab)||(this.inp_tab.rows[0].cells.length==this.filters_per_line)){this.inp_tab=$a(this.filter_area.div,'table','',{width:'100%'});this.inp_tab.insertRow(0);}
var c=this.inp_tab.rows[0].insertCell(this.inp_tab.rows[0].cells.length);$y(c,{width:cint(100/this.filters_per_line)+'%',textAlign:'left',verticalAlign:'top'});var d1=$a(c,'div');d1.innerHTML=label;$y(d1,{marginBottom:'2px'});var d2=$a(c,'div');if(ftype=='Text')ftype='Data';var inp=make_field({fieldtype:ftype,'label':label,'options':options},'',d2,this,0,1);inp.in_filter=1;inp.report=this;inp.df.single_select=1;inp.parent_cell=c;inp.parent_tab=this.input_tab;$y(inp.wrapper,{width:'140px'});inp.refresh();$y(inp.input,{width:'100%'});inp.tn=tname;inp.fn=fname;inp.condition=cond;var me=this;inp.onchange=function(){me.start=0;}
this.filters[label]=inp;this.filter_set=1;}
Listing.prototype.remove_filter=function(label){var inp=this.filters[label];inp.parent_tab.rows[0].deleteCell(inp.parent_cell.cellIndex);delete this.filters[label];}
Listing.prototype.remove_all_filters=function(){for(var k in this.filters)this.remove_filter(k);$dh(this.filter_wrapper);}
Listing.prototype.add_sort=function(ci,field_name){this.sort_list[ci]=field_name;}
Listing.prototype.has_data=function(){return this.n_records;}
Listing.prototype.set_default_sort=function(fieldname,sort_order){this.sort_order=sort_order;this.sort_order_dict[fieldname]=sort_order;this.sort_by=fieldname;}
Listing.prototype.set_sort=function(cell,ci,field_name){var me=this;$y(cell.sort_cell,{width:'18px'});cell.sort_img=$a(cell.sort_cell,'img');cell.sort_img.src='images/icons/sort_desc.gif';cell.field_name=field_name;$dh(cell.sort_img);$y(cell.label_cell,{textDecoration:'underline',color:'#44A',cursor:'pointer'});cell.onmouseover=function(){$di(this.sort_img);}
cell.onmouseout=function(){$dh(this.sort_img);}
cell.onclick=function(){me.sort_by=this.field_name;if(me.sort_order_dict[field_name]=='ASC'){me.sort_order='ASC';me.sort_order_dict[field_name]='DESC';this.sort_img.src='images/icons/sort_desc.gif';}else{me.sort_order='DESC';me.sort_order_dict[field_name]='ASC';this.sort_img.src='images/icons/sort_asc.gif';}
me.run();}}
Listing.prototype.do_export=function(){this.build_query();var cn=[];if(this.no_index)
cn=this.colnames;else{for(var i=1;i<this.colnames.length;i++)cn.push(this.colnames[i]);}
var q=export_ask_for_max_rows(this.query,function(query){export_csv(query,this.head_text,null,1,null,cn);});}
Listing.prototype.build_query=function(){if(this.get_query)this.get_query(this);if(!this.query){alert('No Query!');return;}
var cond=[];for(var i in this.filters){var f=this.filters[i];var val=f.get_value();var c=f.condition;if(!c)c='=';if(val&&c.toLowerCase()=='like')val+='%';if(f.tn&&val&&!in_list(['All','Select...',''],val))
cond.push(repl(' AND `tab%(dt)s`.%(fn)s %(condition)s "%(val)s"',{dt:f.tn,fn:f.fn,condition:c,val:val}));}
if(cond){this.query+=NEWLINE+cond.join(NEWLINE)
this.query_max+=NEWLINE+cond.join(NEWLINE)}
if(this.group_by)
this.query+=' '+this.group_by+' ';if(this.sort_by&&this.sort_order){this.query+=NEWLINE+' ORDER BY '+this.sort_by+' '+this.sort_order;}
if(this.show_query)msgprint(this.query);}
Listing.prototype.set_rec_label=function(total,cur_page_len){if(this.opts.hide_rec_label)
return;else if(total==-1)
this.rec_label.innerHTML='Fetching...'
else if(total>0)
this.rec_label.innerHTML=repl('Total %(total)s %(keyword)s. Showing %(start)s to %(end)s',{total:total,start:cint(this.start)+1,end:cint(this.start)+cint(cur_page_len),keyword:this.keyword});else if(total==null)
this.rec_label.innerHTML=''
else if(total==0)
this.rec_label.innerHTML='No Result'}
Listing.prototype.run=function(from_page){this.build_query();var q=this.query;var me=this;if(this.max_len&&this.start>=this.max_len)this.start-=this.page_len;if(this.start<0||(!from_page))this.start=0;q+=' LIMIT '+this.start+','+this.page_len;var call_back=function(r,rt){me.clear_tab();me.max_len=r.n_values;if(r.values&&r.values.length){me.n_records=r.values.length;var nc=r.values[0].length;if(me.colwidths)nc=me.colwidths.length-(me.no_index?0:1);if(!me.show_empty_tab){me.remove_result_tab();me.make_result_tab(r.values.length);}
me.refresh(r.values.length,nc,r.values);me.total_records=r.n_values;me.set_rec_label(r.n_values,r.values.length);}else{me.n_records=0;me.set_rec_label(0);if(!me.show_empty_tab){me.remove_result_tab();me.make_result_tab(0);}else{me.clear_tab();}}
$ds(me.results);if(me.onrun)me.onrun();}
this.set_rec_label(-1);if(this.server_call)
{this.server_call(this,call_back);}
else{args={query_max:this.query_max,'defaults':pack_defaults(),'roles':'["'+user_roles.join('","')+'"]'}
if(this.is_std_query)args.query=q;else args.simple_query=q;$c('runquery',args,call_back,null,this.no_loading);}}
Listing.prototype.remove_result_tab=function(){if(!this.result_tab)return;this.result_tab.parentNode.removeChild(this.result_tab);delete this.result_tab;}
Listing.prototype.reset_tab=function(){this.remove_result_tab();this.make_result_tab();}
Listing.prototype.make_result_tab=function(nr){if(this.result_tab)return;if(!this.colwidths)alert("Listing: Must specify column widths");var has_headrow=this.colnames?1:0;if(nr==null)nr=this.page_len;nr+=has_headrow;var nc=this.colwidths.length;var t=make_table(this.results,nr,nc,'100%',this.colwidths,{padding:'0px'});t.className='srs_result_tab';this.result_tab=t;$y(t,{borderCollapse:'collapse'});if(has_headrow)
this.make_headings(t,nr,nc);for(var ri=(has_headrow?1:0);ri<t.rows.length;ri++){for(var ci=0;ci<t.rows[ri].cells.length;ci++){if(this.opts.cell_style)$y($td(t,ri,ci),this.opts.cell_style);if(this.opts.alt_cell_style&&(ri%2))$y($td(t,ri,ci),this.opts.alt_cell_style);if(this.opts.show_empty_tab)$td(t,ri,ci).innerHTML='&nbsp;';}}
if(this.opts.no_border==1){$y(t,{border:'0px'});}
this.result_tab=t;}
Listing.prototype.clear_tab=function(){$dh(this.results);if(this.result_tab){var nr=this.result_tab.rows.length;for(var ri=(this.colnames?1:0);ri<nr;ri++)
for(var ci=0;ci<this.result_tab.rows[ri].cells.length;ci++)
$td(this.result_tab,ri,ci).innerHTML=(this.opts.show_empty_tab?'&nbsp;':'');}}
Listing.prototype.clear=function(){this.rec_label.innerHTML='';this.clear_tab();}
Listing.prototype.refresh_calc=function(){if(!this.opts.show_calc)return;if(has_common(this.coltypes,['Currency','Int','Float'])){$di(this.btns['Calc'][0]);$di(this.btns['Calc'][1]);}}
Listing.prototype.refresh=function(nr,nc,d){this.refresh_paging(nr);this.refresh_calc();if(this.show_result)
this.show_result();else{if(nr){var has_headrow=this.colnames?1:0;for(var ri=0;ri<nr;ri++){var c0=$td(this.result_tab,ri+has_headrow,0);if(!this.no_index){c0.innerHTML=cint(this.start)+cint(ri)+1;}
for(var ci=0;ci<nc;ci++){var c=$td(this.result_tab,ri+has_headrow,ci+(this.no_index?0:1));if(c){c.innerHTML='';if(this.show_cell)this.show_cell(c,ri,ci,d);else this.std_cell(d,ri,ci);}}}}}}
Listing.prototype.make_headings=function(t,nr,nc){for(var ci=0;ci<nc;ci++){var tmp=make_table($td(t,0,ci),1,2,'100%',['','0px'],this.opts.head_style);$y(tmp,{tableLayout:'fixed',borderCollapse:'collapse'});$y($td(t,0,ci),this.opts.head_main_style);$td(t,0,ci).sort_cell=$td(tmp,0,1);$td(t,0,ci).label_cell=$td(tmp,0,0);$td(tmp,0,1).style.padding='0px';$td(tmp,0,0).innerHTML=this.colnames[ci]?this.colnames[ci]:'&nbsp;';if(this.sort_list[ci])this.set_sort($td(t,0,ci),ci,this.sort_list[ci]);var div=$a($td(t,0,ci),'div');div.style.borderBottom='1px solid #CCC';if(this.coltypes&&this.coltypes[ci]&&in_list(['Currency','Float','Int'],this.coltypes[ci]))$y($td(t,0,ci).label_cell,{textAlign:'right'})}}
Listing.prototype.std_cell=function(d,ri,ci){var has_headrow=this.colnames?1:0;var c=$td(this.result_tab,ri+has_headrow,ci+(this.no_index?0:1));c.div=$a(c,'div');$s(c.div,d[ri][ci],this.coltypes?this.coltypes[ci+(this.no_index?0:1)]:null,this.coloptions?this.coloptions[ci+(this.no_index?0:1)]:null);}
function MenuToolbar(parent){this.ul=$a(parent,'ul','menu_toolbar');this.cur_top_menu=null;this.max_rows=10;this.dropdown_width='280px';this.top_menus={};this.top_menu_style='top_menu';this.top_menu_mo_style='top_menu_mo';}
MenuToolbar.prototype.add_top_menu=function(label,onclick){var li=$a(this.ul,'li');var a=$a(li,'a',this.top_menu_style);var me=this;a.onclick=function(){onclick();};a.innerHTML=label;a.onmouseover=function(){if(this!=me.cur_top_menu)this.className=me.top_menu_style+' '+me.top_menu_mo_style;if(a.my_mouseover)a.my_mouseover(this);}
a.onmouseout=function(){if(a.my_mouseout)a.my_mouseout(this);if(this!=me.cur_top_menu)
this.className=me.top_menu_style;}
a.set_unselected=function(){this.className=me.top_menu_style;me.is_active=0;}
a.set_selected=function(){if(me.cur_top_menu)me.cur_top_menu.set_unselected();this.className=me.top_menu_style+' '+me.top_menu_mo_style;me.cur_top_menu=this;me.is_active=1;}
this.top_menus[label]=a;return a;}
var closetimer;function mclose(){for(var i=0;i<all_dropdowns.length;i++){if(all_dropdowns[i].is_active)
all_dropdowns[i].hide();}}
function mclosetime(){closetimer=window.setTimeout(mclose,500);}
function mcancelclosetime(){if(closetimer){window.clearTimeout(closetimer);closetimer=null;}}
MenuToolbar.prototype.make_dropdown=function(tm){var me=this;var dropdown=new DropdownMenu(tm.parentNode,this.dropdown_width);tm.dropdown=dropdown;tm.my_mouseover=function(){this.dropdown.show();}
tm.my_mouseout=function(){this.dropdown.clear();}}
MenuToolbar.prototype.add_item=function(top_menu_label,label,onclick,on_top){var me=this;var tm=this.top_menus[top_menu_label];if(!tm.dropdown)
this.make_dropdown(tm,this.dropdown_width);return tm.dropdown.add_item(label,onclick,on_top);}
var all_dropdowns=[];function DropdownMenu(label_ele,width){this.body=$a(label_ele,'div','menu_toolbar_dropdown',{width:(width?width:'140px')});this.label=label_ele;this.items={};this.item_style='dd_item';this.item_mo_style='dd_item_mo';this.max_height=400;var me=this;this.body.onmouseout=function(){me.clear();}
this.body.onmouseover=function(){mcancelclosetime();}
this.show=function(){mclose();mcancelclosetime();hide_selects();$ds(me.body);if(cint(me.body.clientHeight)>=me.max_height){$y(me.body,{height:'400px'});}else{$y(me.body,{height:null});}
if(me.label.set_selected)
me.label.set_selected();me.is_active=1;}
this.hide=function(){$dh(me.body);if(!frozen)show_selects();me.is_active=0;if(me.label.set_unselected)
me.label.set_unselected();}
this.clear=function(){mcancelclosetime();mclosetime();}
all_dropdowns.push(me);}
DropdownMenu.prototype.add_item=function(label,onclick,on_top){var me=this;if(on_top){var mi=document.createElement('div');me.body.insertBefore(mi,me.body.firstChild);mi.className=this.item_style;}else{var mi=$a(this.body,'div',this.item_style);}
mi.innerHTML=label;mi.onclick=onclick;mi.onmouseover=function(){this.className=me.item_style+' '+me.item_mo_style;me.cur_mi=this;}
mi.onmouseout=function(){this.className=me.item_style;}
mi.bring_to_top=function(){me.body.insertBefore(this,me.body.firstChild);}
this.items[label]=mi;return mi;}
function Layout(parent,width){if(parent&&parent.substr){parent=$i(parent);}
if(parent)
this.wrapper=$a(parent,'div','layoutDiv');else{this.wrapper=document.createElement('div')
this.wrapper.className='layoutDiv';}
$w(this.wrapper,width?width:(pagewidth+'px'));this.width=this.wrapper.style.width;this.myrows=[];}
Layout.prototype.addrow=function(){this.cur_row=new LayoutRow(this,this.wrapper);this.myrows[this.myrows.length]=this.cur_row;return this.cur_row}
Layout.prototype.addsubrow=function(){this.cur_row=new LayoutRow(this,this.cur_row.wrapper);this.myrows[this.myrows.length]=this.cur_row;return this.cur_row}
Layout.prototype.addcell=function(width){return this.cur_row.addCell(width);}
Layout.prototype.setcolour=function(col){$bg(cc,col);}
Layout.prototype.show=function(){$ds(this.wrapper);}
Layout.prototype.hide=function(){$dh(this.wrapper);}
Layout.prototype.close_borders=function(){if(this.with_border){this.myrows[this.myrows.length-1].wrapper.style.borderBottom='1px solid #000';}}
function LayoutRow(layout,parent){this.layout=layout;this.wrapper=$a(parent,'div','layout_row');this.sub_wrapper=$a(this.wrapper,'div');if(layout.with_border){this.wrapper.style.border='1px solid #000';this.wrapper.style.borderBottom='0px';}
this.header=$a(this.sub_wrapper,'div');this.body=$a(this.sub_wrapper,'div');this.table=$a(this.body,'table','layout_row_table');this.row=this.table.insertRow(0);this.mycells=[];}
LayoutRow.prototype.hide=function(){$dh(this.wrapper);}
LayoutRow.prototype.show=function(){$ds(this.wrapper);}
LayoutRow.prototype.addCell=function(wid){var lc=new LayoutCell(this.layout,this,wid);this.mycells[this.mycells.length]=lc;return lc;}
function LayoutCell(layout,layoutRow,width){if(width){var w=width+'';if(w.substr(w.length-2,2)!='px'){if(w.substr(w.length-1,1)!="%"){width=width+'%'};}}
this.width=width;this.layout=layout;var cidx=layoutRow.row.cells.length;this.cell=layoutRow.row.insertCell(cidx);this.cell.style.verticalAlign='top';if(width)
this.cell.style.width=width;var h=$a(this.cell,'div');this.wrapper=$a(this.cell,'div','',{padding:'8px'});layout.cur_cell=this.wrapper;layout.cur_cell.header=h;}
LayoutCell.prototype.show=function(){$ds(this.wrapper);}
LayoutCell.prototype.hide=function(){$dh(this.wrapper);}
function TabbedPage(parent,only_labels){this.tabs={};this.cur_tab=null;var lw=$a(parent,'div','box_label_wrapper');var lb=$a(lw,'div','box_label_body');this.label_area=$a(lb,'ul','box_tabs');if(!only_labels)this.body_area=$a(parent,'div');else this.body_area=null;}
TabbedPage.prototype.add_tab=function(n,onshow){var tab=$a(this.label_area,'li');tab.label=$a(tab,'a');tab.label.innerHTML=n;if(this.body_area){tab.tab_body=$a(this.body_area,'div','box_tabs_body');$dh(tab.tab_body);}else{tab.tab_body=null;}
tab.onshow=onshow;var me=this;tab.hide=function(){if(this.tab_body)$dh(this.tab_body);this.className='';hide_autosuggest();}
tab.set_selected=function(){if(me.cur_tab)me.cur_tab.hide();this.className='box_tab_selected';$op(this,100);me.cur_tab=this;}
tab.show=function(arg){this.set_selected();if(this.tab_body)$ds(this.tab_body);if(this.onshow)this.onshow(arg);}
tab.onmouseover=function(){if(me.cur_tab!=this)$op(this,60);}
tab.onmouseout=function(){$op(this,100);}
tab.onclick=function(){this.show();}
this.tabs[n]=tab;return tab;}
TabbedPage.prototype.disable_tab=function(n){if(this.cur_tab==this.tabs[n])this.tabs[n].hide();$dh(this.tabs[n])}
TabbedPage.prototype.enable_tab=function(n){$di(this.tabs[n])}
function WNToolbar(parent){var me=this;this.setup=function(){this.wrapper=$a(parent,'div','',{borderBottom:'1px solid #CCC'});this.body_tab=make_table(this.wrapper,1,4,'100%',['5%','45%','25%','25%'],{padding:'2px'});this.webnotes=$a($td(this.body_tab,0,0),'img','',{marginTop:'0px',cursor:'pointer'})
this.webnotes.src='images/ui/webnotes20x80-1.gif';this.webnotes.onclick=function(){show_about();}
this.menu=new MenuToolbar($td(this.body_tab,0,1));this.setup_start();this.setup_home();this.setup_new();this.setup_recent();this.setup_report_builder();this.setup_logout();this.setup_search();}
this.setup_start=function(){var tm=this.menu.add_top_menu('Start',function(){});var fn=function(){if(this.dt=='Page')
loadpage(this.dn);else
loaddoc(this.dt,this.dn);mclose();}
profile.start_items.sort(function(a,b){return(a[4]-b[4])});for(var i=0;i<profile.start_items.length;i++){var d=profile.start_items[i];var mi=this.menu.add_item('Start',d[1],fn);mi.dt=d[0];mi.dn=d[5]?d[5]:d[1];}}
this.setup_home=function(){this.menu.add_top_menu('Home',function(){loadpage(home_page);});}
this.setup_new=function(){this.menu.add_top_menu('New',function(){});var fn=function(){new_doc(this.dt);mclose();}
for(var i=0;i<profile.can_create.length;i++){var mi=this.menu.add_item('New',profile.can_create[i],fn);mi.dt=profile.can_create[i];}}
this.setup_recent=function(){this.rdocs=me.menu.add_top_menu('Recent',function(){});this.rdocs.items={};var fn=function(){loaddoc(this.dt,this.dn);mclose();}
this.rdocs.add=function(dt,dn,on_top){if(!in_list(['Start Page','ToDo Item','Event','Search Criteria'],dt)){if(this.items[dt+'-'+dn]){var mi=this.items[dt+'-'+dn];mi.bring_to_top();return;}
var tdn=dn;var rec_label='<table style="width: 100%" cellspacing=0><tr>'
+'<td style="width: 10%; vertical-align: middle;"><div class="status_flag" id="rec_'+dt+'-'+dn+'"></div></td>'
+'<td style="width: 50%; text-decoration: underline; color: #22B; padding: 2px;">'+tdn+'</td>'
+'<td style="font-size: 11px;">'+dt+'</td></tr></table>';var mi=me.menu.add_item('Recent',rec_label,fn,on_top);mi.dt=dt;mi.dn=dn;this.items[dt+'-'+dn]=mi;if(pscript.on_recent_update)pscript.on_recent_update();}}
this.rdocs.remove=function(dt,dn){var it=this.rdocs.items[dt+'-'+dn];if(it)$dh(it);if(pscript.on_recent_update)pscript.on_recent_update();}
var rlist=profile.recent.split('\n');var m=rlist.length;if(m>15)m=15;for(var i=0;i<m;i++){var t=rlist[i].split('~~~');if(t[1]){var dn=t[0];var dt=t[1];this.rdocs.add(dt,dn,0);}}
this.rename_notify=function(dt,old,name){rdocs.remove(dt,old);rdocs.add(dt,name,1);}
rename_observers.push(this);}
this.setup_report_builder=function(){me.menu.add_top_menu('Report Builder',function(){});var fn=function(){loadreport(this.dt);mclose();}
for(var i=0;i<profile.can_get_report.length;i++){var mi=me.menu.add_item('Report Builder',profile.can_get_report[i],fn);mi.dt=profile.can_get_report[i];}}
this.setup_logout=function(){var w=$a($td(this.body_tab,0,2),'div','',{paddingTop:'2px'});var t=make_table(w,1,3,null,[null,null,null],{padding:'2px 6px',borderLeft:'1px solid #CCC',fontSize:'13px'});$y($td(t,0,0),{border:'0px'});$td(t,0,0).innerHTML=user_fullname;$td(t,0,1).innerHTML='<span class="link_type" onclick="loaddoc(\'Profile\', user);">Profile</span>';$td(t,0,2).innerHTML='<span class="link_type" onclick="logout()">Logout</span>';}
this.setup_search=function(){var w=$a($td(this.body_tab,0,3),'div');this.search_sel=$a(w,'select','',{width:'100px',margin:'0px',marginRight:'8px'});this.search_btn=$a(w,'button');this.search_btn.innerHTML='Search';if(isIE6){$y($td(this.body_tab,0,3),{paddingTop:'0px'});$y(this.search_btn,{marginTop:'2px'});}
function open_quick_search(){selector.set_search(sel_val(me.search_sel));me.search_sel.disabled=1;selector.show();}
add_sel_options(me.search_sel,profile.can_read);me.search_sel.selectedIndex=0;me.search_sel.onchange=function(){open_quick_search();}
select_register.push(me.search_sel);this.search_btn.onclick=function(){open_quick_search();}
makeselector();}
this.setup();}
var nav_obj={}
nav_obj.ol=[];nav_obj.open_notify=function(t,dt,dn){if(nav_obj.length){var tmp=nav_obj[nav_obj.length-1];if(tmp[0]==t&&tmp[1]==dt&&tmp[2]==dn)return;}
var tmp=[];for(var i in nav_obj.ol)
if(!(nav_obj.ol[i][0]==t&&nav_obj.ol[i][1]==dt&&nav_obj.ol[i][2]==dn))tmp.push(nav_obj.ol[i]);nav_obj.ol=tmp;nav_obj.ol.push([t,dt,dn])
dhtmlHistory.add(t+'~~~'+dt+(dn?('~~~'+dn):''),'');if(!(has_back_link&&dt))return;var l=$i('back_link');var tmp=nav_obj.ol[nav_obj.ol.length-2];if(tmp)
l.innerHTML=('<< Back to '+(tmp[0]=='Page'?tmp[1]:(tmp[1]+' '+tmp[2]))).bold();else
l.innerHTML='';}
nav_obj.rename_notify=function(dt,oldn,newn){for(var i in nav_obj.ol)
if(nav_obj.ol[i][1]==dt&&nav_obj.ol[i][2]==oldn)nav_obj.ol[i][2]=newn;}
nav_obj.show_last_open=function(){var l=nav_obj.ol[nav_obj.ol.length-2];delete nav_obj.ol[nav_obj.ol.length-1];if(!l)loadpage('_home');else if(l[0]=='Page'){loadpage(l[1]);}else if(l[0]=='Report'){loadreport(l[1],l[2]);}else if(l[0]=='DocType'){loaddoc(l[1],l[2]);}else if(l[0]=='Application'){loadapp(l[1]);}}
search_fields={};function makeselector2(){var d=new Dialog(640,440,'Search');d.make_body([['HTML','List']]);d.loading_div=$a(d.widgets.List,'div','comment',{margin:'8px 0px',display:'none'});d.loading_div.innerHTML='Setting up...';d.ls=new Listing("Search",1);d.ls.opts={cell_style:{padding:'3px 2px',border:'0px'},alt_cell_style:{backgroundColor:'#FFFFFF'},hide_export:1,hide_print:1,hide_refresh:0,hide_rec_label:0,show_calc:0,show_empty_tab:0,show_bottom_paging:0,round_corners:0,no_border:1}
d.ls.is_std_query=1;d.ls.colwidths=[''];d.ls.make(d.widgets.List);$y(d.ls.results,{height:'200px',overflowY:'auto'});d.ls.get_query=function(){if(d.input&&d.input.get_query){var doc={};if(cur_frm)doc=locals[cur_frm.doctype][cur_frm.docname];this.query=d.input.get_query(doc);this.query_max='SELECT COUNT(*) FROM '+this.query.split(' FROM ')[1];}else{var q={};var fl=[]
q.table=repl('`tab%(dt)s`',{dt:d.sel_type});for(var i in d.fields)
fl.push(q.table+'.`'+d.fields[i][0]+'`')
q.fields=fl.join(', ');q.conds=q.table+'.docstatus < 2 ';this.query=repl("SELECT %(fields)s FROM %(table)s WHERE %(conds)s",q);this.query_max=repl("SELECT COUNT(*) FROM %(table)s WHERE %(conds)s",q);}}
d.ls.show_cell=function(cell,ri,ci,dat){var l=$a($a(cell,'div','',{borderBottom:'1px dashed #CCC',paddingBottom:'4px'}),'span','link_type');l.innerHTML=dat[ri][0];l.d=d;l.onclick=function(){if(this.d.style=='Search')
loaddoc(this.d.sel_type,this.innerHTML);else
setlinkvalue(this.innerHTML);}
var l=$a(cell,'div','comment');var tmp=[];for(var i=1;i<dat[ri].length;i++)tmp.push(dat[ri][i]);l.innerHTML=tmp.join(', ');}
d.set_search=function(dt){if(d.style!='Search'){d.ls.clear();}
d.style='Search';if(d.input){d.input=null;sel_type=null;}
d.sel_type=dt;d.title_text.innerHTML='Search for '+dt;}
d.set=function(input,type,label){d.sel_type=type;d.input=input;if(d.style!='Link'){d.ls.clear();}
d.style='Link';if(!d.sel_type)d.sel_type='Value';d.title_text.innerHTML='Select a "'+d.sel_type+'" for field "'+label+'"';}
d.onshow=function(){if(d.sel_type!='Value'&&!search_fields[d.sel_type]){$dh(d.ls.wrapper);$ds(d.loading_div);$c('getsearchfields',{doctype:d.sel_type},function(r,rt){search_fields[d.sel_type]=r.searchfields;d.show_lst();})}else{d.show_lst();}}
d.onhide=function(){if(page_body.wntoolbar)
page_body.wntoolbar.search_sel.disabled=0;}
d.show_lst=function(){$ds(d.ls.wrapper);$dh(d.loading_div);d.fields=search_fields[d.sel_type];if(d.sel_type=='Value'){d.fields=[];}
if(d.sel_type!=d.set_doctype){d.ls.clear();d.ls.remove_all_filters();for(var i=0;i<(d.fields.length>4?4:d.fields.length);i++){if(d.fields[i][2]=='Link')d.fields[i][2]='Data';d.ls.add_filter(d.fields[i][1],d.fields[i][2],d.fields[i][3],d.sel_type,d.fields[i][0],(in_list(['Data','Text','Link'],d.fields[i][2])?'LIKE':''));}}
d.set_doctype=d.sel_type;if(d.ls.filters['ID'].input)d.ls.filters['ID'].input.focus();}
selector=d;}
function makeselector(){var d=new Dialog(540,440,'Search');d.make_body([['Data','Beginning With','Tip: You can use wildcard "%"'],['Select','Search By'],['Button','Search'],['HTML','Result']]);d.wrapper.style.zIndex=93;var inp=d.widgets['Beginning With'];var field_sel=d.widgets['Search By'];var btn=d.widgets['Search'];d.sel_type='';d.values_len=0;d.set=function(input,type,label){d.sel_type=type;d.input=input;if(d.style!='Link'){d.rows['Result'].innerHTML='';d.values_len=0;}
d.style='Link';if(!d.sel_type)d.sel_type='Value';d.title_text.innerHTML='Select a "'+d.sel_type+'" for field "'+label+'"';}
d.set_search=function(dt){if(d.style!='Search'){d.rows['Result'].innerHTML='';d.values_len=0;}
d.style='Search';if(d.input){d.input=null;sel_type=null;}
d.sel_type=dt;d.title_text.innerHTML='Quick Search for '+dt;}
inp.onkeydown=function(e){if(isIE)var kc=window.event.keyCode;else var kc=e.keyCode;if(kc==13)if(!btn.disabled)btn.onclick();}
var _add_sel_options=function(s,list){for(var i in list){s.options[s.options.length]=new Option(list[i][1],list[i][0],false,false);}}
d.onshow=function(){if(d.set_doctype!=d.sel_type){d.rows['Result'].innerHTML='';d.values_len=0;}
inp.value='';if(d.input&&d.input.txt.value){inp.value=d.input.txt.value;}
try{inp.focus();}catch(e){}
if(d.input)d.input.set_get_query();$ds(d.rows['Search By']);if(search_fields[d.sel_type]){empty_select(field_sel);_add_sel_options(field_sel,search_fields[d.sel_type]);}else{empty_select(field_sel);_add_sel_options(field_sel,[['name','ID']]);$c('getsearchfields',{'doctype':d.sel_type},function(r,rt){search_fields[d.sel_type]=r.searchfields;empty_select(field_sel);_add_sel_options(field_sel,search_fields[d.sel_type]);field_sel.selectedIndex=0;});}}
d.onhide=function(){if(page_body.wntoolbar)
page_body.wntoolbar.search_sel.disabled=0;}
btn.onclick=function(){btn.disabled=true;d.set_doctype=d.sel_type;var q='';if(d.input&&d.input.get_query){var doc={};if(cur_frm)doc=locals[cur_frm.doctype][cur_frm.docname];var q=d.input.get_query(doc);if(!q){return'';}}
$c('search2',args={'txt':strip(inp.value),'doctype':d.sel_type,'defaults':pack_defaults(),'query':q,'searchfield':sel_val(field_sel),'defaults':pack_defaults(),'roles':'["'+user_roles.join('","')+'"]'},function(r,rtxt){btn.disabled=false;if(r.coltypes)r.coltypes[0]='Link';d.values_len=r.values.length;d.set_result(r);},function(){btn.disabled=false;});}
d.set_result=function(r){d.rows['Result'].innerHTML='';var c=$a(d.rows['Result'],'div','comment',{paddingBottom:'4px',marginBottom:'4px',borderBottom:'1px solid #CCC',marginLeft:'4px'});if(r.values.length==50)
c.innerHTML='Showing max 50 results. Use filters to narrow down your search';else
c.innerHTML='Showing '+r.values.length+' resuts.';var w=$a(d.rows['Result'],'div','',{height:'240px',overflow:'auto',margin:'4px'});for(var i=0;i<r.values.length;i++){var div=$a(w,'div','',{marginBottom:'4px',paddingBottom:'4px',borderBottom:'1px dashed #CCC'});var l=$a(div,'div','link_type');l.innerHTML=r.values[i][0];l.link_name=r.values[i][0];l.dt=r.coloptions[0];if(d.input)
l.onclick=function(){setlinkvalue(this.link_name);}
else
l.onclick=function(){loaddoc(this.dt,this.link_name);}
var cl=[]
for(var j=1;j<r.values[i].length;j++)cl.push(r.values[i][j]);var c=$a(div,'div','comment',{marginTop:'2px'});c.innerHTML=cl.join(', ');}}
d.wrapper.style.zIndex='95';selector=d;}
function Body(){var me=this;this.wrapper=$i('body_div');this.no_of_columns=function(){var n=1;if(cint(this.cp.left_sidebar_width))n++;if(cint(this.cp.right_sidebar_width))n++;return n;}
this.setup_sidebars=function(){var n=this.no_of_columns();if(n==1)
this.center=this.body;else{this.body_table=make_table(this.body,1,n,'100%');var c=0;if(cint(this.cp.left_sidebar_width)){this.left_sidebar=$td(this.body_table,0,c);c++;}
this.center=$td(this.body_table,0,c);c++;if(cint(this.cp.right_sidebar_width)){this.right_sidebar=$td(this.body_table,0,c);c++;}}}
this.setup=function(){this.cp=locals['Control Panel']['Control Panel'];this.wntoolbar=new WNToolbar(this.wrapper);this.header=$a(this.wrapper,'div');this.body=$a(this.wrapper,'div');this.footer=$a(this.wrapper,'div');this.setup_sidebars();if(this.cp.page_width)$y(this.wrapper,{width:cint(this.cp.page_width)+'px'});}
this.containers={};this.cur_cont=null;this.add_container=function(label,onshow){var c=$a(this.center,'div');if(onshow)c.onshow=onshow;this.containers[label]=c;}
this.change_to=function(label){if(me.cur_cont)
$dh(me.cur_cont);me.cur_cont=me.containers[label];$ds(me.cur_cont);if(me.cur_cont.onshow)
me.cur_cont.onshow(me.cur_cont);}
this.resize=function(){}
this.set_width=function(){}
this.setup();}
function get_scroll_top(){var st=0;if(document.documentElement&&document.documentElement.scrollTop)
st=document.documentElement.scrollTop;else if(document.body&&document.body.scrollTop)
st=document.body.scrollTop;return st;}
function set_loading(){var d=$i('loading_div')
if(!d)return;d.style.top=(get_scroll_top()+10)+'px';$ds(d);pending_req++;}
function hide_loading(){var d=$i('loading_div')
if(!d)return;pending_req--;if(!pending_req)$dh(d);}
var fcount=0;var frozen=0;function freeze(msg,do_freeze){if(msg){var div=$i('dialog_message');var d=get_screen_dims();div.style.left=((d.w-250)/2)+'px';div.style.top=(get_scroll_top()+200)+'px';div.innerHTML='<div style="font-size:16px; color: #444; font-weight: bold; text-align: center;">'+msg+'</div>';$ds(div);}
hide_selects();$ds($i('dialog_back'));$h($i('dialog_back'),document.body.offsetHeight+'px');fcount++;frozen=1;}
function unfreeze(){$dh($i('dialog_message'));if(!fcount)return;fcount--;if(!fcount){$dh($i('dialog_back'));show_selects();frozen=0;}}
function hide_selects(){if(!isIE6)return;$dh('form_newsel');for(var i=0;i<select_register.length;i++){select_register[i].style.visibility='hidden';}}
function show_selects(){if(!isIE6)return;$ds('form_newsel');for(var i=0;i<select_register.length;i++){select_register[i].style.visibility='visible';}}
var err_console;var err_list=[];function errprint(t){err_list[err_list.length]=('<pre style="font-family: Courier, Fixed; font-size: 11px; border-bottom: 1px solid #AAA; overflow: auto; width: 90%;">'+t+'</pre>');}
function submit_error(e){if(isIE){var t='Explorer: '+e+'\n'+e.description;}else{var t='Mozilla: '+e.toString()+'\n'+e.message+'\nLine Number:'+e.lineNumber;}
$c('client_err_log',args={'error':t});errprint(e+'\nLine Number:'+e.lineNumber+'\nStack:'+e.stack);}
function setup_err_console(){err_console=new Dialog(640,480,'Error Console')
err_console.make_body([['HTML','Error List'],['Button','Ok'],['Button','Clear']]);err_console.widgets['Ok'].onclick=function(){err_console.hide();}
err_console.widgets['Clear'].onclick=function(){err_list=[];err_console.rows['Error List'].innerHTML='';}
err_console.onshow=function(){about_dialog.hide();err_console.rows['Error List'].innerHTML='<div style="padding: 16px; height: 360px; width: 90%; overflow: auto;">'
+err_list.join('<div style="height: 10px; margin-bottom: 10px; border-bottom: 1px solid #AAA"></div>')+'</div>';}}
startup_list.push(setup_err_console);var about_dialog;function show_about(){if(!about_dialog){var d=new Dialog(360,480,'About')
d.make_body([['HTML','info']]);var reset_testing_html='';if(has_common(user_roles,['Administrator','System Manager'])){reset_testing_html="<br><div onclick='setup_testing()' class='link_type'>Reset Testing Mode (Old testing data will be lost)</div>"
+"<br><div onclick='download_backup()' class='link_type'>Download Backup</div>";}
d.rows['info'].innerHTML="<div style='padding: 16px;'><center>"
+"<div style='text-align: center'><img src = 'images/ui/webnotes30x120.gif'></div>"
+"<br><br>&copy; 2007-08 Web Notes Technologies Pvt. Ltd."
+"<p><span style='color: #888'>Customized Web Based Solutions and Products</span>"
+"<br>51 / 2406, Nishigandha, Opp MIG Cricket Club,<br>Bandra (East),<br>Mumbai 51</p>"
+"<p>Phone: +91-22-6526-5364 (M-F 9-6)"
+"<br>Email: info@webnotestech.com"
+"<br><b>Customer Support: support@webnotestech.com</b></p>"
+"<p><a href='http://www.webnotestech.com'>www.webnotestech.com</a></p></center>"
+"<div style='background-color: #DFD; padding: 16px;'>"
+"<div id='testing_mode_link' onclick='enter_testing()' class='link_type'>Enter Testing Mode</div>"
+reset_testing_html
+"<br><div onclick='err_console.show()' class='link_type'><b>Error Console</b></div>"
+"</div>"
+"</div>";if(is_testing)$i('testing_mode_link').innerHTML='End Testing';about_dialog=d;}
about_dialog.show();}
function download_backup(){window.location=outUrl+"?cmd=backupdb&read_only=1&__account="+account_id
+(__sid150?("&sid150="+__sid150):'')
+"&db_name="+account_id;}
function enter_testing(){about_dialog.hide();if(is_testing){end_testing();return;}
var a=prompt('Type in the password','');if(a=='start testing'){$c('start_test',args={},function(){$ds('testing_div');is_testing=true;$i('testing_mode_link').innerHTML='End Testing';});}else{msgprint('Sorry, only administrators are allowed use the testing mode.');}}
function setup_testing(){about_dialog.hide();$c('setup_test',args={},function(){});}
function end_testing(){$c('end_test',args={},function(){$dh('testing_div');is_testing=false;$i('testing_mode_link').innerHTML='Enter Testing Mode';});}
var locals={};var fields={};var fields_list={};var LocalDB={};LocalDB.getchildren=function(child_dt,parent,parentfield,parenttype){var l=[];for(var key in locals[child_dt]){var d=locals[child_dt][key];if((d.parent==parent)&&(d.parentfield==parentfield)){if(parenttype){if(d.parenttype==parenttype)l.push(d);}else{l.push(d);}}}
l.sort(function(a,b){return(cint(a.idx)-cint(b.idx))});return l;}
LocalDB.add=function(dt,dn){if(!locals[dt])locals[dt]={};if(locals[dt][dn])delete locals[dt][dn];locals[dt][dn]={'name':dn,'doctype':dt,'docstatus':0};return locals[dt][dn];}
LocalDB.delete_doc=function(dt,dn){var doc=get_local(dt,dn);for(var ndt in locals){if(locals[ndt]){for(var ndn in locals[ndt]){var doc=locals[ndt][ndn];if(doc&&doc.parenttype==dt&&(doc.parent==dn||doc.__oldparent==dn)){locals[ndt][ndn];}}}}
delete locals[dt][dn];}
function get_local(dt,dn){return locals[dt]?locals[dt][dn]:null;}
LocalDB.sync=function(list){if(list._kl)list=expand_doclist(list);for(var i=0;i<list.length;i++){var d=list[i];if(!d.name)
d.name=LocalDB.get_localname(d.doctype);LocalDB.add(d.doctype,d.name);locals[d.doctype][d.name]=d;if(d.doctype=='DocType'){fields_list[d.name]=[];}else if(d.doctype=='DocField'){if(!fields_list[d.parent])fields_list[d.parent]=[];fields_list[d.parent][fields_list[d.parent].length]=d;if(d.fieldname){if(!fields[d.parent])fields[d.parent]={};fields[d.parent][d.fieldname]=d;}else if(d.label){if(!fields[d.parent])fields[d.parent]={};fields[d.parent][d.label]=d;}}else if(d.doctype=='Event'){if((!d.localname)&&calendar&&(!calendar.has_event[d.name]))
calendar.set_event(d);}
if(d.localname)
notify_rename_observers(d.doctype,d.localname,d.name);}}
local_name_idx={};LocalDB.get_localname=function(doctype){if(!local_name_idx[doctype])local_name_idx[doctype]=1;var n='Unsaved '+doctype+'-'+local_name_idx[doctype];local_name_idx[doctype]++;return n;}
LocalDB.create=function(doctype,n){if(!n)n=LocalDB.get_localname(doctype);var doc=LocalDB.add(doctype,n)
doc.__islocal=1;doc.owner=user;set_default_values(doc);return n;}
LocalDB.get_default_value=function(fn,ft,df){if(df=='_Login'||df=='__user')
return user;else if(df=='_Full Name')
return user_fullname;else if(ft=='Date'&&(df=='Today'||df=='__today')){return get_today();}
else if(df)
return df;else if(user_defaults[fn])
return user_defaults[fn][0];else if(sys_defaults[fn])
return sys_defaults[fn];}
LocalDB.add_child=function(doc,childtype,parentfield){var n=LocalDB.create(childtype);var d=locals[childtype][n];d.parent=doc.name;d.parentfield=parentfield;d.parenttype=doc.doctype;return d;}
LocalDB.no_copy_list=['amended_from','amendment_date','cancel_reason'];LocalDB.copy=function(dt,dn,from_amend){var newdoc=LocalDB.create(dt);for(var key in locals[dt][dn]){if(key!=='name'&&key.substr(0,2)!='__'){locals[dt][newdoc][key]=locals[dt][dn][key];}
var df=get_field(dt,key);if(df&&((!from_amend&&cint(df.no_copy)==1)||in_list(LocalDB.no_copy_list,df.fieldname))){locals[dt][newdoc][key]='';}}
return locals[dt][newdoc];}
var rename_observers=[];function notify_rename_observers(dt,old_name,new_name){try{var old=locals[doc.doctype][doc.localname];old.parent=null;old.__deleted=1;}catch(e){alert("[rename_from_local] No Document for: "+doc.localname);}
for(var i=0;i<rename_observers.length;i++){rename_observers.length.rename_notify(dt,old_name,new_name);}}
var Meta={};var local_dt={};Meta.make_local_dt=function(dt,dn){var dl=make_doclist('DocType',dt);if(!local_dt[dt])local_dt[dt]={};if(!local_dt[dt][dn])local_dt[dt][dn]={};for(var i=0;i<dl.length;i++){var d=dl[i];if(d.doctype=='DocField'){var key=d.fieldname?d.fieldname:d.label;local_dt[dt][dn][key]=copy_dict(d);}}}
Meta.get_field=function(dt,fn,dn){if(dn&&local_dt[dt]&&local_dt[dt][dn]){return local_dt[dt][dn][fn];}else{if(fields[dt])var d=fields[dt][fn];if(d)return d;}
return{};}
Meta.set_field_property=function(fn,key,val,doc){if(!doc&&(cur_frm.doc))doc=cur_frm.doc;try{local_dt[doc.doctype][doc.name][fn][key]=val;refresh_field(fn);}catch(e){alert("Client Script Error: Unknown values for "+doc.name+','+fn+'.'+key+'='+val);}}
var getchildren=LocalDB.getchildren;var get_field=Meta.get_field;var createLocal=LocalDB.create;function compress_doclist(list){var kl={};var vl=[];var flx={};for(var i=0;i<list.length;i++){var o=list[i];var fl=[];if(!kl[o.doctype]){var tfl=['doctype','name','docstatus','owner','parent','parentfield','parenttype','idx','creation','modified','modified_by','__islocal','__deleted','__newname','__modified'];var fl=['doctype','name','docstatus','owner','parent','parentfield','parenttype','idx','creation','modified','modified_by','__islocal','__deleted','__newname','__modified'];for(key in fields[o.doctype]){if((!in_list(fl,key))&&(!in_list(no_value_fields,fields[o.doctype][key].fieldtype))){fl[fl.length]=key;tfl[tfl.length]=key.replace(/'/g,"\\'").replace(/\n/g,"\\n");}}
flx[o.doctype]=fl;kl[o.doctype]="['"+tfl.join("', '")+"']";}
var nl=[];var fl=flx[o.doctype];for(var j=0;j<fl.length;j++){var v=o[fl[j]];if(v==null)
v=NULL_CHAR;if(typeof(v)==typeof(1)){nl[nl.length]=v+'';}else{v=v+'';nl[nl.length]="'"+v.replace(/'/g,"\\'").replace(/\n/g,"\\n")+"'";}}
vl[vl.length]='['+nl.join(', ')+']';}
var sk=[];var kls=[];for(key in kl)kls[kls.length]="'"+key+"':"+kl[key];var kls='{'+kls.join(',')+'}';var vl='['+vl.join(',')+']';return"{'_vl':"+vl+",'_kl':"+kls+"}";}
function expand_doclist(docs){var l=[];for(var i=0;i<docs._vl.length;i++)
l[l.length]=zip(docs._kl[docs._vl[i][0]],docs._vl[i]);return l;}
function zip(k,v){var obj={};for(var i=0;i<k.length;i++){obj[k[i]]=v[i];}
return obj;}
var profile;var page_body;var session={};var is_testing=false;var user;var user_defaults;var user_roles;var user_fullname;var user_email;var user_img={};var pscript={};var select_register=[];var selector;function startup(){var setup_globals=function(r){profile=r.profile;user=r.profile.name;user_fullname=profile.first_name+(r.profile.last_name?(' '+r.profile.last_name):'');user_defaults=profile.defaults;user_roles=profile.roles;user_email=profile.email;profile.start_items=r.start_items;sys_defaults=r.sysdefaults;}
var setup_history=function(r){rename_observers.push(nav_obj);}
var callback=function(r,rt){if(r.exc)msgprint(r.ext);setup_globals(r);setup_history(r);page_body=new Body();for(var i=0;i<startup_list.length;i++){startup_list[i]();}
$dh('startup_div');$ds('body_div');}
$c('startup',{},callback,null,1);}
window.onload=startup;