<?php

$emailexpediteur="a@a.fr";
$nomexpediteur="Shootnsend";
$sujet="Shootnsend";


/******************** NE PAS MODIFIER ********************************************/

if($_GET)
	$_POST=$_GET;

if($_POST) {
	$fichier="photo".time().".jpg";
	
	$handle=fopen($fichier,'w+');	
	fwrite($handle,base64_decode($_POST['photo']));
	fclose($handle);
	require_once 'class.phpmailer.php';
	try {
	  $contenuhtml="".$_POST['commentaires']."<br /><br />Pour visualiser la localisation de cette photo, veuillez cliquer <a href='http://maps.google.com/maps?q=".$_POST['latitude'].",".$_POST['longitude']."'>ici</a>";
	  $mail             = new PHPMailer();
	  $mail->AddAddress($_POST['email']);
	  $mail->SetFrom($emailexpediteur, $nomexpediteur);
	  $mail->Subject = $sujet;
	  $mail->MsgHTML($contenuhtml);
	  $mail->AddAttachment($fichier);      // attachment
	  $mail->Send();
	  echo "Message Sent OK</p>\n";
	  unlink($fichier);
	} catch (phpmailerException $e) {
	  echo $e->errorMessage(); //Pretty error messages from PHPMailer
	} catch (Exception $e) {
	  echo $e->getMessage(); //Boring error messages from anything else!
	}
}


?>