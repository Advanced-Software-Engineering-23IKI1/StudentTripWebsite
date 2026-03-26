<?php
require_once 'shared_mail_logic.php';
init_classes();
$debug = false;
init_debug($debug);

try {
    // Get JSON input
    $data = json_decode(file_get_contents('php://input'), true);

    validate_json($data);

    $title = 'Contact Form of ' . $data['name'];
    $pdf = create_pdf_base($title);

    // Title
    pdf_section_head($pdf, 'Personal Information of ' . $data['name']);

    // Personal Information
    pdf_row($pdf, 'Name', $data['name']);
    pdf_row($pdf, 'Email', $data['email']);
    pdf_row($pdf, 'Phone number', $data['phone']);

    // Message
    $pdf->Ln(10);
    pdf_row($pdf, 'Message', $data['message'], true);

    // Output PDF as a string
    $pdfContent = $pdf->Output('', 'S');

    // Configure PHPMailer
    $mail = mailer_base();
    //Mail to Luka
    $subject = 'New Contact Form';
    $body = 'A new contact form has been filled. Find it attached as a PDF.';
    $sanitized_name = preg_replace('/[^a-zA-Z0-9_-]/', '_', $data['name']);


    $mail = prepare_mail_to_self($mail, $subject, $body, $pdfContent, 'personal_information_' . $sanitized_name . '.pdf');
    $mail->send();

    echo json_encode(['success' => true, 'message' => 'PDF sent successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>
