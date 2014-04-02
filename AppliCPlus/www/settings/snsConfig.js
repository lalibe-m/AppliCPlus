/* This file contains the configs for shootnsend
**
** One array case per shootnsend
**
** Some tags can be added in the content (#LATITUDE and #LONGITUDE)
** They will be remplaced by the value
**
** Type can be "mailBox" or "direct"
**
** For the direct type, other parameters are not used (but calque)
**
** To call the shoonsend, ust use javascript:capturePhoto(config[ID]) in the href tag of the button
**/

var config = new Array();
config[0] = {
    type:"direct",
    calque:"none",
    recipient:[/*"opluchart@citeonline.org", "fmasse@citeonline.org", "jpdeman@citeonline.org"*/ "mlaliberte@citeonline.org"],
    cc:"",
    subject:"[Rapport de litige]",
    content:{
	fr:"",
	en:"",
	nl:""
    },
    htmlMailField:"sns_email0",
    htmlCommentField:"sns_commentaires0"
};