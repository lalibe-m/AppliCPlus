// JavaScript Document
var pluginHandler = {
			getDeviceLanguage: function(onSuccess, onFail){
			return (cordova.exec(onSuccess, onFail, "fr.blueapps.bluetech.newtech.PluginHandler", "getDeviceLanguage", []));
			}
		};