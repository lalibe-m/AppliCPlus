/**
 * sns-android.js
 *  
 * Phonegap plugin ShootnSend
 * Copyright (c) Jourdain Cyril 2012
 *
**/

var __tmpConfig;

var ShootnSend = {
    capture : function(success, fail, config){
	return (cordova.exec(success, fail, "fr.blueapps.bluetech.newtech.PluginHandler", "launchShootnSend", [config]));
    }
};

function onSuccessGeolocation(position) {
    latitude=position.coords.latitude;
    longitude=position.coords.longitude;
    
}

function onErrorGeolocation(error) {
    latitude=null;
    longitude=null;
}

function onShootnSendFail(error){
    alert("Error : \n" + error);
}

function onPhotoDataSuccess(imageData) {
    if (imageData != "NONE"){
		$.blockUI({ message: '<h1>' + lang[langencours][2] + '</h1><img src="Framework/images/loader.gif"/>'});    
        email=$('#' + __tmpConfig.htmlMailField).val();
        commentaires=$('#' + __tmpConfig.htmlCommentField).val();

		$.ajax({
				type: "POST",
				url: "Framework/phpmailer/receivephoto.php",
				data: { email: email,photo: imageData,commentaires:commentaires,latitude:latitude,longitude:longitude }
		}).done(function( msg ) {
				$.blockUI({ message: '<h1>' + lang[langencours][28] + '</h1>'});
				setTimeout($.unblockUI, 2000);
		});
    }
}

function capturePhoto(config) {
    if (typeof config == undefined){
	alert("Error in config.js - Please check it first (config must be a valid array)");
	return;
    }

    if ((config.type != "mailBox" && navigator.onLine) || config.type == "mailBox")
    {
	if($('#' + config.htmlMailField).val()=='' && config.type != "mailBox") {
	    navigator.notification.alert(lang[langencours][29]);
	}
	else
	{
	    /* Replace latitude and logitude tag with values */
	    for (tmpLang in config.content){
		config.content[tmpLang] = config.content[tmpLang].replace("#LATITUDE", latitude);
		config.content[tmpLang] = config.content[tmpLang].replace("#LONGITUDE", longitude);
	    }
	    config.lang = langencours;
	    __tmpConfig = config;
	    if (device.platform == "Android") {
		ShootnSend.capture(onPhotoDataSuccess, onShootnSendFail, config);
	    }
	    else {
		alert(lang[langencours][30]);
	    }
	}
    }
    else {
	alert(lang[langencours][25]); 
    }
}