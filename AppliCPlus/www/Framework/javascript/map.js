// Framework V5.0.0
var distancemaximum=new Array();
var n=new Array();
var total=new Array();
var abouger=0;
var watchId="";
var provenance="";

// Cr�e ou ouvre la Base de donn�e Sqlite
// Initialise l'application (fond d'�cran, google Analytics..)
function ouvreDatabase(isaffichecontenu) {
    try {
	if (!window.openDatabase) {
	    alert(lang[langencours][3]);
	} else {
	    var shortName = 'BlueAppsDB';
	    var version = '1.0';
	    var displayName = 'BlueAppsDB';
	    if (isAndroid()) {
			var maxSize = 10 * 1024 * 1024; // in bytes
		} else {
			var maxSize = 3 * 1024 * 1024; // in bytes
		}
		BlueAppsDB = openDatabase(shortName, version, displayName, maxSize);
	    
		//Au lancement de l'appplication
		if(!sessionStorage.getItem("premierlancement")) {
			sessionStorage.setItem("premierlancement",1)
			
			//date de lancement
			localStorage.setItem("datecachelancement",Math.round((new Date()).getTime()/1000));
			
			//nb de lancement de l'application -> vote application pour IOS / android
			if( ( (isIos() && url_appstore!='') || (isAndroid()) && url_googleplay!='') && !localStorage.getItem("noVotez")) { 
				if (!localStorage.getItem("compteurVotez")) {
					localStorage.setItem("compteurVotez",1);	
				} else {
					var compteurVotez=parseInt(localStorage.getItem("compteurVotez"));
					localStorage.setItem("compteurVotez", compteurVotez + 1);	
					if(localStorage.getItem("compteurVotez")>nbvoter) {
						navigator.notification.confirm(
							lang[langencours][32],  // message
							ConfirmNoteCallback,         // callback
							lang[langencours][31],            // title
							lang[langencours][35]+","+lang[langencours][34]+","+lang[langencours][33]                  // buttonName
						);
						localStorage.setItem("compteurVotez",0);	
					}
				}
			}
		
		
			if(isConnected()) {
				//image de fond	
				if(typeof(image_fond)!="undefined" && image_fond!='') {
					$('#home').css('background-image',"url("+image_fond+")");	
				}
				//image des cat�gories
				if(typeof(image_categorie)!="undefined" && image_categorie!='') {
					$(".categorie").each(function(index) {
						$(this).css('background-image',"url("+image_categorie+")");	;
					});
				}
				//image du liste article
				if(typeof(image_detail)!="undefined" && image_detail!='') {
					$(".detail").each(function(index) {
							  var arbotemp=($(this).attr("id"));
							  var idsimpleproduittemp=id_simple_produit[arbotemp];
							  if(idsimpleproduittemp==undefined) {
								  idsimpleproduittemp="";
							  } 
							  if(idsimpleproduittemp!='') {
								  if(typeof(image_detail_article)!="undefined" && image_detail_article!='') 
								  	$("#"+arbotemp).css('background-image',"url("+image_detail_article+")");
							  } else {
								  $(this).css('background-image',"url("+image_detail+")");
							  }
					});
				}
				//image du d�tail article
				if(typeof(image_detail_article)!="undefined" && image_detail_article!='') {
					$("#detailpoi").css('background-image',"url("+image_detail_article+")");
				}			
			}
			if(typeof(option_favoris)!='undefined' && option_favoris==1) {
				BlueAppsDB.transaction(function (transaction) {
					transaction.executeSql('CREATE TABLE IF NOT EXISTS catfavoris (id,arborescence, titre, categorie,date_debut,date_fin, latitude, longitude,distance, contenu, urlminiature,urlphoto,contenu_agenda,heure_debut,heure_fin,adresse_agenda,position INTEGER,visible INTEGER, PRIMARY KEY (id, arborescence));', [], nullDataHandler, errorHandler);
				},errorHandler,function() { });
				gestion_favoris();
			}
			
			//google analytics
			if(typeof(google_analytics_ua)!="undefined" && typeof(device) != "undefined") {
				if (isIos()) {
					googleAnalytics = window.plugins.googleAnalyticsPlugin;
					googleAnalytics.startTrackerWithAccountID(google_analytics_ua);
				} else if (isAndroid()) {
					googleAnalytics = 1;
					window.plugins.analytics.start(google_analytics_ua, function(){}, function(){});
				}
			}
			
			// Initialise le menu
			initmenu();
			
			// poopup html
			if(typeof(popuphtml)!='undefined' && popuphtml==1 ) {
				// increase the default animation speed to exaggerate the effect
				$.fx.speeds._default = 1000;
				$( "#popupaccueil" ).dialog({
					autoOpen: false,
					zIndex: 6999,
					width: '98%',
					modal: true,
					title: titrepopuphtml,
					buttons: {
						"OK": function() {
							$( this ).dialog( "close" );
						}
					}
				});
				$( "#popupaccueil" ).dialog( "open" );
			}

		}
		
	    //Appele la fonction de remplissage de la base de donn�e.
	    prePopulate(isaffichecontenu);
	}
    } catch(e) {
	if (e == 2) {
	    // Version mismatch.
	    console.log("Invalid database version.");
	} else {
	    console.log("Unknown error "+ e +".");
	}
	return;
    } 
}

// Rempli la base de donn�e
function prePopulate(isaffichecontenu){
	$.ajax({
	  url: url_map,
	  cache : false,
	  success: function(data) {
			datasetting=$.parseJSON(data);
			nbmap=datasetting.items.length;
			maptraite=0;
			$.each( datasetting.items, function(j, setting) {
				if(setting.date_maj != 0 && (!localStorage.getItem("datecache_"+setting.Arboname) || localStorage.getItem("datecache_"+setting.Arboname)!=setting.date_maj)) {
					if(typeof(admin)!='undefined') {
						var chainetemp=setting.url
						setting.url=chainetemp.replace(".json", "_admin.json");
					}
					$.ajax({
					  url: setting.url,
					  cache:false,
					  success: function(datajson) {
						BlueAppsDB.transaction(function (transaction) {
						    $.blockUI({ message: '<h1>' + lang[langencours][4] + '</h1><div id="progressBar"><div id="progressIndicator" style="width:' + eval(Math.round((maptraite * 100) / nbmap) / (100/235)) + 'px;"></div></div><p style="position:relative;bottom:25px;color:black">' + eval(Math.round((maptraite * 100) / nbmap)) + '%</p><img src="Framework/images/loader.gif"/>'});
                            //console.log("remplissage "+setting.Arboname);
							data = $.parseJSON(datajson);
							$.each( data, function(i, marker) {
								if(i==0) {
									transaction.executeSql('DROP TABLE IF  EXISTS '+setting.Arboname+';', [], nullDataHandler, errorHandler);
									transaction.executeSql('CREATE TABLE IF NOT EXISTS '+setting.Arboname+' (id PRIMARY KEY , titre,titre_no, categorie,date_debut,date_fin, latitude, longitude,distance, contenu, urlminiature,urlphoto,contenu_agenda,heure_debut,heure_fin,adresse_agenda,position INTEGER);', [], nullDataHandler, errorHandler);
									
									
									if(typeof(option_favoris)!='undefined' && option_favoris==1) {
										//On met � z�ro les favoris de cette cat�gorie
										transaction.executeSql("UPDATE catfavoris SET visible=0  where arborescence='"+setting.Arboname+"' ", [],[],errorHandler);
									}
								}
								transaction.executeSql("INSERT INTO "+setting.Arboname+" (id , titre,titre_no, categorie,date_debut,date_fin, latitude, longitude, contenu, urlminiature,urlphoto,contenu_agenda,heure_debut,heure_fin,adresse_agenda,position) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)", [marker.id, marker.titre,AccentToNoAccent(marker.titre), marker.categorie,marker.date_debut,marker.date_fin, marker.latitude, marker.longitude, marker.contenu, marker.urlminiature,marker.photos,marker.contenu_agenda,marker.heure_debut,marker.heure_fin,marker.adresse_agenda,marker.position]);
								if(typeof(option_favoris)!='undefined' && option_favoris==1) {
									//on remet � 1 les favoris encore disponible et on met le poi � jour
									transaction.executeSql("UPDATE catfavoris SET visible=1,titre=?,categorie=?,date_debut=?,date_fin=?,latitude=?,longitude=?, contenu=?, urlminiature=?,urlphoto=?,contenu_agenda=?,heure_debut=?,heure_fin=?,adresse_agenda=?,position=? WHERE id = '"+marker.id+"' and arborescence='"+setting.Arboname+"' ", [marker.titre,marker.categorie,marker.date_debut,marker.date_fin, marker.latitude, marker.longitude, marker.contenu, marker.urlminiature,marker.photos,marker.contenu_agenda,marker.heure_debut,marker.heure_fin,marker.adresse_agenda,marker.position],[],errorHandler);
								}

							});
						},errorHandler,function() { 
							//console.log("fin remplissage"+setting.Arboname); 
							maptraite+=1;
							if(maptraite>=nbmap) {
								$.unblockUI();
								if(typeof(home_art)!='undefined') {
									home_article(home_art[0],home_art[1]);	
								}
								if(isaffichecontenu!=undefined) {
									affichecontenu(); 
								}
							}
							localStorage.setItem("datecache_"+setting.Arboname,setting.date_maj);
						}
						);
					  },
					  error: function () {}
					});
				} else {
					maptraite+=1;
					if(maptraite>=nbmap) {
						$.unblockUI();	
						if(typeof(home_art)!='undefined') {
							home_article(home_art[0],home_art[1]);	
						}
						if(isaffichecontenu!=undefined) {
							affichecontenu(); 
						}
						
					}
				}
			});
			
	  },
	  error: function () {}
	});	
	
	if(!isConnected()) {
		if(typeof(home_art)!='undefined') {
			home_article(home_art[0],home_art[1]);	
		}
	}
}


// Fonction d'initialisation quand on rentre dans une cat�gorie
function initdistance(arbo) {	
	//console.log("initdistance"+arbo);
	//Hit google analytics
	if(typeof(googleAnalytics)!="undefined") {
		if (isIos()) {
			googleAnalytics.trackPageview("/"+arbo);
		} else if (isAndroid()) {
			window.plugins.analytics.trackPageView("/"+arbo,function(){}, function(){});
		}
	}
		
	//on v�rifie que ca ne fait pas plus de 24H que l'appli est lanc�
	if(parseFloat(localStorage.getItem("datecachelancement")) + (60*60*24)<=Math.round((new Date()).getTime()/1000)) {
		window.location='index.html';
	}
	
	//initialisation Variable Glogale 
	idsimpleproduit=id_simple_produit[arbo];
	if(idsimpleproduit==undefined) {
		idsimpleproduit="";
	}
	arborescence=arbo;
	
	
	// Init menu R�alit� Augment�
	if(isCarte(arborescence)) {
		if (isIos()) {
			$(".ar_activate").remove();
			$('#'+arborescence+' nav').append("<a href='#' class='ar_activate' onclick=\"launchARPlugin('"+arborescence+"')\"><strong>"+lang[langencours][26]+"</strong></a>");
		} else if (isAndroid()) {
			$(".ar_activate").remove();
			$('#'+arborescence+' nav').append("<a href='#' class='ar_activate' onclick=\"launchARPlugin('"+arborescence+"')\"><strong>"+lang[langencours][26]+"</strong></a>");
		}
	}

	
	// Si on ne revient pas d'un d�tail POI on init la base de donn�e
	if(provenance=='detailPoi' && arborescence=="catfavoris") {
		afficheliste();
	}

	
	if(provenance!='detailPoi') {
		latitude=longitude=urlkml="";
		ouvreDatabase();
		if(isCarte(arbo)) {
			$("nav").css({display: 'block'});
			if (isAndroid()) {
                navigator.geolocation.getCurrentPosition(calculDistance,initModuleMap, {timeout:10000});
			} else {
                navigator.geolocation.getCurrentPosition(calculDistance,initModuleMap);
			}
		} else {
            //no phone inside
            if(typeof(no_phone_inside)!="undefined")
                noPhoneInside();
			$("nav").css({display: 'none'});
			showListe(arbo);
			initModuleMap();
		}
	} else {
		$.unblockUI();
		provenance='';
	}
}

// Si on est g�olocalis� on calcule la distance entre la position et les POI
function calculDistance(position) {
	//console.log("calculdistance"+arborescence);
	//no phone inside
    if(typeof(no_phone_inside)!="undefined")
        noPhoneInside();
    
    if(watchId!='') {
		$.unblockUI();
	}
	urlkml=url_kml[arborescence];
	if(urlkml==undefined) {
		urlkml="";
	}
	latitude=position.coords.latitude;
	longitude=position.coords.longitude;

	if(!sessionStorage.getItem("latitude["+arborescence+"]") || arborescence=="catfavoris")
		var d=99999;
	else {
		d=distance(sessionStorage.getItem("latitude["+arborescence+"]"),sessionStorage.getItem("longitude["+arborescence+"]"),latitude,longitude);
	}
	
	//on met � jour notre position sur la carte
	if(sessionStorage.getItem("charger["+arborescence+"]")) {
			var ctferme=afficheCarte();
			$.each($('#map_canvas'+arborescence).gmap('get', 'markers'), function(i, marker) {
				if(marker.tags=='domicile') {
					marker.setMap(null);
				}
			});
			addmaPosition();
			if(ctferme==1) {
				$('#contentMap'+arborescence).css({display: 'none'});
			}
	}
	
	if(typeof(ouvreId)!='undefined' && sessionStorage.getItem("charger["+arborescence+"]")) {
		selectid(ouvreId);
		delete ouvreId;
	}
	
	// Si la distance par rapport � notre deni�re position est de plus de 0.5 km on remet � jour les distances
	if(d>0.5) {
		sessionStorage.setItem("latitude["+arborescence+"]",latitude);
		sessionStorage.setItem("longitude["+arborescence+"]",longitude);

		$.blockUI({ message: '<h1>'+lang[langencours][25]+'</h1><img src="Framework/images/loader.gif"/>'});
		if(sessionStorage.getItem("charger["+arborescence+"]")) {
			abouger=1;
			//$.unblockUI();
			//afficheliste();
		}
        sql="select * from "+arborescence+" ";
		BlueAppsDB.transaction(
			function(transaction) {
				transaction.executeSql(sql, [],function(transaction, results) {
					for (var i=0; i<results.rows.length; i++) {
						var row = results.rows.item(i);
						if(isNumber(row['latitude']) && isNumber(row['longitude'])) {
							var dist=distance(parseFloat(row['latitude']),parseFloat(row['longitude']),latitude,longitude);
							transaction.executeSql("UPDATE "+arborescence+" SET distance=? WHERE id = '"+row['id']+"'", [dist],[],errorHandler);
						}
					}
					initModuleMap();
				 },errorHandler);
			}
		);
	}else if(arborescence=="catfavoris" || ( !sessionStorage.getItem("charger["+arborescence+"]") || $('#contentRecherche'+arborescence).html()=='')) {
		initModuleMap();
	}

}

//On initialise la carte et la liste
function initModuleMap(error) {
	var requete = "SELECT * FROM "+arborescence+"";
	if(isAgenda(arborescence)) {
		requete+=" where date_fin>='"+datemaintenant()+"'";
	}
	if(urlkml!='' || !isCarte(arborescence) ) {
		requete+=" order by position";
	} else
		requete += " order by categorie asc";
	//console.log(requete);
	BlueAppsDB.transaction(
	    function (transaction) {
			transaction.executeSql(requete, [], dataInitModuleMap, errorHandler);
	    }
	);
}

// Function de callback de la fonction initModuleMap
// Initialise le moteur de recherche et la carte google maps
function dataInitModuleMap(transaction, results){
	if(arborescence!="catfavoris") {
		/* Affichage du moteur de recherche */
		var listecategorie=new Array();
		listepuce=new Array();
		var distancemin=99999;
		var distancemax=0;
		var j=0;
		for (var i=0; i<results.rows.length; i++) {
			var row = results.rows.item(i);
			if(parseFloat(row['distance'])<distancemin)
				distancemin=row['distance'];
			if(parseFloat(row['distance'])>distancemax)
				distancemax=row['distance'];
		
				if(!listecategorie.inArray(row['categorie'])) {
					listecategorie.push(row['categorie']);
					listepuce[row['categorie']]='pin'+j+'.png';
					j++;
				}
		}
		urlkml=url_kml[arborescence];
		if(urlkml==undefined) {
			urlkml="";
		}
	
		distancemin = (Math.round(distancemin*10)/10);
		distancemax=Math.round(distancemax)+1;
		distancemaximum[arborescence]=distancemax;
	
		//recherche
		var bouton= '<ul class="rounded Input"><li><div id="detailrecherche'+arborescence+'"></div><a href="#" onclick="showFiltre(\''+arborescence+'\');return false" class="whiteButton" style="width:auto; margin:10px 14px 5px 14px; line-height:10px">'+lang[langencours][27]+'</a><div id="boutonannuler'+arborescence+'"></div></li></ul>';
		
		var recherche=bouton + '<ul class="rounded Input"><li><span class="graytitle">'+lang[langencours][5]+' : </span><input placeholder="'+lang[langencours][10]+'" id="recherche'+arborescence+'" type="text" style="text-align: right;width:50%; margin: auto;float:right"></li></ul>';
		if(latitude!="" && longitude!="") {
			recherche+='<ul class="rounded Input" id="sliderdistance'+arborescence+'"><li><span class="graytitle">'+lang[langencours][6]+' : <span id="distancechoisi'+arborescence+'">'+distancemax +'</span> km</span><div id="slider-wrapper" style="margin:10px;padding-left:20px;padding-right: 20px;"><div style="height:10px;" id="slider-range'+arborescence+'"></div></li></div></li></ul>';
		}
		if (listecategorie.length > 1 ) {
			recherche+='<ul class="rounded Input" id="contentCategorie'+arborescence+'"><li><span class="graytitle">'+lang[langencours][7]+' :</span></li><span id="innerSearchSubmit'+arborescence+'"></span></ul>';
		}
		if(isAgenda(arborescence)) {
			recherche+='<ul class="rounded Input" id="rechercheAgenda'+arborescence+'">';
			recherche+='<li style="height:45px;"><a href="" onclick="calendrier_depart(\''+arborescence+'\');return false">'+lang[langencours][15]+' <span id="recherchevdatedebut'+arborescence+'"></span></a><input value="" style="visibility:hidden;" id="recherchedatedebut'+arborescence+'" name="recherchedatedebut'+arborescence+'"type="text">';
			recherche+='</li>';
			recherche+='<li style="height:45px;"><a href="" onclick="calendrier_fin(\''+arborescence+'\');return false">'+lang[langencours][16]+' <span id="recherchevdatefin'+arborescence+'"></span></a><input value="" style="visibility:hidden;" id="recherchedatefin'+arborescence+'" name="recherchedatefin'+arborescence+'" type="text">';
			recherche+='</li></ul>';	
			
		}
	
		if($('#contentRecherche'+arborescence).html()=='') {
			$('#contentRecherche'+arborescence).html(recherche);
			if(isAgenda(arborescence)) {
				$( "#recherchedatedebut"+arborescence).datepicker({
					minDate: "+0", 
					dateFormat : 'dd-mm-yy',
					regional : 'fr',
					onSelect: function(dateText, inst) { 
						if(dateText!='') {
							$("#recherchevdatedebut"+arborescence).html(dateText);
						}
					}

				});
			
			
				$( "#recherchedatefin"+arborescence).datepicker({
					minDate: "+0", 
					dateFormat : 'dd-mm-yy',
					regional : 'fr',
					onSelect: function(dateText, inst) { 
						if(dateText!='') {
							$("#recherchevdatefin"+arborescence).html(dateText);
						}
					}

				});

			
			
			
			}
	
			$.each(listecategorie, function(i, tag) {
				$('#innerSearchSubmit'+arborescence).append(('<li style="font-size: 16px;font-weight:normal;line-height:30px"><img src="Framework/images/maps/'+ listepuce[tag]+'" width=49px height="39px" class="puce"/>'+tag+'<span class="multipleChoice"><input type="checkbox" value="'+tag+'" /></span></li>'));
			});
		}
	
		if(abouger==1) {
			$('#distancechoisi'+arborescence).html(''+distancemaximum[arborescence]);
			$('#slider-range'+arborescence).slider({ value: distancemaximum[arborescence] });
			abouger=0;
		}
	
		if(latitude!="" && longitude!="") {
			$( "#slider-range"+arborescence).slider({
				min: distancemin,
				max: distancemax,
				step: 0.1,
				value: distancemax,
				slide: function( event, ui ) {
					$("#distancechoisi"+arborescence).html(ui.value);
				}
			});
		}
	} 

	if(isCarte(arborescence)) {
	    if((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPod/i)) ||(navigator.userAgent.match(/android/i)) ){
            if (isIos()) {
                $('#map_canvas'+arborescence).height(window.innerHeight-93);
            } else if (isAndroid()) {
                $('#map_canvas'+arborescence).height(window.innerHeight-93);
            } else {
                $('#map_canvas'+arborescence).height(window.innerHeight-93);
            }
        } else {
            $('#map_canvas'+arborescence).height(window.innerHeight-43);
        }

		//Initialistion de googlemap et affichage de la carte
		$('#map_canvas'+arborescence).gmap().bind('init', function(evt, map) {
			google.maps.event.addListener(map, "zoom_changed", function() {
				if (map.getZoom() < 3) map.setZoom(3);
				if (map.getZoom() > 20) map.setZoom(20);
			});

			if(urlkml!='') {
				$('#map_canvas'+arborescence).gmap('loadKML', 'dog_feed_2', urlkml);
			}

			$.each( results.rows, function(i, marker) {
				var row = results.rows.item(i);

				var description='<a href="#" onclick="selectid(\'' + row['id'] + '\');return false">';
				if(row['urlminiature']!='' && row['urlminiature']!=null) {
					description+='<img style="width:90px;height:90px;margin:0px; padding:0px;float:left;" src="'+urlwebapp + row['urlminiature'] + '" /><div class="lieninfowindow">' + row['titre'] + '</div></a>';
				}  else {
					description+='<div class="lieninfowindow" style="width:98%">' + row['titre'] + '</div></a>';
				}
				if(arborescence=="catfavoris") {
					var image='Framework/images/maps/pin1.png';
				}� else {
					if(urlkml!='')
						var image='Framework/images/maps/numbers/'+ (i+1) +'.png';
					else
						var image='Framework/images/maps/'+listepuce[row['categorie']];
				}
				
				temp = [];
				temp.push(row['categorie']);
				temp2 = [];
				temp2.push(row['id']);

				if(row['latitude']!='' && row['longitude']!='' && isNumber(row['latitude']) && isNumber(row['longitude']) ) {
					$('#map_canvas'+arborescence).gmap('addMarker', {
						'tags': temp,
						'ida': temp2,
						'position': new google.maps.LatLng(row['latitude'], row['longitude']),
						'bounds': true,
						'icon' : image
					}).click(function() {
						$('#map_canvas'+arborescence).gmap('openInfoWindow', { 'content': description }, this);
					});
				}
			});
			addmaPosition();
			$.unblockUI();
			sessionStorage.setItem("charger["+arborescence+"]",1);

			afficheliste();
			if (isAgenda(arborescence) || isListeFirst(arborescence)) {
				showListe(arborescence);
			}
		});
		if(arborescence=="catfavoris")
			afficheliste();
	} else {
		afficheliste();
	}
}

// Affiche ma position sur la carte
function addmaPosition() {
	if(latitude!='' && longitude!='') {
			if( (urlkml=='' && distancemaximum[arborescence]<=50) || (urlkml!='' && watchId!='')) {
				temp=[];
				temp.push('domicile');
				var image='Framework/images/maps/bullet_ball_glass_blue.png';
				$('#map_canvas'+arborescence).gmap('addMarker', { 
					'tags' : 'domicile',
					'position': new google.maps.LatLng(latitude, longitude), 
					'bounds': true,
					'icon' : image 
				}).click(function() {
					$('#map_canvas'+arborescence).gmap('openInfoWindow', { 'content': lang[langencours][8] }, this);
				});
			}
	}
}

//Affiche/masque la popup moteur de recherche
function showFiltre(arbo) {
	if($('#rechercheWrapper'+arbo).css('display')=='block') {
		if (isAndroid())
		$("#fakeToolbar #boutonfiltrer"+arborescence).css('background-image','-webkit-linear-gradient(top, #6b89b2, #50709a 50%, #476489 51%, #3e5779)');
		$('#rechercheWrapper'+arbo).css({display: 'none'});
		$('#contentListe'+arbo).css({display: 'block'});
		if(isCarte(arbo)) {
			$("#"+arbo+" a.map").removeClass("activer");
			$("#"+arbo+" a.liste").addClass("activer");
			$("nav").css({display: ''});
		}
		if(isIos()) {
			$(".back").css({display: ''});
			$(".menu").css({display: ''});
		 }
		
		n[arbo]=0;
		afficheliste();
	} else {
        $('#contentListe'+arbo).css({display: 'none'});
        $('#contentMap'+arbo).css({display: 'none'});
        window.scrollTo(0, 0.9);
        $('#rechercheWrapper'+arbo).css({display: 'block'}); 
        $("nav").css({display: 'none'});
		 if(isIos()) {
			$(".back").css({display: 'none'});
			$(".menu").css({display: 'none'});
		 }
	}
}

// Affiche la liste de POI
function showListe(arbo) {
	$('#contentMap'+arbo).css({display: 'none'});
	$('#contentListe'+arbo).css({display: ''});
    $("#"+arbo+" a.map").removeClass("activer");
	$("#"+arbo+" a.liste").addClass("activer");
}

// Affiche la carte
function showMap(arbo) {
	$('#contentListe'+arbo).css({display: 'none'});
	$('#contentMap'+arbo).css({display: ''});  
   	$("#"+arbo+" a.liste").removeClass("activer");
    $("#"+arbo+" a.map").addClass("activer");
	$('#map_canvas'+arbo).gmap('refresh');
}

// Lance Le plugin de r�aliste augment�
function launchARPlugin()
{
    if(isAndroid()) {
    	afficheliste(1);
    }
    else if(isIos()) {
   	 	afficheliste(2);
    }
}

//Annulation d'une recherche
function annuleFiltre(arbo) {
	$('#recherche'+arbo).val('');
	$('#contentCategorie'+arbo+' input:checkbox').attr('checked', false);
	$('#distancechoisi'+arbo).html(''+distancemaximum[arbo]);
	$('#slider-range'+arbo).slider({ value: distancemaximum[arbo] });
	if(isAgenda(arbo)) {
		$("#recherchevdatedebut"+arbo).html('');
		$("#recherchevdatefin"+arbo).html('');
	}
	
	$("#boutonannuler"+arborescence).html('');
	$("#boutonfiltrer"+arborescence).css('background-image', 'none');
	showFiltre(arbo);
	if (isAndroid()) {
        $("#fakeToolbar #boutonfiltrer"+arbo).css('background-image','none');
    }
	if(isCarte(arbo)) {
		var ctferme=afficheCarte();
		$.each($('#map_canvas'+arbo).gmap('get', 'markers'), function(i, marker) {
			$('#map_canvas'+arbo).gmap('addBounds', marker.position);
			marker.setVisible(true); 
		});	
		if(ctferme==1) {
			$('#contentMap'+arbo).css({display: 'none'});
		}
	}
}

// zoom sur un circuit
function Circuitzoom(arbo) {
	if(watchId!="") {
		navigator.geolocation.clearWatch(watchId);
		$("#"+arbo+" a.position").removeClass("activer");
		watchId='';
		var ctferme=afficheCarte();
		$('#map_canvas'+arborescence).gmap('set', 'bounds', null);
		$.each($('#map_canvas'+arborescence).gmap('get', 'markers'), function(i, marker) {
			marker.setVisible(false); 
			if(marker.tags!='domicile') {
				$('#map_canvas'+arborescence).gmap('addBounds', marker.position);
				marker.setVisible(true); 
			}
		});
		if(ctferme==1) {
			$('#contentMap'+arborescence).css({display: 'none'});
		}	
	} else {
    	$.blockUI({ message: '<h1>'+lang[langencours][2]+'</h1><img src="Framework/images/loader.gif"/>'});
		$("#"+arbo+" a.position").addClass("activer");
		watchId = navigator.geolocation.watchPosition(calculDistance,null,{enableHighAccuracy:true,maximumAge: 60000});
	}
}

// G�n�re la liste des POI 
function afficheliste(flag){
    if(idsimpleproduit!='' && typeof(flag) == "undefined") {
		selectid('SYNC'+idsimpleproduit);
	} else {
		$.blockUI({ message: '<h1>'+lang[langencours][2]+'</h1><img src="Framework/images/loader.gif"/>'});
		var requete = "SELECT * FROM "+arborescence+" where 1=1 ";
		var requetetotal = "select count(id) as total from "+arborescence+" where 1=1 ";
		var addfiltre= "";
		if (n[arborescence]==undefined || n[arborescence] < 0) {
			n[arborescence] = 0;
		}

		if(arborescence!="catfavoris") {

			$("#detailrecherche"+arborescence).html('');
			//on construit la requete en fonction du filtre de recherche
			//distance
			if($("#distancechoisi"+arborescence).html()!='' && $("#distancechoisi"+arborescence).html()!=null && $("#distancechoisi"+arborescence).html()!=distancemaximum[arborescence] && $("#distancechoisi"+arborescence).html()!=undefined) {
				addfiltre+=' and distance <='+$("#distancechoisi"+arborescence).html();
				$("#detailrecherche"+arborescence).append('<li> '+lang[langencours][9]+' '+$("#distancechoisi"+arborescence).html()+' km</li>')
			}
			//categorie
			var filters = [];
			var chainefiltre="";
			$('#contentCategorie'+arborescence+' input:checkbox:checked').each(function(i, checkbox) {
				filters.push($(checkbox).val());
				chainefiltre +="'" + $(checkbox).val() + "',";
			});
			if ( filters.length > 0 ) {
				addfiltre +=" and categorie in ("+chainefiltre.substring(0, chainefiltre.length-1)+")";
				$("#detailrecherche"+arborescence).append('<li> - '+lang[langencours][7]+' : '+chainefiltre.substring(0, chainefiltre.length-1)+'</li>')
			}
			//texte
			if($('#recherche'+arborescence).val()!='') {
				addfiltre +=" and  titre_no like '%"+AccentToNoAccent($('#recherche'+arborescence).val()) +"%' ";
				$("#detailrecherche"+arborescence).append('<li> - '+lang[langencours][10]+' : '+$('#recherche'+arborescence).val()+'</li>')
			}
			
			//date
			if(isAgenda(arborescence)) {
				if($("#recherchevdatedebut"+arborescence).html()!='') {
					addfiltre +=" and date_fin >='"+dateengfr($("#recherchevdatedebut"+arborescence).html())+"'";
					$("#detailrecherche"+arborescence).append('<li> - '+lang[langencours][15]+' : '+($("#recherchevdatedebut"+arborescence).html())+'</li>')
				}
				if($("#recherchevdatefin"+arborescence).html()!='') {
					addfiltre +=" and date_debut <='"+dateengfr($("#recherchevdatefin"+arborescence).html())+"'";
					$("#detailrecherche"+arborescence).append('<li> - '+lang[langencours][16]+' : '+($("#recherchevdatefin"+arborescence).html())+'</li>')
				}

			}
	
			if($("#detailrecherche"+arborescence).html()!='') {
				$("#detailrecherche"+arborescence).prepend('<li>'+lang[langencours][11]+' :</li>');
				$("#boutonannuler"+arborescence).html('<a href="#" onclick="annuleFiltre(\''+arborescence+'\');return false" class="redButton" style="width:auto;line-height:7px">'+lang[langencours][12]+'</a>');
				$("#boutonfiltrer"+arborescence).css('background-image','-webkit-linear-gradient(top, #6b89b2, #50709a 50%, #476489 51%, #3e5779)');
			}
		}
		
		
		
		if(isAgenda(arborescence) && $("#recherchevdatedebut"+arborescence).html()=='' && $("#recherchevdatefin"+arborescence).html()=='') {
			addfiltre+=" and date_fin>='"+datemaintenant()+"' order by date_debut asc,heure_debut asc";
		} else if(urlkml!='' || !isCarte(arborescence) ) {
			addfiltre+=" order by position";
		} else {
			addfiltre+=" order by distance";
		}
		var requeteliste=requete+addfiltre+" LIMIT "+n[arborescence]+", 20";  
		var requetemap=requete+addfiltre;
		var requetecomptage=requetetotal+addfiltre;
		//console.log(requeteliste);
		BlueAppsDB.transaction(
			function (transaction) {
				//nb de resultat :
				transaction.executeSql(requetecomptage, [],
					 function(transaction, results) {
						var row = results.rows.item(0);
						//console.log("nb filtre"+row['total']);
						total[arborescence]=row['total'];
					 });
			    if (typeof(flag) == "undefined") {
					transaction.executeSql(requeteliste, [], dataAfficheliste, errorHandler);
					if($("#detailrecherche"+arborescence).html()!='' && n[arborescence]==0 && isCarte(arborescence)) {
						transaction.executeSql(requetemap, [], dataAffichemap, errorHandler);
                    }
			    }
			    else if (flag == 1){
					transaction.executeSql(requetemap, [], getDataFromRequest, errorHandler);
			    }
			    else {
			    	transaction.executeSql(requetemap, [], getDataFromRequestIOS, errorHandler);
			    }
			}
		);
	}
}

//Fonction de callback de Afficheliste
function dataAfficheliste(transaction, results){
	// Liste	
	var temp="<ul class='metal scroll' style='margin-top: 0px;'>";
	if (n[arborescence] != 0 && results.rows.length != 0) {
		temp+="<li class='pagination'><a href=\'#\' onclick=\"getPrevList()\";return false><strong>"+lang[langencours][13]+"</strong></a></li>";
	}
	for (var i=0; i<results.rows.length; i++) {
		var row = results.rows.item(i);
		temp+="<li style='height:90px;margin:0px;padding:0px;'><a href='#' onclick=\"selectid('" + row['id'] + "');return false\">";
		
		if(isConnected()){
			if(row['urlminiature']!='' && row['urlminiature']!=null) {
				temp+='<img style="width:90px;height:90px;margin:0px; padding:0px;float:left;" src="'+urlwebapp + row['urlminiature'] + '" />';
			} 
		}		
		temp+= "<span class='listTitle";
        if(row['urlminiature']!='' && row['urlminiature']!=null) {
			temp+=' withImage';
        }
        temp+="'>";
        if (row['titre'].length > 50 && (isIos() || isAndroid()) ) {
            temp+=row['titre'].substr(0,50)+"...";
        } else {
            temp+=row['titre'];
        }
        temp+="</span>";
			
		if(isAgenda(arborescence)) {
			if (row['date_debut']==row['date_fin']) {
				temp+='<br/><em class="comment"><strong>'+lang[langencours][14]+' '+ dateengfr(row['date_debut']) +'</strong></em>';
			} else {
				temp+='<br/><em class="comment"><strong>'+lang[langencours][15]+' '+ dateengfr(row['date_debut']) +' '+lang[langencours][16]+' '+ dateengfr(row['date_fin']) +'</strong></em>';
            }
		}  else {
            if (row['distance'] != null && row['distance']!='') {
                temp+='<br/><em class="comment"><strong>'+ row['distance'] +' Km</strong></em>';
			}
		}
		temp+='<span class="arrow"></span></a></li>';
	}
    if(i==0) {
		temp+="<li>"+lang[langencours][17]+"</li>";
	}
	else if ( (n[arborescence] + 20) <total[arborescence])
		temp+="<li class='pagination'><a href=\'#\' onclick=\"getNextList()\";return false><strong>"+lang[langencours][18]+"</strong></a></li>";
	temp+="</ul>";
    $('#contentListe'+arborescence).html('');
    window.scrollTo(0, 0.9);
	$('#contentListe'+arborescence).html(temp);
	sessionStorage.setItem("chargerListe["+arborescence+"]",1);
	$.unblockUI();  
	if(typeof(ouvreId)!='undefined') {
		selectid(ouvreId);
		delete ouvreId;
	}

}

// Function de callback  de la fonction afficheliste
function dataAffichemap(transaction, results){
	//carte
	var ctferme=afficheCarte();
	var filters = [];
	for (var i=0; i<results.rows.length; i++) {
		var row = results.rows.item(i);
		filters.push(row['id']);
	}
		
	$('#map_canvas'+arborescence).gmap('closeInfoWindow');
	$('#map_canvas'+arborescence).gmap('set', 'bounds', null);
	if ( filters.length > 0 ) {
		$('#map_canvas'+arborescence).gmap('find', 'markers', { 'property': 'ida', 'value': filters, 'operator': 'OR' }, function(marker, found) {
			if (found) {
				$('#map_canvas'+arborescence).gmap('addBounds', marker.position);
			}
			marker.setVisible(found); 
		});
		addmaPosition();
	} else {
		$.each($('#map_canvas'+arborescence).gmap('get', 'markers'), function(i, marker) {
			$('#map_canvas'+arborescence).gmap('addBounds', marker.position);
			marker.setVisible(true); 
		});
	}

	if(ctferme==1) {
		$('#contentMap'+arborescence).css({display: 'none'});
	}
}

// Afficher les 20 suivants
function getNextList() {
	$.blockUI({ message: '<h1>'+lang[langencours][2]+'</h1><img src="Framework/images/loader.gif"/>'});
	n[arborescence]+= 20;
	afficheliste();
}

// Afficher les 20 precedents
function getPrevList() {
    $.blockUI({ message: '<h1>'+lang[langencours][2]+'</h1><img src="Framework/images/loader.gif"/>'});
	n[arborescence]-= 20;
	afficheliste();
}

// Fonction pour afficher un POI
function selectid(id) {
	$.blockUI({ message: '<h1>'+lang[langencours][2]+'</h1><img src="Framework/images/loader.gif"/>'});	
	if(idsimpleproduit=='') {
	    //jQT.goTo("#detailpoi");
	if (isAndroid()) {
	    $("#fakeToolbar").empty();
		}
	}
	
	BlueAppsDB.transaction(
	    function (transaction) {
	       // console.log("sql detail poi");
			transaction.executeSql("SELECT * FROM "+arborescence+" where id=? limit 1;", [id], dataSelectId, errorHandler);
	    }
	);	
}

//Fonction de callback pour selectId
function dataSelectId(transaction, results){
	// Selection du div o� afficher le detail poi
	if(idsimpleproduit!='') {
		var divaafficher="#contentListe"+arborescence;
		$(divaafficher).addClass("simplecontent");
		showListe(arborescence);
		$('#boutonfiltrer'+arborescence).css('display','none');		
	} else {
		//console.log('#detailpoi');
		jQT.goTo("#detailpoi");
		var divaafficher="#contentdetail";
		$("#contentListe"+arborescence).removeClass("simplecontent");
		$('#boutonfiltrer'+arborescence).css('display','block');
		provenance='detailPoi';
	}
	
	
	// Handle the results
    var photos = "<span class='soustitre'>"+lang[langencours][19]+"</span><div class='box' id='Gallery' style='text-align:center'>";
    var bool = false;
    for (var i=0; i<results.rows.length; i++) {
    	var row = results.rows.item(i);
		
		// Hit google analytics
		if(typeof(googleAnalytics)!="undefined") {
			if (isIos()) {
				googleAnalytics.trackPageview("/"+row['titre']);
			} else if (isAndroid()) {
				window.plugins.analytics.trackPageView("/"+row['titre'],function(){}, function(){});
			}
		}
		window.scrollTo(0, 0);
		$(divaafficher).html(row['contenu']);

		//titre
		if(idsimpleproduit!='')
			$("#"+arborescence+" .toolbar h1").html(row['titre']);
		else
			$("#detailpoi .toolbar h1").html(row['titre']);

        
		if (isAndroid()) {
			$('#fakeToolbar').html("<h1 style='width:100%; , left:0px;'></h1>");
			$('#fakeToolbar h1').html(row['titre']);
            $('#fakeToolbar').css('display', 'block');
            $('.back').css('display', 'none');
		}
		if(row['urlphoto']!='' && row['urlphoto']!=undefined && row['urlphoto']!=null) {
			var a=row['urlphoto'].split('|');
			for(var j=0;j< a.length;j++) {
				if(a[j]!='' && a[j]!='undefined') {
					var miniature=a[j].replace('/images/', '/images/_thumbs/_');
					photos += "<div style='display:inline-block;width:64px; height: 64px; border:1px solid black'><a href='"+urlwebapp+a[j]+"' target='_blank'><img width='64px' height='64px' src='"+urlwebapp+miniature+"'/></a></div>&nbsp";
                    bool = true;
				}
			}
		}
    }
    photos += "</ul></div>";
   
   
   if (bool == true && isConnected()) {
		$(divaafficher).append(photos);
		$("#Gallery a").photoSwipe({enableMouseWheel: false , enableKeyboard: false, allowUserZoom : false });
		$("#Gallery a").click(function() {
			  if (isAndroid()) {
				  // Set orientation mode to User mode
				  // Allow user to switch between portrait and landscape
				  OrientationHandler.setUser(function(){}
								 ,function(){}
								);
				  // Set orientation mode (Android)
					  window.scrollTo(0, 0);
			  }
			  $('#map_canvas'+arborescence).gmap('refresh');
		});
    }

	$(divaafficher).find('a').attr('Target', '_blank');
    $(divaafficher).find('a').attr('Class', 'partage');

	$(divaafficher+' a').each(function(index) {
        if ($(this).attr("href").split(":")[0] == "tel" || $(this).attr("href").split(":")[0] == "mailto" || $(this).attr("href").split("//")[0] == "tel:" || $(this).attr("href").split("//")[0] == "mailto:") {
            $(this).removeClass("partage");
        }
    });
    
    if(isConnected) {       
		//bloc itineraire
		if (latitude != "" && longitude != "" && row['latitude']!='' && row['longitude']!='') {
            if( isIos() && device.version >= "6.0") {
                var maps = "<a target=\"_blank\" href='maps://maps.google.fr/maps?saddr="+latitude+","+longitude+"&daddr="+row['latitude']+","+row['longitude']+"'><img src='Framework/images/partage/maps.png'/></a>";
            } else {
                var maps = "<a target=\"_blank\" class=\"partage\" href='http://maps.google.fr/maps?saddr="+latitude+","+longitude+"&daddr="+row['latitude']+","+row['longitude']+"'><img src='Framework/images/partage/maps.png'/></a>";
            }
	  		$(divaafficher).append("<div id='routeBar'><span class='soustitre'>"+lang[langencours][22]+"</span><div class='box' style='text-align:center'>"+maps+"</div></div>");  
		}
		
		//bloc partage
		if(arborescence!='catfavoris')
			$(divaafficher).append("<div id='shareBar'><span class='soustitre'>"+lang[langencours][20]+"</span><div class='box' style='text-align:center'><a class='partage'  href='https://www.facebook.com/sharer.php?u="+escape(urlwebapp+'/id.html?id='+row['id']+'&arborescence='+arborescence)+"&t="+escape(nomapp)+"' target=\"_blank\"><img src='Framework/images/partage/fb.png'/></a>&nbsp;<a class='partage' href='http://twitter.com/intent/tweet?original_referer=&source=tweetbutton&hashtags="+escape(nomapp)+"&text="+escape(nomapp)+"&url="+escape(urlwebapp+'/id.html?id='+row['id']+'&arborescence='+arborescence)+"')\" target=\"_blank\"><img src='Framework/images/partage/twitter.png'/></a>&nbsp;<a href='mailto:?subject="+escape(nomapp)+"&body="+escape(''+lang[langencours][21]+' : '+urlwebapp+'/id.html?id='+row['id']+'&arborescence='+arborescence)+"' target=\"_blank\"><img src='Framework/images/partage/mail.png'/></a></div></div>");      

		$("#partageEmail").removeClass('partage');
		$("a.shareBox").removeClass('partage');
        $("#Gallery a").removeClass('partage');
		$("#tabs li a").removeClass('partage');
		$( ".bouton_content" ).button();

      	if(typeof(device) != "undefined") {
            $(divaafficher+" a.partage").click(function(event) {
				event.preventDefault();
				if (isIos()) {
					Cordova.exec("ChildBrowserCommand.showWebPage", $(this).attr('href')); 
				} else if (isAndroid()) {
						window.plugins.childBrowser.openExternal($(this).attr('href'));
				}
            });
        } 
	}

	
		
	//bloc ajout � l'agenda
	if(isAgenda(arborescence) && (isIos() || isAndroid())) {
		$(divaafficher).append('<div id="agendaBar"><span class="soustitre">'+lang[langencours][23]+'</span><div class="box" style="text-align:center"><a href="#" class="calendrier" onClick="addAgenda(\''+row['id']+'\')"><img src="Framework/images/calendar.png" /></a></div></div>');  			
	} 
	
	//bloc favoris
	if(typeof(option_favoris)!='undefined' && option_favoris==1) {
		if(arborescence=='catfavoris') {
			$(divaafficher).append('<div id="favorisBar"><span class="soustitre">'+lang[langencours][36]+'</span><div class="box" style="text-align:center" id="contentfavoris"><a href="#"  onClick="delFavorite(\''+row['id']+'\',\''+row['arborescence']+'\')"><img src="Framework/images/etoile-pleine.png" /></a></div></div>'); 
		} else if(arborescence!='catfavoris') {
			if(tab_favoris.inArray(row['id']+"_"+arborescence))
				$(divaafficher).append('<div id="favorisBar"><span class="soustitre">'+lang[langencours][36]+'</span><div class="box" style="text-align:center" id="contentfavoris"><a href="#"  onClick="delFavorite(\''+row['id']+'\',\''+arborescence+'\')"><img src="Framework/images/etoile-pleine.png" /></a></div></div>'); 
			else
				$(divaafficher).append('<div id="favorisBar"><span class="soustitre">'+lang[langencours][36]+'</span><div class="box" style="text-align:center" id="contentfavoris"><a href="#"  onClick="addToFavorite(\''+row['id']+'\',\''+arborescence+'\')"><img id="imgfavoris" src="Framework/images/etoile-vide.png" /></a></div></div>'); 
		}
	}
		
	if($( "#tabs" ).length) {
		$( "#tabs" ).tabs();
	}
	
	$.unblockUI();
	window.scrollTo(0, 0);
}

// Fonction d'ajout � l'agenda
function addAgenda(id) {
	BlueAppsDB.transaction(
	    function (transaction) {
	        transaction.executeSql("SELECT * FROM "+arborescence+" where id=? limit 1;", [id], addAgendaData, errorHandler);
	    }
	);	
}
// Fonction de callback de la fonction addAgenda
function addAgendaData(transaction, results) {
    for (var i=0; i<results.rows.length; i++) {
    	var row = results.rows.item(i);
		var cal = new calendarPlugin();
            
		var title= row['titre'];
		var location = row['adresse_agenda'];
		var notes = row['contenu_agenda'];
		if(row['heure_debut']=='') 
			heure_debut="00:00:00";
		else
			heure_debut=row['heure_debut'];
		if(row['heure_fin']=='')
			heure_fin='23:59:59';
		else
			heure_fin=row['heure_fin'];
		var startDate = row['date_debut']+" "+heure_debut;
		var endDate = row['date_fin']+" "+heure_fin;
		cal.createEvent(title,location,notes,startDate,endDate);
	}
}


// Fonction appel�e lors de l'affichage direct d'un POI (lien de partage ou push)
function affichecontenu() {
	$_GET = getQueryParams(decodeURIComponent(document.location.search));
    arborescence = $_GET['arborescence'];
	selectid($_GET['id']);
	$('#detailpoi #mapliste #content').height(window.innerHeight);
}

// Fonction de gestion des erreurs des requetes sql
function errorHandler(transaction, error){
 	//console.log('erreur');
	if (error.code==1){
 		// DB Table already exists
 	} else {
    	// Error is a human-readable string.
	    console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');	
		var temp="<ul class='metal scroll' style='margin-top: 0px;'>";
		temp+="<li>"+lang[langencours][17]+"</li>";	
		temp+="</ul>";
		$('#contentListe'+arborescence).html('');
		window.scrollTo(0, 0.9);
		$('#contentListe'+arborescence).html(temp);
		$("nav").css({display: 'none'});
		$("#boutonfiltrer"+arborescence).css({display: 'none'});
		showListe(arborescence);
		$.unblockUI();
	}
    return false;
}

// Fonction parse Rss
function getRss(nbart, url, reset, nomdudiv, isHomeRss) {
    if (reset == true && window.localStorage.getItem("rss_"+nomdudiv)) {
        window.localStorage.removeItem("rss");
    }
    if (typeof(device) == "undefined" || navigator.connection.type != Connection.NONE) {
        $.blockUI({ message: '<h1>'+lang[langencours][2]+'</h1><img src="Framework/images/loader.gif"/>'});
        var ajax = new XMLHttpRequest();
        ajax.open("GET",urlwebapp+"/rss/parseRSS.php?nbart="+nbart+"&url="+url,true);
        ajax.send();
        
        ajax.onreadystatechange=function(){
            if(ajax.readyState==4 && (ajax.status==200)){
                if (isHomeRss == true) {
                    $("#home_rss").html(ajax.responseText);
                    $(".rss-suite").click(function(event) {
                        event.preventDefault();
                        window.location.hash=nomdudiv;
                    });
                    var divRss = "#home_rss";
                } else {
                    $(nomdudiv).html(ajax.responseText);
                    $(".rss-suite").click(function(event) {
                        event.preventDefault();
                        getRss(nbart + 5, url, false, nomdudiv, false);
                    });
                    var divRss = nomdudiv;
                }
                $.unblockUI();
                $("#agenda #content a").removeClass("loading");
               	if(typeof(device) != "undefined") {
                    $(divRss+" a.partage").click(function(event) {
						 event.preventDefault();
						 if (isIos()) {
						 	Cordova.exec("ChildBrowserCommand.showWebPage", $(this).attr('href')); 
						 } else if (isAndroid()) {
						 	window.plugins.childBrowser.openExternal($(this).attr('href'));
						 }
					});
                }
            }
        }
        window.localStorage.setItem("rss", "true");
    } else {
        $("#contentrss").html('<ul class=\'metal scroll\'><li>'+lang[langencours][17]+'</li></ul>');
        alert(lang[langencours][24]);
    }
}

//permet d'afficher des poi d'une base de donn�e sur la home
function home_article(arbohome,nbArticle) {
	arborescencehome=arbohome;
	var requete = "SELECT * FROM "+arbohome+" where 1=1 ";
	if(isAgenda(arbohome)) {
		var addfiltre=" and date_fin>='"+datemaintenant()+"' order by date_debut asc,heure_debut asc";
	} else {
		var addfiltre=" order by position";
	} 
	var requeteliste=requete+addfiltre+" LIMIT 0, "+nbArticle;  
	//console.log(requeteliste);
	BlueAppsDB.transaction(
		function (transaction) {
				transaction.executeSql(requeteliste, [], home_article_data, errorHandler);
		}
	);

}

//Fonction de callback de home_article
function home_article_data(transaction, results){
	// Liste	
	var temp="<ul class='rounded scroll contentHomeRss'>";
	for (var i=0; i<results.rows.length; i++) {
		var row = results.rows.item(i);
		temp+="<li><a href='#' style='line-height:22px;vertical-align:center;text-overflow:ellipsis;' onclick=\"ouvrePoi('"+arborescencehome+"','" + row['id'] + "');return false\">";
		
        if (row['titre'].length > 50 && (isIos() || isAndroid()) ) {
            temp+=row['titre'].substr(0,50)+"...";
        } else {
            temp+=row['titre'];
        }
			
		if(isAgenda(arborescencehome)) {
			if (row['date_debut']==row['date_fin']) {
				temp+='<br/><small style="font-size:10px;text-overflow:clip;float:none;padding:0px">'+lang[langencours][14]+' '+ dateengfr(row['date_debut']) +'</small>';
			} else {
				temp+='<br/><small style="font-size:10px;text-overflow:clip;float:none;padding:0px">'+lang[langencours][15]+' '+ dateengfr(row['date_debut']) +' '+lang[langencours][16]+' '+ dateengfr(row['date_fin']) +'</small>';
            }
		} 
		temp+='<span class="arrow"></span></a></li>';
	}
	temp+='<li class="forward"><a class="rss-suite" style="line-height:22px;vertical-align:center" href="#'+arborescencehome+'">Afficher la suite</a></li>';
	temp+="</ul>";
	$("#home_rss").html(temp);
	
}

// Fonction qui permet d'ouvrir un POI depuis la page d'accueil
function ouvrePoi(arbo,id) {
	ouvreId=id;
	jQT.goTo("#"+arbo);
}


function nullDataHandler(){
	//console.log("SQL Query Succeeded");
}


//Fonction de callback des popups
function confirmCallback(buttonIndex) {
	if(buttonIndex==2) {
		sessionStorage.setItem("popupcat["+arborescence+"]",1);		
	}
}

// Fonction de CallBack boite de confirmation notez l'application
function ConfirmNoteCallback(buttonIndex) {
	if(buttonIndex==1) {
		localStorage.setItem("noVotez",1);		
		if(isIos() && url_appstore!='')
			window.location.href=url_appstore;
		if(isAndroid() && url_googleplay!='')
			window.plugins.childBrowser.openExternal(url_googleplay);

	}
	if(buttonIndex==3) {
		localStorage.setItem("noVotez",1);	
	}
}


// Fonction d'initialisation du menu
function initmenu() {
	// increase the default animation speed to exaggerate the effect
	$.fx.speeds._default = 1000;
	$( "#dialog" ).dialog({
		autoOpen: false,
		zIndex: 6999,
		width: '90%',
		modal: true,
		title: "Navigation"
	});

	$( "#opener" ).click(function() {
		$( "#dialog" ).dialog( "open" );
		return false;
	});
	$("#dialog a").click(function() {
		provenance='';
		$("#dialog").dialog('close');	
	});
}

// Fonction permettant d'afficher le menu
function showMenu() {
	$( "#dialog" ).dialog( "open" );
}

// Fonction NoPhoneInside
function noPhoneInside() {
	//console.log("Appel du noPhoneInside");	
	navigator.geolocation.getCurrentPosition(noPhoneInside_detail,nullDataHandler);
}

// Fonction de callback de la fonction de noPhoneInside
function noPhoneInside_detail(position) {
	var latitude_no_phone=position.coords.latitude;
	var longitude_no_phone=position.coords.longitude;
	
	$.each(no_phone_inside,function(i,nophone) {
	    var d_nophoneinside=distance(latitude_no_phone,longitude_no_phone,nophone["latitude"],nophone["longitude"])*1000;
		if(d_nophoneinside<nophone["rayon"]) {
			if(nophone["etat_alerte"]==0 || (nophone["etat_alerte"]==1 && !sessionStorage.getItem("popupnophone["+nophone["id_no_phone_inside"]+"]")) ) {
				if(typeof(device)!="undefined") {
					if(isConnected()) {
						navigator.notification.alert(
							nophone["message"],  // message
							nullDataHandler,         // callback
							nophone["titre"],            // title
							'Ok'                  // buttonName
						);	
						sessionStorage.setItem("popupnophone["+nophone["id_no_phone_inside"]+"]",1);
					}
				} else if(navigator.onLine) {
					alert(nophone["message"]);	
					sessionStorage.setItem("popupnophone["+nophone["id_no_phone_inside"]+"]",1);	
				}
			}
		}
	});
}

// Fonction qui permet de bloquer l'orientation de la page
function BloqueOrientationPage() {
	 if(isIos()) {
	     if (isPhotoSwipe()) {
			 switch(window.orientation) 
			 {
				 case -90:
					 options = [{landscapeleft:true}];
					 break;
				 case 90:
					 options = [{landscaperight:true}];
					 break;
				 case 180:
					 options = [{portraitdown:true}];
					 break;
				 default:
					 options = [{portrait:true}];
					 break;
			 }
	     } else {
		 	options = [{portrait:true}];
         }
         cordova.exec(null, null, "Orientation", "setOrientation", options);
	} else if (isAndroid()) {
	    if (!isPhotoSwipe()) {
	    	OrientationHandler.setPortrait(function(){}
					   ,function(){}
			);
		}
    }
}


// Fonction qui permet d'effacer les favoris plus disponible en bdd et charge les favoris dans un tableau
function gestion_favoris() {
	tab_favoris=new Array();
	bcarte=0;
	menucarte.unset("catfavoris");
	BlueAppsDB.transaction(
		function(transaction) {
			transaction.executeSql("delete from catfavoris where visible=0 ", [],[],errorHandler);
			transaction.executeSql("select * from catfavoris", [],function(transaction, results) {
					for (var i=0; i<results.rows.length; i++) {
						var row = results.rows.item(i);
						tab_favoris.push(row["id"] + "_" + row["arborescence"]);
						if(row['latitude']!='' && row['longitude']!='')
							bcarte=1;
					}
					
					if(bcarte==0) {
						menucarte.unset("catfavoris");
						if(typeof(arborescence)!='undefined' && arborescence=="catfavoris")
							$("nav").css({display: 'none'});
					} else {
						menucarte.push("catfavoris");
						if(typeof(arborescence)!='undefined' && arborescence=="catfavoris")
							$("nav").css({display: 'block'});
					}
					
				 },errorHandler);
		}
	);
	
}

// fonction qui permet d'ajouter un favoris en base de donn�e
function addToFavorite(id,arboname) {
       $('#contentfavoris').html('<a href="#"  onClick="delFavorite(\''+id+'\',\''+arborescence+'\')"><img src="Framework/images/etoile-pleine.png" /></a>');

		sql="select * from "+arboname+" where id='"+id+"'";
		BlueAppsDB.transaction(
			function(transaction) {
				transaction.executeSql(sql, [],function(transaction, results) {
					for (var i=0; i<results.rows.length; i++) {
						var row = results.rows.item(i);
						transaction.executeSql("INSERT INTO catfavoris (id ,arborescence, titre, categorie,date_debut,date_fin, latitude, longitude, contenu, urlminiature,urlphoto,contenu_agenda,heure_debut,heure_fin,adresse_agenda,position,visible) VALUES (?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,1)", [row['id'], arboname, row['titre'], row['categorie'],row['date_debut'],row['date_fin'], row['latitude'], row['longitude'], row['contenu'], row['urlminiature'],row['urlphotos'],row['contenu_agenda'],row['heure_debut'],row['heure_fin'],row['adresse_agenda'],row['position']]);
						if(row['latitude']!='' && row['longitude']!='' && isNumber(row['latitude']) && isNumber(row['longitude']) ) {
							var description='<a href="#" onclick="selectid(\'' + row['id'] + '\');return false">';
							if(row['urlminiature']!='' && row['urlminiature']!=null) {
								description+='<img style="width:90px;height:90px;margin:0px; padding:0px;float:left;" src="'+urlwebapp + row['urlminiature'] + '" /><div class="lieninfowindow">' + row['titre'] + '</div></a>';
							}  else {
								description+='<div class="lieninfowindow" style="width:98%">' + row['titre'] + '</div></a>';
							}
							var image='Framework/images/maps/pin1.png';	
							temp2 = [];
							temp2.push(row['id']);
					
							$('#map_canvascatfavoris').gmap('addMarker', {
								'tags': temp,
								'ida': temp2,
								'position': new google.maps.LatLng(row['latitude'], row['longitude']),
								'bounds': true,
								'icon' : image
							}).click(function() {
								$('#map_canvas'+arborescence).gmap('openInfoWindow', { 'content': description }, this);
							});
						}
						gestion_favoris();
					}		
				 },errorHandler);
			}
		);
}

function delFavorite(id,arboname) {
	$('#contentfavoris').html('<a href="#"  onClick="addToFavorite(\''+id+'\',\''+arborescence+'\')"><img id="imgfavoris" src="Framework/images/etoile-vide.png" /></a>');

	BlueAppsDB.transaction(
		function(transaction) {
			transaction.executeSql("delete from catfavoris where id=? and arborescence=? ", [id,arboname],[],errorHandler);
			gestion_favoris();
		}
	);
}

//Catch d'erreur
window.onerror = function (msg, url, line) {
   	console.log("Message : " + msg );
   	console.log("url : " + url );
   	console.log("Line number : " + line );
    $.unblockUI();
}