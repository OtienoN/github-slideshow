<?php
// Eden Royal Prints - Order Form Handler
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
$to_email = 'orders@edenroyalprints.co.ke';
$from_email = 'noreply@edenroyalprints.co.ke';
$company_name = 'Eden Royal Prints and Color Solutions';
$upload_dir = '../uploads/orders/';
$max_file_size = 10 * 1024 * 1024; // 10MB
$allowed_extensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'ai', 'psd'];

// Input validation and sanitization
function validateInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function generateOrderId() {
    return 'ER' . date('Y') . strtoupper(substr(md5(time() . rand()), 0, 6));
}

// Get form data
$name = validateInput($_POST['name'] ?? '');
$email = validateInput($_POST['email'] ?? '');
$phone = validateInput($_POST['phone'] ?? '');
$location = validateInput($_POST['location'] ?? '');
$service = validateInput($_POST['service'] ?? '');
$specific_service = validateInput($_POST['specific_service'] ?? '');
$project_title = validateInput($_POST['project_title'] ?? '');
$description = validateInput($_POST['description'] ?? '');
$quantity = validateInput($_POST['quantity'] ?? '');
$size = validateInput($_POST['size'] ?? '');
$colors = validateInput($_POST['colors'] ?? '');
$file_description = validateInput($_POST['file_description'] ?? '');
$deadline = validateInput($_POST['deadline'] ?? '');
$urgency = validateInput($_POST['urgency'] ?? 'standard');
$delivery_method = validateInput($_POST['delivery_method'] ?? 'pickup');
$budget = validateInput($_POST['budget'] ?? '');
$special_instructions = validateInput($_POST['special_instructions'] ?? '');
$newsletter = isset($_POST['newsletter']) ? 'Yes' : 'No';

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

if (empty($phone)) {
    $errors[] = 'Phone number is required';
}

if (empty($service)) {
    $errors[] = 'Service category is required';
}

if (empty($description)) {
    $errors[] = 'Project description is required';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Validation failed', 'errors' => $errors]);
    exit;
}

// Rate limiting
session_start();
$current_time = time();
$rate_limit_window = 600; // 10 minutes
$max_submissions = 2;

if (!isset($_SESSION['order_submissions'])) {
    $_SESSION['order_submissions'] = [];
}

$_SESSION['order_submissions'] = array_filter(
    $_SESSION['order_submissions'],
    function($timestamp) use ($current_time, $rate_limit_window) {
        return ($current_time - $timestamp) < $rate_limit_window;
    }
);

if (count($_SESSION['order_submissions']) >= $max_submissions) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many order submissions. Please wait before trying again.']);
    exit;
}

// Handle file uploads
$uploaded_files = [];
$upload_errors = [];

if (isset($_FILES['files']) && !empty($_FILES['files']['name'][0])) {
    // Create upload directory if it doesn't exist
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    $order_id = generateOrderId();
    $order_upload_dir = $upload_dir . $order_id . '/';
    
    if (!is_dir($order_upload_dir)) {
        mkdir($order_upload_dir, 0755, true);
    }
    
    $files = $_FILES['files'];
    $file_count = count($files['name']);
    
    for ($i = 0; $i < $file_count; $i++) {
        if ($files['error'][$i] === UPLOAD_ERR_OK) {
            $file_name = $files['name'][$i];
            $file_size = $files['size'][$i];
            $file_tmp = $files['tmp_name'][$i];
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
            
            // Validate file
            if ($file_size > $max_file_size) {
                $upload_errors[] = "File '{$file_name}' is too large (max 10MB)";
                continue;
            }
            
            if (!in_array($file_ext, $allowed_extensions)) {
                $upload_errors[] = "File '{$file_name}' has invalid extension";
                continue;
            }
            
            // Generate unique filename
            $unique_name = time() . '_' . $i . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file_name);
            $upload_path = $order_upload_dir . $unique_name;
            
            if (move_uploaded_file($file_tmp, $upload_path)) {
                $uploaded_files[] = [
                    'original_name' => $file_name,
                    'stored_name' => $unique_name,
                    'size' => $file_size,
                    'path' => $upload_path
                ];
            } else {
                $upload_errors[] = "Failed to upload '{$file_name}'";
            }
        } elseif ($files['error'][$i] !== UPLOAD_ERR_NO_FILE) {
            $upload_errors[] = "Upload error for '{$files['name'][$i]}'";
        }
    }
} else {
    $order_id = generateOrderId();
}

// Service categories mapping
$service_categories = [
    'design-printing' => '🎨 Design & Printing',
    'government-services' => '🏛️ Government & eCitizen Services',
    'ict-academic' => '💻 ICT & Academic Services',
    'technical-repair' => '🔧 Technical & Repair Services',
    'digital-services' => '📷 Digital Services',
    'cyber-services' => '🌐 Cyber & Online Services'
];

$urgency_levels = [
    'standard' => 'Standard (2-3 days)',
    'urgent' => 'Urgent (24 hours) - +30% fee',
    'express' => 'Express (Same day) - +50% fee'
];

$delivery_methods = [
    'pickup' => 'Pick up from our office (Free)',
    'delivery-nairobi' => 'Delivery within Nairobi (KSh 200-500)',
    'delivery-outskirts' => 'Delivery outside Nairobi (Quote on request)',
    'courier' => 'Courier service (Customer pays)'
];

// Prepare email content
$email_subject = '[New Order] ' . $order_id . ' - ' . ($service_categories[$service] ?? 'Unknown Service') . ' - ' . $name;

$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #1e3a8a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .order-id { background: #f59e0b; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin: 10px 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .section { margin-bottom: 25px; padding: 15px; background: white; border-radius: 6px; border-left: 4px solid #1e40af; }
        .section-title { color: #1e40af; font-weight: bold; font-size: 16px; margin-bottom: 10px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #374151; width: 140px; display: inline-block; }
        .value { color: #1f2937; }
        .files-list { background: #f3f4f6; padding: 10px; border-radius: 4px; margin-top: 10px; }
        .file-item { padding: 5px 0; border-bottom: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        .urgent { background: #fef3c7; border-left-color: #f59e0b; }
        .express { background: #fee2e2; border-left-color: #ef4444; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Order Received</h2>
            <p>{$company_name}</p>
            <div class='order-id'>Order ID: {$order_id}</div>
        </div>
        
        <div class='content'>
            <div class='section'>
                <div class='section-title'>Customer Information</div>
                <div class='field'>
                    <span class='label'>Name:</span>
                    <span class='value'>{$name}</span>
                </div>
                <div class='field'>
                    <span class='label'>Email:</span>
                    <span class='value'>{$email}</span>
                </div>
                <div class='field'>
                    <span class='label'>Phone:</span>
                    <span class='value'>{$phone}</span>
                </div>
                <div class='field'>
                    <span class='label'>Location:</span>
                    <span class='value'>" . (!empty($location) ? $location : 'Not provided') . "</span>
                </div>
            </div>
            
            <div class='section'>
                <div class='section-title'>Service Details</div>
                <div class='field'>
                    <span class='label'>Category:</span>
                    <span class='value'>" . ($service_categories[$service] ?? $service) . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Specific Service:</span>
                    <span class='value'>" . (!empty($specific_service) ? str_replace('-', ' ', ucwords($specific_service, '-')) : 'Not specified') . "</span>
                </div>
            </div>
            
            <div class='section'>
                <div class='section-title'>Project Details</div>
                <div class='field'>
                    <span class='label'>Project Title:</span>
                    <span class='value'>" . (!empty($project_title) ? $project_title : 'Not provided') . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Description:</span>
                    <div class='value' style='margin-top: 5px; padding: 10px; background: #f9fafb; border-radius: 4px;'>" . nl2br($description) . "</div>
                </div>
                <div class='field'>
                    <span class='label'>Quantity:</span>
                    <span class='value'>" . (!empty($quantity) ? $quantity : 'Not specified') . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Size/Dimensions:</span>
                    <span class='value'>" . (!empty($size) ? $size : 'Not specified') . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Colors:</span>
                    <span class='value'>" . (!empty($colors) ? $colors : 'Not specified') . "</span>
                </div>
            </div>";

if (!empty($uploaded_files)) {
    $email_body .= "
            <div class='section'>
                <div class='section-title'>Uploaded Files</div>
                <div class='files-list'>";
    
    foreach ($uploaded_files as $file) {
        $file_size_mb = round($file['size'] / 1024 / 1024, 2);
        $email_body .= "
                    <div class='file-item'>
                        <strong>{$file['original_name']}</strong> ({$file_size_mb} MB)
                    </div>";
    }
    
    $email_body .= "
                </div>";
    
    if (!empty($file_description)) {
        $email_body .= "
                <div class='field' style='margin-top: 10px;'>
                    <span class='label'>File Description:</span>
                    <div class='value'>" . nl2br($file_description) . "</div>
                </div>";
    }
    
    $email_body .= "
            </div>";
}

if (!empty($upload_errors)) {
    $email_body .= "
            <div class='section' style='border-left-color: #ef4444; background: #fef2f2;'>
                <div class='section-title' style='color: #ef4444;'>File Upload Errors</div>";
    
    foreach ($upload_errors as $error) {
        $email_body .= "<div class='value' style='color: #dc2626;'>• {$error}</div>";
    }
    
    $email_body .= "
            </div>";
}

$urgency_class = $urgency === 'express' ? 'express' : ($urgency === 'urgent' ? 'urgent' : '');

$email_body .= "
            <div class='section {$urgency_class}'>
                <div class='section-title'>Timeline & Delivery</div>
                <div class='field'>
                    <span class='label'>Deadline:</span>
                    <span class='value'>" . (!empty($deadline) ? date('Y-m-d', strtotime($deadline)) : 'Not specified') . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Urgency:</span>
                    <span class='value'>" . ($urgency_levels[$urgency] ?? $urgency) . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Delivery Method:</span>
                    <span class='value'>" . ($delivery_methods[$delivery_method] ?? $delivery_method) . "</span>
                </div>
            </div>
            
            <div class='section'>
                <div class='section-title'>Additional Information</div>
                <div class='field'>
                    <span class='label'>Budget Range:</span>
                    <span class='value'>" . (!empty($budget) ? str_replace('-', ' - ', $budget) : 'Not specified') . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Special Instructions:</span>
                    <div class='value'>" . (!empty($special_instructions) ? nl2br($special_instructions) : 'None') . "</div>
                </div>
                <div class='field'>
                    <span class='label'>Newsletter Subscription:</span>
                    <span class='value'>{$newsletter}</span>
                </div>
            </div>
            
            <div class='section'>
                <div class='section-title'>Submission Details</div>
                <div class='field'>
                    <span class='label'>Order ID:</span>
                    <span class='value'>{$order_id}</span>
                </div>
                <div class='field'>
                    <span class='label'>Submitted:</span>
                    <span class='value'>" . date('Y-m-d H:i:s') . "</span>
                </div>
                <div class='field'>
                    <span class='label'>IP Address:</span>
                    <span class='value'>" . $_SERVER['REMOTE_ADDR'] . "</span>
                </div>
            </div>
        </div>
        
        <div class='footer'>
            <p>This order was submitted through the {$company_name} website.</p>
            <p>Please respond to the customer within 2 hours during business hours.</p>
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
    'X-Priority: ' . ($urgency === 'express' ? '1' : ($urgency === 'urgent' ? '2' : '3')),
    'X-MSMail-Priority: ' . ($urgency === 'express' ? 'High' : ($urgency === 'urgent' ? 'High' : 'Normal'))
];

// Attempt to send email
$mail_sent = false;

if (function_exists('mail')) {
    $mail_sent = mail($to_email, $email_subject, $email_body, implode("\r\n", $headers));
}

// Save order to database/file
$order_data = [
    'order_id' => $order_id,
    'timestamp' => date('Y-m-d H:i:s'),
    'customer' => [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'location' => $location
    ],
    'service' => [
        'category' => $service,
        'specific' => $specific_service,
        'project_title' => $project_title,
        'description' => $description,
        'quantity' => $quantity,
        'size' => $size,
        'colors' => $colors
    ],
    'files' => $uploaded_files,
    'file_description' => $file_description,
    'upload_errors' => $upload_errors,
    'timeline' => [
        'deadline' => $deadline,
        'urgency' => $urgency,
        'delivery_method' => $delivery_method
    ],
    'additional' => [
        'budget' => $budget,
        'special_instructions' => $special_instructions,
        'newsletter' => $newsletter
    ],
    'meta' => [
        'ip' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
        'mail_sent' => $mail_sent
    ]
];

// Save to file
$orders_dir = '../data/orders/';
if (!is_dir($orders_dir)) {
    mkdir($orders_dir, 0755, true);
}

file_put_contents(
    $orders_dir . $order_id . '.json',
    json_encode($order_data, JSON_PRETTY_PRINT),
    LOCK_EX
);

// Customer confirmation email
$customer_subject = "Order Confirmation - {$order_id} - {$company_name}";
$customer_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #1e3a8a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .order-id { background: #f59e0b; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin: 10px 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .section { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #1e40af; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        .cta { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 5px; }
        .contact-info { background: #e0f2fe; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .status { background: #dcfce7; color: #166534; padding: 8px 12px; border-radius: 6px; font-weight: bold; display: inline-block; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>{$company_name}</h2>
            <p>Order Confirmation</p>
            <div class='order-id'>Order ID: {$order_id}</div>
        </div>
        
        <div class='content'>
            <p>Dear {$name},</p>
            
            <p>Thank you for choosing Eden Royal Prints! We have successfully received your order and are excited to bring your project to life.</p>
            
            <div class='section'>
                <h3 style='color: #1e40af; margin-bottom: 10px;'>Order Status</h3>
                <div class='status'>✓ Order Received</div>
                <p style='margin-top: 10px;'>Your order has been submitted and is now being reviewed by our team. We will send you a detailed quote within 2 hours during business hours.</p>
            </div>
            
            <div class='section'>
                <h3 style='color: #1e40af; margin-bottom: 10px;'>Order Summary</h3>
                <strong>Service:</strong> " . ($service_categories[$service] ?? $service) . "<br>
                <strong>Project:</strong> " . (!empty($project_title) ? $project_title : 'Custom Project') . "<br>
                <strong>Urgency:</strong> " . ($urgency_levels[$urgency] ?? $urgency) . "<br>
                <strong>Submitted:</strong> " . date('Y-m-d H:i:s') . "
            </div>
            
            <div class='section'>
                <h3 style='color: #1e40af; margin-bottom: 10px;'>What Happens Next?</h3>
                <p><strong>1. Quote Preparation:</strong> Our team will review your requirements and prepare a detailed quote.</p>
                <p><strong>2. Confirmation:</strong> We'll send you the quote via email and WhatsApp for your approval.</p>
                <p><strong>3. Production:</strong> Once approved, we'll begin working on your project immediately.</p>
                <p><strong>4. Delivery:</strong> Your order will be ready according to the timeline discussed.</p>
            </div>
            
            <p style='text-align: center;'>
                <a href='https://wa.me/254700000000?text=Hello! I have a question about my order {$order_id}' class='cta'>WhatsApp Us</a>
                <a href='tel:+254700000000' class='cta'>Call Us</a>
            </p>
            
            <div class='contact-info'>
                <strong>Need to discuss your order?</strong><br>
                📞 Phone: +254 700 000 000<br>
                📧 Email: info@edenroyalprints.co.ke<br>
                🕒 Hours: Mon-Fri 8AM-6PM, Sat 9AM-4PM<br>
                📋 Reference your Order ID: <strong>{$order_id}</strong>
            </div>
            
            <p>Thank you for choosing Eden Royal Prints. We're committed to delivering royal quality for your project!</p>
            
            <p>Best regards,<br>
            <strong>The Eden Royal Prints Team</strong></p>
        </div>
        
        <div class='footer'>
            <p>This is an automated confirmation. Please save this email for your records.</p>
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
    'X-Mailer: PHP/' . phpversion()
];

// Send customer confirmation
if (function_exists('mail')) {
    mail($email, $customer_subject, $customer_body, implode("\r\n", $customer_headers));
}

// Add to rate limiting
$_SESSION['order_submissions'][] = $current_time;

// Return success response
$response = [
    'success' => true,
    'message' => 'Your order has been submitted successfully! You will receive a quote within 2 hours during business hours.',
    'order_id' => $order_id,
    'files_uploaded' => count($uploaded_files)
];

if (!empty($upload_errors)) {
    $response['upload_warnings'] = $upload_errors;
}

echo json_encode($response);
?>