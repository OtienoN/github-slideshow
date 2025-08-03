<?php
// Eden Royal Prints - Contact Form Handler
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Configuration
$to_email = 'info@edenroyalprints.co.ke';
$from_email = 'noreply@edenroyalprints.co.ke';
$company_name = 'Eden Royal Prints and Color Solutions';

// Input validation and sanitization
function validateInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Get form data
$name = validateInput($_POST['name'] ?? '');
$email = validateInput($_POST['email'] ?? '');
$phone = validateInput($_POST['phone'] ?? '');
$subject = validateInput($_POST['subject'] ?? '');
$message = validateInput($_POST['message'] ?? '');

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!validateEmail($email)) {
    $errors[] = 'Invalid email format';
}

if (empty($subject)) {
    $errors[] = 'Subject is required';
}

if (empty($message)) {
    $errors[] = 'Message is required';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Validation failed', 'errors' => $errors]);
    exit;
}

// Rate limiting (simple implementation)
session_start();
$current_time = time();
$rate_limit_window = 300; // 5 minutes
$max_submissions = 3;

if (!isset($_SESSION['contact_submissions'])) {
    $_SESSION['contact_submissions'] = [];
}

// Clean old submissions
$_SESSION['contact_submissions'] = array_filter(
    $_SESSION['contact_submissions'],
    function($timestamp) use ($current_time, $rate_limit_window) {
        return ($current_time - $timestamp) < $rate_limit_window;
    }
);

if (count($_SESSION['contact_submissions']) >= $max_submissions) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many submissions. Please wait before trying again.']);
    exit;
}

// Prepare email content
$subject_map = [
    'printing' => 'Printing Services Inquiry',
    'government' => 'Government Services Inquiry',
    'ict' => 'ICT & Academic Services Inquiry',
    'technical' => 'Technical & Repair Services Inquiry',
    'digital' => 'Digital Services Inquiry',
    'cyber' => 'Cyber Services Inquiry',
    'quote' => 'Quote Request',
    'other' => 'General Inquiry'
];

$email_subject = '[Website Contact] ' . ($subject_map[$subject] ?? 'General Inquiry') . ' - ' . $name;

$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1e40af; }
        .value { margin-top: 5px; padding: 8px; background: white; border-radius: 4px; border: 1px solid #d1d5db; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
            <p>{$company_name}</p>
        </div>
        
        <div class='content'>
            <div class='field'>
                <div class='label'>Name:</div>
                <div class='value'>{$name}</div>
            </div>
            
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>{$email}</div>
            </div>
            
            <div class='field'>
                <div class='label'>Phone:</div>
                <div class='value'>" . (!empty($phone) ? $phone : 'Not provided') . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Subject:</div>
                <div class='value'>" . ($subject_map[$subject] ?? 'Other') . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Message:</div>
                <div class='value'>" . nl2br($message) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Submitted:</div>
                <div class='value'>" . date('Y-m-d H:i:s') . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>IP Address:</div>
                <div class='value'>" . $_SERVER['REMOTE_ADDR'] . "</div>
            </div>
        </div>
        
        <div class='footer'>
            <p>This message was sent from the {$company_name} website contact form.</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: ' . $company_name . ' Website <' . $from_email . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
    'X-Priority: 3',
    'X-MSMail-Priority: Normal'
];

// Attempt to send email
$mail_sent = false;

// Try using mail() function
if (function_exists('mail')) {
    $mail_sent = mail($to_email, $email_subject, $email_body, implode("\r\n", $headers));
}

// If mail() fails or doesn't exist, log the submission
if (!$mail_sent) {
    // Log to file as fallback
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'subject' => $subject,
        'message' => $message,
        'ip' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
    ];
    
    $log_file = '../logs/contact_submissions.log';
    $log_dir = dirname($log_file);
    
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    
    file_put_contents($log_file, json_encode($log_entry) . "\n", FILE_APPEND | LOCK_EX);
}

// Auto-reply to customer
$customer_subject = "Thank you for contacting {$company_name}";
$customer_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #1e3a8a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        .cta { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        .contact-info { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>{$company_name}</h2>
            <p>Thank you for your inquiry!</p>
        </div>
        
        <div class='content'>
            <p>Dear {$name},</p>
            
            <p>Thank you for contacting us through our website. We have received your message regarding <strong>" . ($subject_map[$subject] ?? 'your inquiry') . "</strong> and will respond within 2 hours during our business hours.</p>
            
            <p>Here's a summary of your submission:</p>
            <div class='contact-info'>
                <strong>Subject:</strong> " . ($subject_map[$subject] ?? 'Other') . "<br>
                <strong>Submitted:</strong> " . date('Y-m-d H:i:s') . "<br>
                <strong>Reference:</strong> " . strtoupper(substr(md5($email . time()), 0, 8)) . "
            </div>
            
            <p>In the meantime, feel free to:</p>
            <p style='text-align: center;'>
                <a href='https://wa.me/254700000000' class='cta'>Chat on WhatsApp</a>
                <a href='tel:+254700000000' class='cta'>Call Us Now</a>
            </p>
            
            <div class='contact-info'>
                <strong>Our Contact Information:</strong><br>
                📞 Phone: +254 700 000 000<br>
                📧 Email: info@edenroyalprints.co.ke<br>
                📍 Address: Sample Street, Nairobi, Kenya<br>
                🕒 Hours: Mon-Fri 8AM-6PM, Sat 9AM-4PM
            </div>
            
            <p>We look forward to serving you with royal quality!</p>
            
            <p>Best regards,<br>
            <strong>The Eden Royal Prints Team</strong></p>
        </div>
        
        <div class='footer'>
            <p>This is an automated response. Please do not reply to this email.</p>
            <p>&copy; 2024 {$company_name}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
";

$customer_headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: ' . $company_name . ' <' . $from_email . '>',
    'X-Mailer: PHP/' . phpversion(),
    'X-Priority: 3',
    'X-MSMail-Priority: Normal'
];

// Send auto-reply
if (function_exists('mail')) {
    mail($email, $customer_subject, $customer_body, implode("\r\n", $customer_headers));
}

// Add to rate limiting
$_SESSION['contact_submissions'][] = $current_time;

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Thank you for your message! We will respond within 2 hours during business hours.',
    'reference' => strtoupper(substr(md5($email . time()), 0, 8))
]);
?>