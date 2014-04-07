// JavaScript Document

function pdfEmbeded(link) {
	var myEmbededPdf = {
		url: link
	};
	var myPDF = new PDFObject(myEmbededPdf).embed();
}