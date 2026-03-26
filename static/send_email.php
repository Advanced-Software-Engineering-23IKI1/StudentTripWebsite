<?php
require_once 'shared_mail_logic.php';
init_classes();
$debug = false;
init_debug($debug);

try {
    // Get JSON input
    $formContent = json_decode($_POST['form_content'], true);
    $data = $formContent['formInfo'] ?? [];
    $tripInfoGeneral = $formContent['tripInfo']['otherInformation'] ?? [];
    $tripInfoActivities = $formContent['tripInfo']['activityInfo'] ?? [];
    $tripInfoExtras = $formContent['tripInfo']['extraInfo'] ?? [];

    $passport_pictures = $_FILES['files'] ?? null;

    // check if file is too big
    for ($i = 0; $i < count($passport_pictures['name']); $i++) {
        if ($passport_pictures['size'][$i] > 5 * 1024 * 1024) {
            echo json_encode([
                'success' => false,
                'message' => "File '{$passport_pictures['name'][$i]}' exceeds the 5MB limit."
            ]);
            exit;
        }
    }

    validate_json($data);

    $title = 'Your personal information';
    $pdf = create_pdf_base($title);

    // General Trip Info
    if (!empty($tripInfoGeneral)) {
        pdf_section_head($pdf, 'General Trip Information:');

        pdf_row($pdf, 'Trip type', $tripInfoGeneral['tripType']);

        if (!empty($tripInfoGeneral['date'])    {
            pdf_row($pdf, 'Date', $tripInfoGeneral['date']);
        }

        pdf_row($pdf, 'Amount of People', $tripInfoGeneral['amountPeople']);

        if (!empty($tripInfoGeneral['subTotal'])) {
            pdf_row($pdf, 'Subtotal', '£' . $tripInfoGeneral['subTotal']);
        }

        pdf_row($pdf, 'Total', '£' . $tripInfoGeneral['total']);
    }

    // Activity Info
    if (!empty($tripInfoActivities)) {
        pdf_section_head($pdf, 'Requested activities:', true);

        foreach ($tripInfoActivities as $activity)  {
        // Add all the activity Information
            pdf_row($pdf, 'Activity', $activity['description'], true);

            $pdf->Cell(130, 10, 'Amount of people, that want to do this activity:', 1, 0);
            $pdf->Cell(60, 10, $activity['amountPeople'], 1, 1);

            $pdf->Ln(5);
        }
    }

    // Info of booked extras
    if (!empty($tripInfoExtras)) {
        pdf_section_head($pdf, 'Booked extras:', true);

        foreach ($tripInfoExtras as $extra)  {
            // Add all the extra Information
            pdf_row($pdf, 'Extra', $extra['description'], true);

            $pdf->Cell(130, 10, 'Amount of people/pairs, that want this extra:', 1, 0);
            $pdf->Cell(60, 10, $extra['amountPeople'], 1, 1);

            $pdf->Ln(5);
        }
    }

    // People Pages
    foreach ($data as $person) {
    // Add a new page for each person
        $pdf->AddPage();
        // Title
        pdf_section_head($pdf, 'Personal Information of ' . $person['first_name'] . ' ' . $person['last_name']);

        // Personal Information
        general_personal_info($pdf, $person);

        //special info, that is not provided for Emergency Contact and Legal Guardian person
        pdf_row($pdf, 'Birthdate', $person['birthdate']);
        pdf_row($pdf, 'Passport Number', $person['passport_number']);
        pdf_row($pdf, 'Disability', $person['disability'], true);
        pdf_row($pdf, 'Allergies', $person['allergies'], true);

        // Emergency Contact Information
        pdf_section_head($pdf, 'Information of Emergency Contact', true);

        general_personal_info($pdf, $person, '_ec');

        // Legal Guardian Information (if provided) --> since either all or no fields are filled only checkin first name is fine
        if (!empty($person['first_name_lg'])) {
            pdf_section_head($pdf, 'Information of Legal Guardian', true);

            general_personal_info($pdf, $person, '_lg');

            $pdf->Cell(60, 10, 'First Name', 1, 0);
            $pdf->Cell(130, 10, $person['first_name_lg'], 1, 1);
        }

        // Remarks/Wishes
        $pdf->Ln(10);
        $pdf->Cell(60, 10, 'Remarks/Wishes', 1, 0);
        $pdf->MultiCell(130, 10, $person['wishes'], 1, 'L', 0, 1);
    }


    // Output PDF as a string
    $pdfContent = $pdf->Output('', 'S');

    // Configure PHPMailer
    $mail = mailer_base();

    //Mail to Luka
    $subject = 'New Form filled out';
    $body = 'A new Form has been filled. Find it attached as a PDF.';
    $pdfName = 'personal_information.pdf';
    $mail = prepare_mail_to_self($mail, $subject, $body, $pdfContent, $pdfName);

    for ($i = 0; $i < count($passport_pictures['name']); $i++) {
            $mail->addAttachment(
                $passport_pictures['tmp_name'][$i],
                $passport_pictures['name'][$i]
            );
        }

    $mail->send();

    $mail->clearAttachments();

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
    $fromShown = 'Tabi Cat Trips';
    $subject = 'Information from Tabi Cat Trips';
    $body = "Hello,\n\nYou can find the personal information that you/someone from your group provided attached as a PDF. \n\nPlease do not reply to this email. If you have further questions or encounter any issues, contact us at tabicat.info@gmail.com.";
    $pdfName = 'personal_information.pdf';
    $mail = prepare_mail($mail, $fromShown, $subject, $body, $pdfContent, $pdfName);

    // Add all emails to BCC
    foreach ($allEmails as $email) {
        $mail->addBCC($email);
    }

    // Send the email
    $mail->send();

            echo json_encode(['success' => true, 'message' => 'PDF sent successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
    error_log($e->getMessage());
}

function debug_to_console($data) {
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

?>
