<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Process form data and send email

    $name = filter_input(INPUT_POST, "fullName", FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, "mobile", FILTER_SANITIZE_STRING);
    $subject = filter_input(INPUT_POST, "subject", FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, "message", FILTER_SANITIZE_STRING);

    // Check for empty fields
    $errorResponse = array();

    if (empty($name)) {
        $errorResponse['fullName'] = 'This field is required';
    }

    if (empty($email)) {
        $errorResponse['email'] = 'This field is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errorResponse['email'] = 'Invalid email address';
    }

    if (empty($phone)) {
        $errorResponse['mobile'] = 'This field is required';
    } elseif (!preg_match('/^(0\d{10}|[1-9]\d{9})$/', $phone)) {
        $errorResponse['mobile'] = 'Invalid phone number';
    }
    
  

    // Validate subject
    $subjectPattern = '/^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>]+$/';
    if (empty($subject) || !preg_match($subjectPattern, $subject) || strlen($subject) > 150) {
        $errorResponse['subject'] = 'Subject should not be empty and with a maximum length of 100 characters';
    }

    // Validate message
    $messagePattern = '/^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>]+$/';
    if (empty($message) || !preg_match($messagePattern, $message) || strlen($message) > 1500) {
        $errorResponse['message'] = 'Message should not be empty and with a maximum length of 1500 characters';
    }


    if (!empty($errorResponse)) {
        http_response_code(400); // Bad Request
        header('Content-Type: application/json');
        echo json_encode(array('error' => $errorResponse));
        exit;
    }

    $to = "d.hiteshyadav@gmail.com"; // Replace with your email address
    $headers = "From: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

    // Construct HTML email message
    $htmlMessage = "
        <html>
        <head>
            <title>$name</title>
        </head>
        <body>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Subject:</strong> $subject</p>
            <p><strong>Message:</strong> $message</p>
        </body>
        </html>
    ";

    // Send HTML email
    $success = mail($to, $subject, $htmlMessage, $headers);

    // Output result
    echo $success ? 'We have Received Your Message Successfully.' : 'Oops! Something went wrong';
} else {
    // Handle non-POST requests as needed
}
?>
