
var CustomCameraV = {
    showCustomCamera: function(data, success, fail){
	//var test = [{"id":"AAAAAAA","titre":"Pere noel","latitude":"90.0","longitude":"0.0"},{"id":"BBB","titre":"Ankama","latitude":"50.700203","longitude":"3.161208"},{"id":"CC", "titre":"Fresnoy", "latitude":"50.699863", "longitude":"3.154787"}];
    	return (cordova.exec(success, fail, "fr.blueapps.bluetech.newtech.PluginHandler", "loadAugmentedReality", data));
    }
};

function getDataFromRequest(transaction, results)
{
    sql2json(results);
}

function sql2json(result) {

    var json_str = "";
    var jsonArray = new Array();

    var i = 0;
    while(i < result.rows.length)
    {
	jsonArray[i] = new Object();
	var data = result.rows.item(i);
	jsonArray[i].id = data['id'];
	jsonArray[i].titre = data['titre'];
	jsonArray[i].latitude = data['latitude'];
	jsonArray[i].longitude = data['longitude'];
	i++;
    }
    CustomCameraV.showCustomCamera(jsonArray, function(id){
				       if (id != 'NONE'){
					   	selectid(id);
				       }
				       else
					   $.unblockUI();
				   },
				   function(res){
				       alert("Error:" + res.message);
				   });
}
