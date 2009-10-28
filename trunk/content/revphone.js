var xrequest = new XMLHttpRequest();
var selection = '';
var trans = '';
var last_selection = '';
var url = '';

function setRPLabel(label) {
	document.getElementById("revphone_panel").setAttribute('label', 'Revphone ' + label);
}

function trim(str) {
    var x = str;
    x = x.replace(/^\s*(.*)/, "$1");
    x = x.replace(/(.*?)\s*$/, "$1");
    return x;
}

function LOG(msg) {
  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                 .getService(Components.interfaces.nsIConsoleService);
  consoleService.logStringMessage('RP ' + msg);
}

function connect() {
	var popupnode = document.popupNode;
	var nodeLocalName = popupnode.localName.toLowerCase();

	if ((nodeLocalName == "textarea") || (nodeLocalName == "input" && popupnode.type == "text")) {
		selection = trim(popupnode.value.substring(popupnode.selectionStart, popupnode.selectionEnd));
	} else if (nodeLocalName == "img") {
        if (popupnode.title)
            selection = popupnode.title;
        else if (popupnode.alt)
            selection = popupnode.alt;
        else
    	   selection = '';
	}else {
        var focusedWindow = document.commandDispatcher.focusedWindow;
        selection = trim(focusedWindow.getSelection().toString());
	}
	LOG('connect: selection=' + selection);
	
    if (selection != '') {
        if (selection != last_selection) {
            document.getElementById("revphone_main:result").setAttribute('label', 'Connexion à Infobel');    
            url = 'http://www.infobel.com/fr/france/Inverse.aspx?qphone=' + selection;
            
			LOG(url + '...');
            
            xrequest.onload = parseContent;
            xrequest.onerror = function () {  
				
                LOG('connect: Echec de la connexion !'); 
                document.getElementById("revphone_main:result").setAttribute('label', connecterror);
            };
                       
            xrequest.open("GET", url, true);
            xrequest.send(null);
     	}else{
			updateMenu();
			LOG('connect: no changes'); 
        }
    }
}

function parseContent() {
	LOG('parseContent: selection=' + selection); 

    last_selection = selection;	
    
    var result = xrequest.responseText;
	// LOG('parseContent: result=' + result); 

	// <div class="result-item"><h2>1. <a href="XXX">WHO</a><!-- XXX --></h2><div class="result-box"><div class="result-box-col"><div><strong>WHERE</strong>
    var reg = new RegExp('<div class="result-item"><h2>[^<>]*<a[^>]*>([^<>]*)<\\/a><!--[^<>]*><\\/h2>[^<>]*<div class="result-box"><div class="result-box-col"><div><strong>([^<>]*)<\\/strong>');
	
	var str = new String(result);
	var matches = str.match(reg);
	LOG('parseContent: matches=' + matches); 
	if (matches != null) {
		trans = matches[1] + " : " + matches[2];
	} else {
		trans = "";
	}
	
	updateMenu();
	selection = '';
}

function updateMenu() {
	LOG('updateMenu: trans=' + trans); 
	if (trans == "" || trans == selection) {
		document.getElementById("revphone_main:result").setAttribute('label', 'Pas de correspondance pour "' + selection + '"');
	}else {
		document.getElementById("revphone_main:result").setAttribute('label', trans);
		document.getElementById("revphone_main:result").setAttribute('disabled', false);           						  	            
	}
}