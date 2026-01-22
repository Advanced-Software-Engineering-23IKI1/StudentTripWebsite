<?php
// Autoload dependencies installed via Composer
require 'vendor/autoload.php';

// Die .env file muss auf jeden Fall außerhalb von root liegen! Sie darf nicht von außen erreichbar sein!
$dotenv = Dotenv\Dotenv::createImmutable("../../");
$dotenv->load();


// Import classes at the top
use setasign\Fpdi\Fpdi;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Set headers for JSON response
header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    // Get JSON input
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
        exit;
    }

    // Create PDF
    $pdf = new Fpdi();
    $pdf->AddPage();
    $pdf->SetFont('Arial', 'B', 16);
    $pdf->Cell(0, 10, 'User Details', 0, 1, 'C');
    $pdf->Ln(10);

    $pdf->SetFont('Arial', '', 12);
    $pdf->Cell(0, 10, 'First Name: ' . $data['first_name'], 0, 1);
    $pdf->Cell(0, 10, 'Last Name: ' . $data['last_name'], 0, 1);
    $pdf->Cell(0, 10, 'Date of Birth: ' . $data['birthdate'], 0, 1);
    $pdf->Cell(0, 10, 'Address: ' . $data['address'], 0, 1);
    $pdf->Cell(0, 10, 'Postal Code: ' . $data['postal_code'], 0, 1);
    $pdf->Cell(0, 10, 'Town/City: ' . $data['town'], 0, 1);
    $pdf->Cell(0, 10, 'Phone Number: ' . $data['mobile'], 0, 1);
    $pdf->Cell(0, 10, 'Email Address: ' . $data['email'], 0, 1);
    $pdf->Cell(0, 10, 'Passport Number: ' . $data['passport_number'], 0, 1);
    $pdf->Cell(0, 10, 'Gender: ' . $data['gender'], 0, 1);
    $pdf->Cell(0, 10, 'Remarks/Wishes:', 0, 1); // Label for the remarks field
    $pdf->MultiCell(0, 10, $data['wishes']); // Add the remarks text

    // Output PDF as a string
    $pdfContent = $pdf->Output('S');

    // Configure PHPMailer
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'mail.gmx.net';
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV["MAIL_ADDRESS_SENDER"];
    $mail->Password   = $_ENV["MAIL_PASSWORD_SENDER"];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom($_ENV["MAIL_ADDRESS_SENDER"], 'Luka');
    $mail->addAddress($_ENV["MAIL_ADDRESS_RECEIVER"]);
    $mail->Subject = 'Your Details PDF';
    $mail->Body    = 'Please find your details attached as a PDF.';
    $mail->addStringAttachment($pdfContent, 'details.pdf');

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'PDF sent successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>