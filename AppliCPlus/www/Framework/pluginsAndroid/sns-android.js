/**
 * sns-android.js
 *  
 * Phonegap plugin ShootnSend
 * Copyright (c) Maxime Laliberte 2012
 *
**/

var __tmpConfig;

var ShootnSend = {
    capture : function(success, fail, config){
	return (cordova.exec(success, fail, "fr.blueapps.bluetech.newtech.PluginHandler", "launchShootnSend", [config]));
    }
};

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
				data: { email: email,photo: imageData,commentaires:commentaires,longitude:longitude }
		}).done(function( msg ) {
				$.blockUI({ message: '<h1>' + lang[langencours][28] + '</h1>'});
				setTimeout($.unblockUI, 2000);
		});
    }
}

function capturePhoto(config) {
    if (typeof config == undefined){
	alert("Error in snsConfig.js - Please check it first (config must be a valid array)");
	return;
    }

    if ((config.type != "mailBox" && navigator.onLine) || config.type == "mailBox")
    {
	if($('#' + config.htmlMailField).val()=='' && config.type != "mailBox") {
	    navigator.notification.alert(lang[langencours][29]);
	}
	else
	{
	    config.lang = "fr";
	    __tmpConfig = config;
	    if (device.plateform == "Android") {
		ShootnSend.capture(onPhotoDataSuccess, onShootnSendFail, config);
	    }
	}
    }
}