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
    recipient:["jeanjacque@lol.com", "jeanluc@lilol.com"],
    cc:["jeanjacque@lol.com"],
    subject:"",
    content:{
	fr:"",
	en:"",
	nl:""
    },
    htmlMailField:"sns_email0",
    htmlCommentField:"sns_commentaires0"
};
config[1] = {
    type:"mailBox",
    calque:"none",
    recipient:["jeanjacque@lol.com", "jeanluc@lilol.com"],
    cc:["jeanjacque@lol.com"],
    subject:"ShootnSend Alert",
    content:{
	fr:"CECI EST UN TEST : #LATITUDE #LONGITUDE",
	en:"THIS IS A TEST",
	nl:"VLICHTIG BOCH TESTIEREN"
    },
    htmlMailField:"sns_email1",
    htmlCommentField:"sns_commentaires1"
};
config[2] = {
    type:"direct",
    calque:"sn1.png",
    recipient:["jeanjacque@lol.com", "jeanluc@lilol.com"],
    cc:["jeanjacque@lol.com"],
    subject:"",
    content:{
	fr:"",
	en:"",
	nl:""
    },
    htmlMailField:"sns_email2",
    htmlCommentField:"sns_commentaires2"
};
config[3] = {
    type:"mailBox",
    calque:"sn1.png",
    recipient:["jeanjacque@lol.com", "jeanluc@lilol.com"],
    cc:["jeanjacque@lol.com"],
    subject:"ShootnSend Postcard",
    content:{
	fr:"CECI EST UN TEST : #LATITUDE #LONGITUDE",
	en:"THIS IS A TEST",
	nl:"VLICHTIG BOCH TESTIEREN"
    },
    htmlMailField:"sns_email3",
    htmlCommentField:"sns_commentaires3"
};