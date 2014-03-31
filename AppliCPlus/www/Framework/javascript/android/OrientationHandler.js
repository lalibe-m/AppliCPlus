
var OrientationHandler = {
    setLandscape: function(success, fail){
    	return (cordova.exec(success, fail, "fr.blueapps.bluetech.newtech.PluginHandler", "changeOrientationMode", ["landscape"]));
    },
    setPortrait: function(success, fail){
    	return (cordova.exec(success, fail, "fr.blueapps.bluetech.newtech.PluginHandler", "changeOrientationMode", ["portrait"]));
    },
    setUser: function(success, fail){
    	return (cordova.exec(success, fail, "fr.blueapps.bluetech.newtech.PluginHandler", "changeOrientationMode", ["user"]));
    }
};