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
