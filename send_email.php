<?php
//load configs
require_once 'config.php';
// Include PHPMailer classes
require_once 'PHPMailer/src/PHPMailer.php';
require_once 'PHPMailer/src/Exception.php';
require_once 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include TCPDF class
require_once 'tcpdf/tcpdf.php';

// Set headers for JSON response
header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    // Get JSON input
    $dataWhole = json_decode(file_get_contents('php://input'), true);
    $data = $dataWhole['formInfo'];
    $tripInfoGeneral = $dataWhole['tripInfo']['otherInformation'];
    $tripInfoActivities = $dataWhole['tripInfo']['activityInfo'];
    $tripInfoExtras = $dataWhole['tripInfo']['extraInfo'];

    if (!$data || json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
        exit;
    }

    // Create PDF
    $pdf = new TCPDF();
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('Tabbi Cat Trips');
    $pdf->SetTitle('Your personal information');

    // Set default header and footer
    $pdf->setPrintHeader(false);
    $pdf->setPrintFooter(false);

    // Set font (ensure the font supports Unicode)
    $pdf->SetFont('dejavusans', '', 12); // DejaVu Sans is built-in and supports Unicode

    $pdf->AddPage();

    // Title
    $pdf->Cell(0, 10, 'General Trip Information:', 0, 1, 'C');
    $pdf->Ln(10);

    $pdf->Cell(60, 10, 'Amount of People', 1, 0);
    $pdf->Cell(130, 10, $tripInfoGeneral['amountPeople'], 1, 1);

    $pdf->Cell(60, 10, 'Subtotal', 1, 0);
    $pdf->Cell(130, 10, '£' . $tripInfoGeneral['subTotal'], 1, 1);

    $pdf->Cell(60, 10, 'Total', 1, 0);
    $pdf->Cell(130, 10, '£' . $tripInfoGeneral['total'], 1, 1);

    $pdf->Ln(10);
    $pdf->Cell(0, 10, 'Requested activities:', 0, 1, 'C');
    $pdf->Ln(10);

    foreach ($tripInfoActivities as $activity)  {
    // Add all the activity Information
        $pdf->Cell(60, 10, 'Activity', 1, 0);
        $pdf->MultiCell(130, 10, $activity['description'], 1, 'L', 0, 1);

        $pdf->Cell(130, 10, 'Amount of people, that want to do this activity:', 1, 0);
        $pdf->Cell(60, 10, $activity['amountPeople'], 1, 1);

        $pdf->Ln(5);
    }

    $pdf->Ln(10);
    $pdf->Cell(0, 10, 'Booked extras:', 0, 1, 'C');
    $pdf->Ln(10);

    foreach ($tripInfoExtras as $extra)  {
        // Add all the extra Information
            $pdf->Cell(60, 10, 'Extra', 1, 0);
            $pdf->MultiCell(130, 10, $extra['description'], 1, 'L', 0, 1);

            $pdf->Cell(130, 10, 'Amount of people/pairs, that want this extra:', 1, 0);
            $pdf->Cell(60, 10, $extra['amountPeople'], 1, 1);

            $pdf->Ln(5);
        }

    foreach ($data as $person) {
    // Add a new page for each person
        $pdf->AddPage();

        // Title
        $pdf->Cell(0, 10, 'Personal Information of ' . $person['first_name'] . ' ' . $person['last_name'], 0, 1, 'C');
        $pdf->Ln(10);

        // Personal Information
        $pdf->Cell(60, 10, 'First Name', 1, 0);
        $pdf->Cell(130, 10, $person['first_name'], 1, 1);

        $pdf->Cell(60, 10, 'Last Name', 1, 0);
        $pdf->Cell(130, 10, $person['last_name'], 1, 1);

        $pdf->Cell(60, 10, 'Birthdate', 1, 0);
        $pdf->Cell(130, 10, $person['birthdate'], 1, 1);

        $pdf->Cell(60, 10, 'Address', 1, 0);
        $pdf->Cell(130, 10, $person['address'], 1, 1);

        $pdf->Cell(60, 10, 'Postal Code', 1, 0);
        $pdf->Cell(130, 10, $person['postal_code'], 1, 1);

        $pdf->Cell(60, 10, 'Town', 1, 0);
        $pdf->Cell(130, 10, $person['town'], 1, 1);

        $pdf->Cell(60, 10, 'Phone Number', 1, 0);
        $pdf->Cell(130, 10, $person['mobile'], 1, 1);

        $pdf->Cell(60, 10, 'Email Address', 1, 0);
        $pdf->Cell(130, 10, $person['email'], 1, 1);

        $pdf->Cell(60, 10, 'Passport Number', 1, 0);
        $pdf->Cell(130, 10, $person['passport_number'], 1, 1);

        $pdf->Cell(60, 10, 'Gender', 1, 0);
        $pdf->Cell(130, 10, $person['gender'], 1, 1);

        $pdf->Cell(60, 10, 'Disability', 1, 0);
        $pdf->MultiCell(130, 10, $person['disability'], 1, 'L', 0, 1);

        $pdf->Cell(60, 10, 'Allergies', 1, 0);
        $pdf->MultiCell(130, 10, $person['allergies'], 1, 'L', 0, 1);

        // Emergency Contact Information
        $pdf->Ln(10);
        $pdf->Cell(0, 10, 'Information of Emergency Contact', 0, 1, 'C');
        $pdf->Ln(10);

        $pdf->Cell(60, 10, 'First Name', 1, 0);
        $pdf->Cell(130, 10, $person['first_name_ec'], 1, 1);

        $pdf->Cell(60, 10, 'Last Name', 1, 0);
        $pdf->Cell(130, 10, $person['last_name_ec'], 1, 1);

        $pdf->Cell(60, 10, 'Address', 1, 0);
        $pdf->Cell(130, 10, $person['address_ec'], 1, 1);

        $pdf->Cell(60, 10, 'Postal Code', 1, 0);
        $pdf->Cell(130, 10, $person['postal_code_ec'], 1, 1);

        $pdf->Cell(60, 10, 'Town', 1, 0);
        $pdf->Cell(130, 10, $person['town_ec'], 1, 1);

        $pdf->Cell(60, 10, 'Phone Number', 1, 0);
        $pdf->Cell(130, 10, $person['mobile_ec'], 1, 1);

        $pdf->Cell(60, 10, 'Email Address', 1, 0);
        $pdf->Cell(130, 10, $person['email_ec'], 1, 1);

        $pdf->Cell(60, 10, 'Gender', 1, 0);
        $pdf->Cell(130, 10, $person['gender_ec'], 1, 1);

        // Legal Guardian Information (if provided)
        if (!empty($person['first_name_lg'])) {
            $pdf->Ln(10);
            $pdf->Cell(0, 10, 'Information of Legal Guardian', 0, 1, 'C');
            $pdf->Ln(10);

            $pdf->Cell(60, 10, 'First Name', 1, 0);
            $pdf->Cell(130, 10, $person['first_name_lg'], 1, 1);

            $pdf->Cell(60, 10, 'Last Name', 1, 0);
            $pdf->Cell(130, 10, $person['last_name_lg'], 1, 1);

            $pdf->Cell(60, 10, 'Address', 1, 0);
            $pdf->Cell(130, 10, $person['address_lg'], 1, 1);

            $pdf->Cell(60, 10, 'Postal Code', 1, 0);
            $pdf->Cell(130, 10, $person['postal_code_lg'], 1, 1);

            $pdf->Cell(60, 10, 'Town', 1, 0);
            $pdf->Cell(130, 10, $person['town_lg'], 1, 1);

            $pdf->Cell(60, 10, 'Phone Number', 1, 0);
            $pdf->Cell(130, 10, $person['mobile_lg'], 1, 1);

            $pdf->Cell(60, 10, 'Email Address', 1, 0);
            $pdf->Cell(130, 10, $person['email_lg'], 1, 1);

            $pdf->Cell(60, 10, 'Gender', 1, 0);
            $pdf->Cell(130, 10, $person['gender_lg'], 1, 1);
        }

        // Remarks/Wishes
        $pdf->Ln(10);
        $pdf->Cell(60, 10, 'Remarks/Wishes', 1, 0);
        $pdf->MultiCell(130, 10, $person['wishes'], 1, 'L', 0, 1);
    }


    // Output PDF as a string
    $pdfContent = $pdf->Output('', 'S');

    // Configure PHPMailer
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'mail.gmx.net';
    $mail->SMTPAuth   = true;
    $mail->Username   = MAIL_ADDRESS_SENDER;
    $mail->Password   = MAIL_PASSWORD_SENDER;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    //TODO put sensible things in subject, body, as file name and as first cell

    //Mail to Luka
    $mail->clearAddresses(); // Clear previous recipients
    $mail->setFrom(MAIL_ADDRESS_SENDER, 'Your Website');
    $mail->addAddress(MAIL_ADDRESS_RECEIVER);
    $mail->Subject = 'New Form filled out';
    $mail->Body    = 'A new Form has been filled. Find it attached as a PDF.';
    $mail->addStringAttachment($pdfContent, 'personal_information.pdf');

    $mail->send();

    //Mail to persons filling out the Form
    $allEmails = [];

    foreach ($data as $person) {
        // Add student's email
        if (!empty($person['email'])) {
            $allEmails[] = $person['email'];
        }
        // Add legal guardian's email
        if (!empty($person['email_lg'])) {
            $allEmails[] = $person['email_lg'];
        }
    }

    // Remove duplicate email addresses
    $allEmails = array_unique($allEmails);

    // Send a single email with BCC to all addresses
    $mail->clearAddresses(); // Clear previous recipients
    $mail->setFrom(MAIL_ADDRESS_SENDER, 'Tabbi Cat Trips');
    $mail->Subject = 'Information from Tabbi Cat Trips';
    $mail->Body = "Hello,\n\nYou can find the personal information that you/someone from your group provided attached as a PDF. \n\nPlease do not reply to this email. If you have further questions or encounter any issues, contact us at tabicat.info@gmail.com.";
    $mail->addStringAttachment($pdfContent, 'personal_information.pdf');

    // Add all emails to BCC
    foreach ($allEmails as $email) {
        $mail->addBCC($email);
    }

    // Send the email
    $mail->send();

            echo json_encode(['success' => true, 'message' => 'PDF sent successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function debug_to_console($data) {
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

?>