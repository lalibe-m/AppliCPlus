// LANGUE
document.write('<script type="text/javascript" src="Framework/javascript/langue.js"></script>');

// JQTOUCH - JQUERY - JQUERY UI
document.write('<script src="Framework/javascript/jqtouch.min.js" type="text/javascript" charset="utf-8"></script>');
document.write('<script src="Framework/javascript/jquery/jquery-1.8.0.min.js" type="application/x-javascript" charset="utf-8"></script>');
document.write('<script src="Framework/javascript/jqtouch-jquery.min.js" type="application/x-javascript" charset="utf-8"></script>');
if(navigator.onLine) {
	document.write('<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>');
	document.write('<script type="text/javascript" src="Framework/javascript/jquery/ui/min/jquery.ui.map.full.min.js"></script>');
}

document.write('<link type="text/css" href="Framework/css/smoothness/jquery-ui-1.8.23.custom.css" rel="stylesheet" />');
document.write('<script type="text/javascript" src="Framework/javascript/jquery/jquery-ui-1.8.23.custom.min.js"></script>');
document.write('<script type="text/javascript" src="Framework/javascript/jquery/jquery.ui.datepicker-fr.js"></script>');
document.write('<script src="Framework/javascript/jquery/jquery.ui.touch-punch.min.js"></script>');
document.write('<script src="Framework/javascript/jquery/jquery.blockUI.js"></script>');

// CSS - CORDOVA
if((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPod touch/i)||(navigator.userAgent.match(/iPad/i))) ){
    document.write('<link rel="stylesheet" charset="utf-8" href="Framework/css/apple.css" title="jQTouch">');
    document.write('<script type="text/javascript" charset="utf-8" src="Framework/javascript/ios/cordova-2.2.0.js"></script>');
	document.write('<link rel="stylesheet" type="text/css" href="Framework/css/tabbar.css">');
} else if ((navigator.userAgent.match(/android/i)) ) {
    document.write('<link rel="stylesheet" charset="utf-8" href="Framework/css/android.css" title="jQTouch">');
    document.write('<script type="text/javascript" charset="utf-8" src="Framework/javascript/android/cordova-2.2.0.js"></script>');
	document.write('<link rel="stylesheet" type="text/css" href="Framework/css/tabbar-android.css">');
} else {
	document.write('<link rel="stylesheet" charset="utf-8" href="Framework/css/apple.css" title="jQTouch">');
	document.write('<link rel="stylesheet" type="text/css" href="Framework/css/tabbar.css">');
}


document.write('<script src="Framework/javascript/function.js"></script>');
//document.write('<script src="Framework/javascript/map.js"></script>');
document.write('<script src="settings/bind.js" charset="utf-8"></script>');

// PHOTOSWIPE
document.write('<link href="Framework/css/photoswipe.css" type="text/css" rel="stylesheet" />');
document.write('<script type="text/javascript" src="Framework/javascript/klass.min.js"></script>');
document.write('<script type="text/javascript" src="Framework/javascript/code.photoswipe.jquery-3.0.4.min.js"></script>');


// PLUGIN
if((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPod touch/i)||(navigator.userAgent.match(/iPad/i))) ) {
	document.write('<script type="text/javascript" src="Framework/javascript/ios/ChildBrowser-ios.js"></script>');
	document.write('<script type="text/javascript" src="Framework/javascript/ios/sns-ios.js"></script>');
	document.write('<script src="Framework/javascript/ios/calendar-ios.js"></script>');
	document.write('<script src="Framework/javascript/ios/GoogleAnalyticsPlugin.js"></script>');
	document.write('<script type="text/javascript" src="Framework/javascript/ios/Camera-ios.js"></script>');
} else if ((navigator.userAgent.match(/android/i)) ) {
	document.write('<script type="text/javascript" src="Framework/javascript/android/ChildBrowser-android.js"></script>');
	document.write('<script type="text/javascript" src="Framework/javascript/android/sns-android.js"></script>');
	document.write('<script src="Framework/javascript/android/calendar-android.js"></script>');
	document.write('<script src="Framework/javascript/android/analytics.js"></script>');
	document.write('<script type="text/javascript" src="Framework/javascript/android/Camera.js"></script>');
	document.write('<script type="text/javascript" src="Framework/javascript/android/OrientationHandler.js"></script>');
	document.write('<script type="text/javascript" src="Framework/javascript/android/deviceinfo-android.js"></script>');	
}
document.write('<link rel="stylesheet" href="css/overlay.css" />');
document.write('<script type="text/javascript" src="settings/snsConfig.js"></script>');


function onBodyLoad()
	{
        if((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPod/i)) ||(navigator.userAgent.match(/android/i)) ){
			document.addEventListener("deviceready", onDeviceReady, false);
		} else
        	onDeviceReady();
	}
    
function onDeviceReady() {
   
    if (typeof(device) == "undefined" || (device.platform == "iPhone" && device.version >= "6.0")) {
        $("head").append("<link>");
        css = $("head").children(":last");
        css.attr({
                 rel:  "stylesheet",
                 type: "text/css",
                 href: "Framework/css/apple6.css"
        });
    }

	$('body').bind('turn', function(event, info){
    	orientationChange();
	});
	// If android, block orientation in portrait mode
    	// Call setUser or setLandscape if other mode needed
	if (typeof(device) != "undefined"  && device.platform == "Android") {
		OrientationHandler.setPortrait(function(){}
					       ,function(){}
					      );
		
		pluginHandler.getDeviceLanguage(function(lang){
		    langencours=lang;
		    $("#fakeToolbar").offset({top:0, left:0});
		    bddinit();
		});
				  
	} else {
			bddinit();
	}
}


function orientationChange() {
   $('#map_canvas'+arborescence).height(window.innerHeight-94); // landscape or profile
}