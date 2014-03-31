var test = ["50.700203", "3.161208", "Ankama", "IOAPPEOE", "50.699863", "3.154787", "Le Fresnoy", "OAPEOZA"];


var CustomCamera = {
    showCamera:function(data, success, fail){
        return (Cordova.exec(success, fail, "CustomCamera", "show", data));
    }
}

function getDataFromRequestIOS(transaction, results)
{
    var i = 0;
    var j = 0;
    var list = new Array();
    while (j < results.rows.length)
    {
        var data = results.rows.item(j);
        if (data['latitude'] != "" && data['longitude'] != "" && data['id'] != "" && data['name'] != "")
        {
            list[i] = data['latitude'];
            list[i+1] = data['longitude'];
            list[i+2] = data['titre'];
            list[i+3] = data['id'];
            i += 4;
        }
        j++;
    }
        
    CustomCamera.showCamera(list, function(id){
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