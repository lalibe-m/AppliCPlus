// JavaScript Document
function bddinit() {
	var langue_prete=new Array("fr","en","nl");
	if(langue_prete.inArray(langencours) && langencours!='fr') {
		var url_contenu="http://photo/contenu_5_0_"+langencours+".html";
		//var url_bind="http://photos/bind_5_0_"+langencours+".html";
		//url_map="http://photos/map_5_0_"+langencours+".json";
		if(retournePage()=="index") {
			window.location.href='index_'+langencours+'.html'; 
			return;
		}
	} else {
		var url_contenu="http://photos/contenu_5_0.html";
		//var url_bind="http://photos/bind_5_0.html";
		//url_map="http://photos/map_5_0.json";
	}
    
    // home_rss
	home_art=new Array("cat19","5");
	//
    
    sessionStorage.clear();
	if( !isConnected() && (!localStorage.getItem("bind") || !localStorage.getItem("contenu")) ) {
			alertenoconnexion()
			if(window.location.hash!='home') {
				window.location.hash='home';
			}
	}else if(!isConnected() && localStorage.getItem("bind") && localStorage.getItem("contenu")) {
		eval(localStorage.getItem("contenu"));
		eval(localStorage.getItem("bind"));	
		ouvreDatabase();	
	} else {
		$.blockUI({ message: '<h1>'+lang[langencours][2]+'</h1><img src="Framework/images/loader.gif"/>'});
		$.ajax({
			  url: url_contenu,
			  cache : false,
			  success: function(data) {
			   eval(data);
               localStorage.setItem("contenu",data);
				$.ajax({
				  url: url_bind,
				  cache : false,
				  success: function(data) {
						localStorage.setItem("bind",data);
						eval(data);
						$.unblockUI();
						ouvreDatabase();
                       /* Flux Rss
                        
                        if(langencours=='fr' || langencours=='en') {
						getRss(3,'http://www.suresnes.fr/rss/feed/Agenda', true, "#cat30", true);
                        getRss(5,'http://www.suresnes.fr/rss/feed/Agenda', true, "#contentrss", false);
						}
                       /*
                        */
						//home_article("cat19","5");
						
						
					},
				  error : alertenoconnexion
				});
			  },
			  error : alertenoconnexion
			});
	}
}

function alertenoconnexion() {
	if(navigator.notification!=undefined)
		navigator.notification.alert(lang[langencours][1]);
	else
		alert(lang[langencours][1]);
	$.unblockUI();
}


