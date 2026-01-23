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
    // Add a page
       $pdf->AddPage();
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('Your Name');
    $pdf->SetTitle('Unicode PDF Example');
    $pdf->SetSubject('Demo');
    $pdf->SetKeywords('TCPDF, PDF, Unicode, Umlauts');

    // Set default header and footer
    $pdf->setPrintHeader(false);
    $pdf->setPrintFooter(false);

    // Set font (ensure the font supports Unicode)
    $pdf->SetFont('dejavusans', '', 12); // DejaVu Sans is built-in and supports Unicode

    $pdf->Cell(0, 10, 'User Details', 0, 1, 'C');
    $pdf->Ln(10);

    $pdf->Cell(60, 10, 'First Name', 1, 0);
    $pdf->Cell(130, 10, $data['first_name'], 1, 1);

    $pdf->Cell(60, 10, 'Last Name', 1, 0);
    $pdf->Cell(130, 10, $data['last_name'], 1, 1);

    $pdf->Cell(60, 10, 'Email Address', 1, 0);
    $pdf->Cell(130, 10, $data['email'], 1, 1);

    $pdf->Cell(60, 10, 'Phone Number', 1, 0);
    $pdf->Cell(130, 10, $data['mobile'], 1, 1);

    // Add remarks/wishes (use MultiCell for long text)
    $pdf->Cell(60, 10, 'Remarks/Wishes', 1, 0);
    $x = $pdf->GetX(); // Current X position
    $y = $pdf->GetY(); // Current Y position
    $pdf->MultiCell(130, 10, $data['wishes'], 1); // Draw MultiCell for the text
    $pdf->SetXY($x + 60, $y + 10); // Manually adjust position after MultiCell


    // Output PDF as a string
    //$pdfContent = $pdf->Output('S');
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