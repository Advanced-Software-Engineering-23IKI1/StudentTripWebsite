<?php
function init_classes() {
    //loads secrets
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

}

function init_debugging($debug) {
    if ($debug) {
        // Enable error reporting for debugging
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
    } else {
        // Disable error display
        ini_set('display_errors', 0);
        ini_set('display_startup_errors', 0);
        error_reporting(0);
    }
}

function validate_json($data) {
    if (!$data || json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
        exit;
    }
}

function create_pdf_base($title) {
    $pdf = new TCPDF();
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('Tabi Cat Trips');
    $pdf->SetTitle($title);
    $pdf->setPrintHeader(false);
    $pdf->setPrintFooter(false);
    $pdf->SetFont('dejavusans', '', 12); // DejaVu Sans is built-in and supports Unicode
    $pdf->AddPage();
    return $pdf;
}

function pdf_section_head($pdf, $label, $space_before = false)  {
    if ($space_before)  {
        $pdf->Ln(10);
    }
    $pdf->Cell(0, 10, $label, 0, 1, 'C');
    $pdf->Ln(10);
}

function pdf_row($pdf, $label, $value, $multi = false) {
    $pdf->Cell(60, 10, $label, 1, 0);
    if ($multi) {
        $pdf->MultiCell(130, 10, $value, 1, 'L', 0, 1);
    } else {
        $pdf->Cell(130, 10, $value, 1, 1);
    }
}

function general_personal_info($pdf, $person, $suffix = '')    {
    pdf_row($pdf, 'First Name', $person['first_name']);
    pdf_row($pdf, 'Last Name', $person['last_name']);
    pdf_row($pdf, 'Address', $person['address']);
    pdf_row($pdf, 'Postal Code', $person['postal_code']);
    pdf_row($pdf, 'Town', $person['town']);
    pdf_row($pdf, 'Phone Number', $person['mobile']);
    pdf_row($pdf, 'Email Address', $person['email']);
    pdf_row($pdf, 'Gender', $person['gender']);
}

function mailer_base() {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'mail.gmx.net';
    $mail->SMTPAuth   = true;
    $mail->Username   = MAIL_ADDRESS_SENDER;
    $mail->Password   = MAIL_PASSWORD_SENDER;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    return $mail;
}

function prepare_mail_to_self($mail, $subject, $body, $pdfContent, $pdfName) {
    $shownName = 'Your Website';
    $mail = prepare_mail($mail, $shownName, $subject, $body, $pdfContent, $pdfName);
    $mail->addAddress(MAIL_ADDRESS_RECEIVER);
    return $mail;
}

function prepare_mail($mail, $fromShown, $subject, $body, $pdfContent, $pdfName)  {
    $mail->clearAddresses(); // Clear previous recipients
    $mail->setFrom(MAIL_ADDRESS_SENDER, $fromShown);
    $mail->Subject = $subject;
    $mail->Body    = $body;
    $mail->addStringAttachment($pdfContent, $pdfName);
    return $mail;
}

?>