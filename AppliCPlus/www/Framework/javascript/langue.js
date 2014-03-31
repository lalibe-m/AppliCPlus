// JavaScript Document
if(navigator.language.indexOf("fr")>-1)
	var langencours="fr";
else if(navigator.language.indexOf("en")>-1)
	var langencours="en";
else if (navigator.language.indexOf("nl")>-1)
    var langencours="nl";
else
	var langencours="fr";


//var langencours="fr";

var lang=new Array("");
lang["fr"]=new Array("");
lang["en"]=new Array("");
lang["nl"]=new Array("");


//Français
lang["fr"][1]="Pour le premier lancement de l'application, vous devez être connecté à Internet.";
lang["fr"][2]="Veuillez patienter";
lang["fr"][3]="Local Databases are not supported by your browser. Please use a Webkit browser";
lang["fr"][4]="Téléchargement de la mise à jour";
lang["fr"][5]="Recherche";
lang["fr"][6]="Distance";
lang["fr"][7]="Catégories";
lang["fr"][8]='Ma position';
lang["fr"][9]='- Moins de';
lang["fr"][10]='Mots clés';
lang["fr"][11]='Filtre en cours';
lang["fr"][12]='Annuler filtre';
lang["fr"][13]='Afficher les 20 precedents';
lang["fr"][14]='Le';
lang["fr"][15]='Du';
lang["fr"][16]='au';
lang["fr"][17]="Aucun résultat n'est disponible";
lang["fr"][18]="Afficher les 20 suivants";
lang["fr"][19]="Galerie photo";
lang["fr"][20]="Partage";
lang["fr"][21]="Un ami vous conseille ce lien";
lang["fr"][22]="Itinéraire";
lang["fr"][23]="Ajout à l'agenda";
lang["fr"][24]="Vous devez être connecté pour profiter de cette fonction";
lang["fr"][25]="Calcul des distances";
lang["fr"][26]="Caméra";
lang["fr"][27]="Valider";
lang["fr"][28]="Votre photo a bien été envoyée !";
lang["fr"][29]="Veuillez remplir votre email";
lang["fr"][30]="Fonctionnalité incompatible avec votre type de smartphone";
lang["fr"][31]="Votre avis";
lang["fr"][32]="Vous avez aimé cette application. Souhaitez-vous la noter ?";
lang["fr"][33]="Ne plus me demander";
lang["fr"][34]="Me le rappeler plus tard";
lang["fr"][35]="Notez";
lang["fr"][36]="Favoris";


//Anglais
lang["en"][1]="For the first launching of the apps you must be connected to internet";
lang["en"][2]="Please wait";
lang["en"][3]="Local Databases are not supported by your browser. Please use a Webkit browser";
lang["en"][4]="Download update";
lang["en"][5]="Search";
lang["en"][6]="Distance";
lang["en"][7]="Categories";
lang["en"][8]='My position';
lang["en"][9]='- Less than';
lang["en"][10]='Keywords';
lang["en"][11]='Current filter';
lang["en"][12]='Cancel filter';
lang["en"][13]='view 20 previous results';
lang["en"][14]='The';
lang["en"][15]='From';
lang["en"][16]='To';
lang["en"][17]="No result";
lang["en"][18]="View 20 next results";
lang["en"][19]="Album";
lang["en"][20]="Share";
lang["en"][21]="Suggest this link to a friend";
lang["en"][22]="Route";
lang["en"][23]="Add to diary";
lang["en"][24]="You must be connected to access to this function";
lang["en"][25]="Calculate distance";
lang["en"][26]="Camera";
lang["en"][27]="Submit";
lang["en"][28]="Your picture has just been sent";
lang["en"][29]="Please fill in the mail field";
lang["en"][30]="Your smartphone does not support this feature";
lang["en"][31]="Review";
lang["en"][32]="You liked this application. Would you like to rate it ?";
lang["en"][33]="Don\'t ask anymore";
lang["en"][34]="Remind me later";
lang["en"][35]="Rate";
lang["en"][36]="Bookmark";


//Neerlande
lang["nl"][1]="Voor de eerste lancering van de applicatie, moet u verbonden zijn met het internet";
lang["nl"][2]="Een moment geduld";
lang["nl"][3]="Lokale databases worden niet ondersteund door uw browser. Gebruik een Webkit browser";
lang["nl"][4]="Downloaden van de update";
lang["nl"][5]="Zoek";
lang["nl"][6]="afstand";
lang["nl"][7]="Categorie‘n";
lang["nl"][8]='Mijn positie';
lang["nl"][9]='minder';
lang["nl"][10]='Trefwoorden';
lang["nl"][11]='Huidige filter';
lang["nl"][12]='Cancel filter';
lang["nl"][13]='Toon 20 precedenten';
lang["nl"][14]='De';
lang["nl"][15]='Van';
lang["nl"][16]='naar';
lang["nl"][17]="Er zijn geen resultaten beschikbaar";
lang["nl"][18]="Bekijk volgende 20";
lang["nl"][19]="Fotogalerij";
lang["nl"][20]="aandeel";
lang["nl"][21]="Een vriend raadt deze link";
lang["nl"][22]="reisplan";
lang["nl"][23]="Toevoegen aan agenda";
lang["nl"][24]="U moet ingelogd zijn om deze functie te gebruiken";
lang["nl"][25]="Berekening van afstanden";
lang["nl"][26]="Camera";
lang["nl"][27]="bevestigen";
lang["nl"][28]="Uw foto is verstuurd !";
lang["nl"][29]="Voer uw e-mail";
lang["nl"][30]="Functionaliteit niet compatibel met uw smartphone";
lang["nl"][31]="Beoordelen";
lang["nl"][32]="Vond je deze toepassing. Zou u er rekening mee?";
lang["nl"][33]="Niet meer vragen me";
lang["nl"][34]="Herinner mij later";
lang["nl"][35]="er rekening mee";
lang["nl"][36]="Favoriete";

//remplacement des textes non traduit par les textes français
for(var i=0;i<lang["fr"].length;i++){
  if (typeof(lang["en"][i])=='undefined') lang["en"][i]=lang["fr"][i] ;
  if (typeof(lang["nl"][i])=='undefined') lang["nl"][i]=lang["fr"][i] ;
}