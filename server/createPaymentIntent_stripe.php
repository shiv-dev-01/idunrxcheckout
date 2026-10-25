<?php
/**
 * idunrx — create PaymentIntent (deploy to panel.whitelabelmd.com/idunrx/api/createPaymentIntent_stripe)
 * Mirrors server/index.js logic. Requires Stripe PHP SDK: composer require stripe/stripe-php
 *
 * POST JSON: email, phone, coupon, firstName, lastName, address, address2,
 *   city, state, zip, productName, sku, amount (cents), currency, productId
 * Returns: { clientSecret: "..." }
 */

require_once __DIR__ . '/stripePaymentIntentHelpers.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/../../../vendor/autoload.php';

// Set STRIPE_SECRET_KEY in the server environment. Do not commit the key.
$stripeSecretKey = getenv('STRIPE_SECRET_KEY') ?: '';
if ($stripeSecretKey === '') {
    http_response_code(500);
    echo json_encode(['error' => 'Stripe is not configured']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$input = idunrx_normalize_payment_intent_input($input ?? []);
$email = $input['email'] ?? null;
$amount = isset($input['amount']) ? (int) $input['amount'] : null;
$currency = strtolower($input['currency'] ?? 'usd');
$productName = $input['productName'] ?? '';
$sku = $input['sku'] ?? '';
$productId = $input['productId'] ?? '';

if (!$email || $amount === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: email and amount are required']);
    exit;
}

$amountInCents = max(50, (int) floor($amount));
if ($amountInCents < 50 || $amountInCents > 10000000) {
    http_response_code(400);
    echo json_encode(['error' => "Invalid amount: {$amountInCents} cents"]);
    exit;
}

try {
    \Stripe\Stripe::setApiKey($stripeSecretKey);

    $customerName = trim(
        idunrx_meta($input['firstName'] ?? '') . ' ' . idunrx_meta($input['lastName'] ?? '')
    );
    $customerParams = ['email' => $email];
    if ($customerName !== '') {
        $customerParams['name'] = $customerName;
    }
    $phone = idunrx_meta($input['phone'] ?? '');
    if ($phone !== '') {
        $customerParams['phone'] = $phone;
    }

    $customers = \Stripe\Customer::all(['email' => $email, 'limit' => 1]);
    $customer = count($customers->data) > 0
        ? \Stripe\Customer::update($customers->data[0]->id, $customerParams)
        : \Stripe\Customer::create($customerParams);

    $metadata = idunrx_build_payment_intent_metadata($input);
    $shipping = idunrx_build_shipping($input);

    $piParams = [
        'amount' => $amountInCents,
        'currency' => $currency,
        'customer' => $customer->id,
        // Dynamic payment methods — eligible methods come from Stripe Dashboard settings.
        'automatic_payment_methods' => ['enabled' => true],
        'metadata' => $metadata,
        'receipt_email' => $email,
        'description' => $productName ? "{$productName}" . ($sku ? " ({$sku})" : '') : null,
    ];
    if ($shipping !== null) {
        $piParams['shipping'] = $shipping;
    }

    $paymentIntent = \Stripe\PaymentIntent::create($piParams);

    echo json_encode(['clientSecret' => $paymentIntent->client_secret]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
