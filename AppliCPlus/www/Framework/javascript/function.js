// Permet de vérifier qu'une valeur est présente dans un tableau
// utilisation tableau.inArray(valeurCherchée)
// retourne True ou False
Array.prototype.inArray = function(p_val) {
    var l = this.length;
    for(var i = 0; i < l; i++) {
        if(this[i] == p_val) {
            return true;
        }
    }
    return false;
}

// Permet de supprimer une valeur d'un tableau
// utilisation tableau.unset(valeuraenlever);
Array.prototype.unset = function(val){
	var index = this.indexOf(val)
	if(index > -1){
		this.splice(index,1)
	}
}

// Permet de récupérer les paramétres d'une url
// retourne un tableau de paramètres
function getQueryParams(qs) {
	qs = qs.split("+").join(" ");
	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])]
			= decodeURIComponent(tokens[2]);
	}

	return params;
}


if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}


// Permet de vérifier qu'une variable est définie
// retourne True ou FAlse
function isset (variable) {
    return (typeof variable != 'undefined');
}

// Permet de calculer la distance en 2 latitudes / longitude
// Retourne une distance en Km
function distance(lat1,lon1,lat2,lon2) {
	var R = 6371; 
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
			Math.sin(dLon/2) * Math.sin(dLon/2);
	
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	
	d = Math.round(d*100)/100;
	
	//if(d < 200)
		//d = 200;
		
	return d;
}

// Permet de transformer une date au format ENG au format FR
// Retourne une date au format fr 12-12-2012
function dateengfr(dateeng) {
	a = dateeng.split("-");
	return a[2]+'-'+a[1]+'-'+a[0];	
}


// Permet de vérifier que value est un nombre
// Retourne True ou False
function isNumber(value) {
    if ((undefined === value) || (null === value)) {
        return false;
    }
    if (typeof value == 'number') {
        return true;
    }
    return !isNaN(value - 0);
}

// Permet de retourner la date now au format EN (2012-12-12)
function datemaintenant() {
	var datemaintenant= new Date();
	var jour= (datemaintenant.getDate() < 10 ? ('0'+datemaintenant.getDate()): datemaintenant.getDate());
	var mois=(datemaintenant.getMonth()+1 < 10 ? ('0'+(datemaintenant.getMonth()+1)): datemaintenant.getMonth()+1);
	var annee= datemaintenant.getFullYear();
	var dateformate=annee + "-" + mois + "-" + jour;
	
	return dateformate;
}

// Permet de retourner le nom de la page en cours
// Retourne une chaine (ex: index)
function retournePage() {
	var nom = window.location.pathname;
	nom = nom.split("/");
	nom = nom[nom.length - 1];
	nom = nom.substr(0, nom.lastIndexOf("."));
	nom = nom.replace(new RegExp("(%20|_|-)", "g"), "");
	
	return nom;
}

//Permet de vérifier si le script s'execute sur un device IOS
//Retourne True ou False
function isIos() {
	if(typeof(device) != "undefined" && (device.platform == "iPhone" || device.platform == "iPad" || device.platform == "iPhone Simulator" || device.platform == "iPad Simulator" || device.platform == "iPod touch") )
		return true;
	return false;	
}



//Permet de vérifier si le script s'execute sur un device IOS
//Retourne True ou False
function isAndroid() {
	if (typeof(device) != "undefined" && (device.platform == "Android")) {
		return true;
	}
	return false;
}


//Permet de vérifier si l'arborscence est de type Agenda
//Retourne True ou False
function isAgenda(arborescence) {
    if(menuagenda.inArray(arborescence)) {
        if(isIos()) {
			var cal = new calendarPlugin();
			cal.autorisation();
		}
		return true;
    }
    return false;
}

// Permet de vérifier si l'arborscence doit afficher la carte en 1er
// Retourne True or False
function isListeFirst(arborescence) {
    if(listefirst.inArray(arborescence)) {
        return true;
    }
    return false;
}

// Permet de vérifier si l'arborscence est une carte
// Retourne True or False
function isCarte(arborescence) {
    if(!isConnected()) {
		return false;
    }
    if (menucarte.inArray(arborescence)) {
        return true;
    }
    return false;
}


// Permet de vérifier si on a une connexion Internet
// Retourne True ou false
function isConnected() {
	if( navigator.network!=undefined && (navigator.network.connection.type=='unknown' || navigator.network.connection.type=='none') ) {
		return false;
	} else
		return true;
}


//Permet d'afficher une carte pour effectuer les traitements dessus
// Retourne True si la carte n'était pas affiché
function afficheCarte() {
	if($('#contentMap'+arborescence).css('display')=='none') {
	  $('#contentMap'+arborescence).css({display: 'block'});
	  $('#map_canvas'+arborescence).gmap('refresh');
	  return true;
	}	
	return false;
}

//Permet de vérifier que lapage en cours n'est pas la galeriephoto
//retourne true or false
function isPhotoSwipe() {
	if (window.location.href.indexOf("#PhotoSwipe") > -1)
	 	return true;
	else
		return false;
}


function calendrier_depart(arbo) {
	$("#recherchedatedebut"+arbo).datepicker("show");
}
function calendrier_fin(arbo) {
	$("#recherchedatefin"+arbo).datepicker("show");
}

// Remplace toutes les occurences d'une chaine
function replaceAll(str, search, repl) {
	while (str.indexOf(search) != -1)
 		str = str.replace(search, repl);
 	return str;
}
// Remplace les caractères accentués
function AccentToNoAccent(str) {
	var norm = new Array('À','Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë',
'Ì','Í','Î','Ï', 'Ð','Ñ','Ò','Ó','Ô','Õ','Ö','Ø','Ù','Ú','Û','Ü','Ý',
'Þ','ß', 'à','á','â','ã','ä','å','æ','ç','è','é','ê','ë','ì','í','î',
'ï','ð','ñ', 'ò','ó','ô','õ','ö','ø','ù','ú','û','ü','ý','ý','þ','ÿ');
	var spec = new Array('A','A','A','A','A','A','A','C','E','E','E','E',
'I','I','I','I', 'D','N','O','O','O','0','O','O','U','U','U','U','Y',
'b','s', 'a','a','a','a','a','a','a','c','e','e','e','e','i','i','i',
'i','d','n', 'o','o','o','o','o','o','u','u','u','u','y','y','b','y');
	for (var i = 0; i < spec.length; i++)
  		str = replaceAll(str, norm[i], spec[i]);
 	str=str.toUpperCase();
	return str;
}

