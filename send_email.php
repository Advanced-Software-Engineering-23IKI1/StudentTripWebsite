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
    $pdf->SetAuthor('Tabbi Cat Trips');
    $pdf->SetTitle('Your personal information');

    // Set default header and footer
    $pdf->setPrintHeader(false);
    $pdf->setPrintFooter(false);

    // Set font (ensure the font supports Unicode)
    $pdf->SetFont('dejavusans', '', 12); // DejaVu Sans is built-in and supports Unicode

    $pdf->Cell(0, 10, 'Your Personal Information', 0, 1, 'C');
    $pdf->Ln(10);

    $pdf->Cell(60, 10, 'First Name', 1, 0);
    $pdf->Cell(130, 10, $data['first_name'], 1, 1);

    $pdf->Cell(60, 10, 'Last Name', 1, 0);
    $pdf->Cell(130, 10, $data['last_name'], 1, 1);

    $pdf->Cell(60, 10, 'Birthdate', 1, 0);
    $pdf->Cell(130, 10, $data['birthdate'], 1, 1);

    $pdf->Cell(60, 10, 'Address', 1, 0);
    $pdf->Cell(130, 10, $data['address'], 1, 1);

    $pdf->Cell(60, 10, 'Postal code', 1, 0);
    $pdf->Cell(130, 10, $data['postal_code'], 1, 1);

    $pdf->Cell(60, 10, 'Town', 1, 0);
    $pdf->Cell(130, 10, $data['town'], 1, 1);

    $pdf->Cell(60, 10, 'Phone Number', 1, 0);
    $pdf->Cell(130, 10, $data['mobile'], 1, 1);

    $pdf->Cell(60, 10, 'Email Address', 1, 0);
    $pdf->Cell(130, 10, $data['email'], 1, 1);

    $pdf->Cell(60, 10, 'Passport Number', 1, 0);
    $pdf->Cell(130, 10, $data['passport_number'], 1, 1);

    $pdf->Cell(60, 10, 'Gender', 1, 0);
    $pdf->Cell(130, 10, $data['gender'], 1, 1);

    $pdf->Cell(60, 10, 'Disability', 1, 0);
        $pdf->Cell(130, 10, $data['disability'], 1, 1);

    $pdf->Cell(60, 10, 'Allergies', 1, 0);
    $pdf->Cell(130, 10, $data['allergies'], 1, 1);

    $pdf->Ln(10);
    $pdf->Cell(0, 10, 'Information of Emergency Contact', 0, 1, 'C');
    $pdf->Ln(10);

    $pdf->Cell(60, 10, 'First Name', 1, 0);
    $pdf->Cell(130, 10, $data['first_name_ec'], 1, 1);

    $pdf->Cell(60, 10, 'Last Name', 1, 0);
    $pdf->Cell(130, 10, $data['last_name_ec'], 1, 1);

    $pdf->Cell(60, 10, 'Address', 1, 0);
    $pdf->Cell(130, 10, $data['address_ec'], 1, 1);

    $pdf->Cell(60, 10, 'Postal code', 1, 0);
    $pdf->Cell(130, 10, $data['postal_code_ec'], 1, 1);

    $pdf->Cell(60, 10, 'Town', 1, 0);
    $pdf->Cell(130, 10, $data['town_ec'], 1, 1);

    $pdf->Cell(60, 10, 'Phone Number', 1, 0);
    $pdf->Cell(130, 10, $data['mobile_ec'], 1, 1);

    $pdf->Cell(60, 10, 'Email Address', 1, 0);
    $pdf->Cell(130, 10, $data['email_ec'], 1, 1);

    $pdf->Cell(60, 10, 'Gender', 1, 0);
    $pdf->Cell(130, 10, $data['gender_ec'], 1, 1);

    $pdf->Ln(10);
    if (!empty($data['first_name_lg'])) {
        $pdf->Cell(0, 10, 'Information of Legal Guardian', 0, 1, 'C');
        $pdf->Ln(10);

        $pdf->Cell(60, 10, 'First Name', 1, 0);
        $pdf->Cell(130, 10, $data['first_name_lg'], 1, 1);

        $pdf->Cell(60, 10, 'Last Name', 1, 0);
        $pdf->Cell(130, 10, $data['last_name_lg'], 1, 1);

        $pdf->Cell(60, 10, 'Address', 1, 0);
        $pdf->Cell(130, 10, $data['address_lg'], 1, 1);

        $pdf->Cell(60, 10, 'Postal code', 1, 0);
        $pdf->Cell(130, 10, $data['postal_code_lg'], 1, 1);

        $pdf->Cell(60, 10, 'Town', 1, 0);
        $pdf->Cell(130, 10, $data['town_lg'], 1, 1);

        $pdf->Cell(60, 10, 'Phone Number', 1, 0);
        $pdf->Cell(130, 10, $data['mobile_lg'], 1, 1);

        $pdf->Cell(60, 10, 'Email Address', 1, 0);
        $pdf->Cell(130, 10, $data['email_lg'], 1, 1);

        $pdf->Cell(60, 10, 'Gender', 1, 0);
        $pdf->Cell(130, 10, $data['gender_lg'], 1, 1);
    }


    // Add remarks/wishes (use MultiCell for long text)
    $pdf->Cell(60, 10, 'Remarks/Wishes', 1, 0);
    $x = $pdf->GetX(); // Current X position
    $y = $pdf->GetY(); // Current Y position
    $pdf->MultiCell(130, 10, $data['wishes'], 1); // Draw MultiCell for the text
    $pdf->SetXY($x + 60, $y + 10); // Manually adjust position after MultiCell


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
    $mail->Subject = 'New Form filled out';
    $mail->Body    = 'A new Form has been filled. Find it attached as a PDF.';
    $mail->addStringAttachment($pdfContent, 'personal_information.pdf');

    $mail->send();

    //Mail to person filling out the Form
    $mail->clearAddresses(); // Clear previous recipients
    $mail->setFrom($_ENV["MAIL_ADDRESS_SENDER"], 'Tabbi Cat Trips');
    if (!empty($data['email_lg'])) {
        $mail->addAddress($data['email_lg']);
    } else {
        $mail->addAddress($data['email']);
    }
    $mail->Subject = 'Your Form from Tabbi Cat Trips';
    $mail->Body = "Hello. You can find your personal information attached as a PDF. \n
    Please do not reply to this Mail. If you have further questions or if there are problems regarding the Form, please contact us at hierkorrektemaileintragen@mail.com";
    $mail->addStringAttachment($pdfContent, 'personal_information.pdf');

    // Send the second email
    $mail->send();

            echo json_encode(['success' => true, 'message' => 'PDF sent successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>