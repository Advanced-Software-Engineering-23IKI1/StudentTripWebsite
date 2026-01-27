<?php
// Autoload dependencies installed via Composer
require 'vendor/autoload.php';

// Die .env file muss auf jeden Fall außerhalb von root liegen! Sie darf nicht von außen erreichbar sein!
$dotenv = Dotenv\Dotenv::createImmutable("../../");
$dotenv->load();


// Import classes at the top
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
    $pdf = new TCPDF();
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('Tabbi Cat Trips');
    $pdf->SetTitle('Contact Form of ' . $data['name']);

    // Set default header and footer
    $pdf->setPrintHeader(false);
    $pdf->setPrintFooter(false);

    // Set font (ensure the font supports Unicode)
    $pdf->SetFont('dejavusans', '', 12); // DejaVu Sans is built-in and supports Unicode

    $pdf->AddPage();

    // Title
    $pdf->Cell(0, 10, 'Personal Information of ' . $data['name'], 0, 1, 'C');
    $pdf->Ln(10);

    // Personal Information
    $pdf->Cell(60, 10, 'Name', 1, 0);
    $pdf->Cell(130, 10, $data['name'], 1, 1);

    $pdf->Cell(60, 10, 'Email', 1, 0);
    $pdf->Cell(130, 10, $data['email'], 1, 1);

    $pdf->Cell(60, 10, 'Phone number', 1, 0);
    $pdf->Cell(130, 10, $data['phone'], 1, 1);

    // Message
    $pdf->Ln(10);
    $pdf->Cell(60, 10, 'Message', 1, 0);
    $pdf->MultiCell(130, 10, $data['message'], 1, 'L', 0, 1);

    // Output PDF as a string
    $pdfContent = $pdf->Output('', 'S');

    // Configure PHPMailer
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'mail.gmx.net';
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV["MAIL_ADDRESS_SENDER"];
    $mail->Password   = $_ENV["MAIL_PASSWORD_SENDER"];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    //TODO put sensible things in subject, body, as file name and as first cell

    //Mail to Luka
    $mail->clearAddresses(); // Clear previous recipients
    $mail->setFrom($_ENV["MAIL_ADDRESS_SENDER"], 'Your Website');
    $mail->addAddress($_ENV["MAIL_ADDRESS_RECEIVER"]);
    $mail->Subject = 'New Contact Form';
    $mail->Body    = 'A new contact form has been filled. Find it attached as a PDF.';
    $sanitized_name = preg_replace('/[^a-zA-Z0-9_-]/', '_', $data['name']);
    $mail->addStringAttachment($pdfContent, 'personal_information_' . $sanitized_name . '.pdf');

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'PDF sent successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>