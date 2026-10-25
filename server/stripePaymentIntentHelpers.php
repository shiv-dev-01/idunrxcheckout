<?php

const IDUNRX_META_VALUE_MAX = 500;

function idunrx_meta($value) {
    return substr(trim((string) ($value ?? '')), 0, IDUNRX_META_VALUE_MAX);
}

/** Accept camelCase (frontend) and snake_case (panel order API) field names. */
function idunrx_normalize_payment_intent_input(array $input) {
    $aliases = [
        'first_name' => 'firstName',
        'last_name' => 'lastName',
        'city_name' => 'city',
        'state_name' => 'state',
        'zip_code' => 'zip',
        'promo_codes' => 'promoCode',
    ];
    foreach ($aliases as $from => $to) {
        if (empty($input[$to]) && !empty($input[$from])) {
            $input[$to] = $input[$from];
        }
    }
    if (empty($input['address']) && !empty($input['addressLine1'])) {
        $input['address'] = $input['addressLine1'];
    }
    return $input;
}

function idunrx_build_payment_intent_metadata(array $input) {
    $input = idunrx_normalize_payment_intent_input($input);
    $line1 = idunrx_meta($input['address'] ?? '');
    $line2 = idunrx_meta($input['address2'] ?? '');
    $city = idunrx_meta($input['city'] ?? '');
    $state = idunrx_meta($input['state'] ?? '');
    $zip = idunrx_meta($input['zip'] ?? '');
    $parts = array_filter([$line1, $line2, $city, $state, $zip]);
    $fullAddress = implode(', ', $parts);

    return [
        'email' => idunrx_meta($input['email'] ?? ''),
        'phone' => idunrx_meta($input['phone'] ?? ''),
        'promoCode' => idunrx_meta($input['promoCode'] ?? $input['coupon'] ?? ''),
        'firstName' => idunrx_meta($input['firstName'] ?? ''),
        'lastName' => idunrx_meta($input['lastName'] ?? ''),
        'address' => idunrx_meta($fullAddress ?: $line1),
        'addressLine1' => $line1,
        'addressLine2' => $line2,
        'city' => $city,
        'state' => $state,
        'zip' => $zip,
        'productName' => idunrx_meta($input['productName'] ?? ''),
        'sku' => idunrx_meta($input['sku'] ?? ''),
        'productId' => idunrx_meta($input['productId'] ?? ''),
    ];
}

function idunrx_build_shipping(array $input) {
    $input = idunrx_normalize_payment_intent_input($input);
    $line1 = idunrx_meta($input['address'] ?? '');
    if ($line1 === '') {
        return null;
    }

    $first = idunrx_meta($input['firstName'] ?? '');
    $last = idunrx_meta($input['lastName'] ?? '');
    $name = trim($first . ' ' . $last);
    if ($name === '') {
        $name = idunrx_meta($input['email'] ?? '');
    }

    $address = [
        'line1' => $line1,
        'country' => 'US',
    ];
    $line2 = idunrx_meta($input['address2'] ?? '');
    if ($line2 !== '') {
        $address['line2'] = $line2;
    }
    $city = idunrx_meta($input['city'] ?? '');
    if ($city !== '') {
        $address['city'] = $city;
    }
    $state = idunrx_meta($input['state'] ?? '');
    if ($state !== '') {
        $address['state'] = $state;
    }
    $zip = idunrx_meta($input['zip'] ?? '');
    if ($zip !== '') {
        $address['postal_code'] = $zip;
    }

    $shipping = [
        'name' => $name,
        'address' => $address,
    ];
    $phone = idunrx_meta($input['phone'] ?? '');
    if ($phone !== '') {
        $shipping['phone'] = $phone;
    }

    return $shipping;
}
