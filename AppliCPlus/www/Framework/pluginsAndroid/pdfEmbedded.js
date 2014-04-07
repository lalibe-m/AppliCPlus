// JavaScript Document

function pdfEmbedded(link) {
	var myPDF = new PDFObject({ url: link }).embed();
}