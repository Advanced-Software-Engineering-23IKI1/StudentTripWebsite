<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Adjust the path if not using Composer

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'mail.gmx.net'; // GMX SMTP server
    $mail->SMTPAuth   = true;
    $mail->Username   = 'lukas.website@gmx.de'; // Your GMX email address
    $mail->Password   = '0^nFo6pspa29xsEdfx2A'; // Your GMX email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Recipients
    $mail->setFrom('lukas.website@gmx.de', 'Luka');
    $mail->addAddress('merz.jan@gmx.de', 'Jan');

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Test Email from PHPMailer';
    $mail->Body    = '<p>This is a test email sent using <b>PHPMailer</b>.</p>';
    $mail->AltBody = 'This is a test email sent using PHPMailer.';

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>