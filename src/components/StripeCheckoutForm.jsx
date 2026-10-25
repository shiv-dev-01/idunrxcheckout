import { useCallback, useEffect, useRef, useState } from "react";
import {
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { buildReturnUrl } from "../utils/stripeCheckoutSession";

const EXPRESS_CHECKOUT_OPTIONS = {
  buttonHeight: 48,
  buttonType: {
    applePay: "buy",
    googlePay: "buy",
  },
  paymentMethods: {
    applePay: "auto",
    googlePay: "auto",
    link: "auto",
    amazonPay: "auto",
  },
  layout: {
    maxColumns: 2,
    maxRows: 2,
  },
};

const PAYMENT_ELEMENT_OPTIONS = {
  layout: {
    type: "accordion",
    defaultCollapsed: false,
    radios: true,
    spacedAccordionItems: true,
  },
  wallets: {
    applePay: "never",
    googlePay: "never",
    link: "never",
  },
  paymentMethodOrder: [
    "card",
    "amazon_pay",
    "klarna",
    "link",
  ],
};

/**
 * Stripe Payment Element + Express Checkout — verify payment succeeded, then parent creates order.
 */
const StripeCheckoutForm = ({
  amountInCents,
  onValidateBilling,
  onPersistCheckoutSnapshot,
  onPaymentSuccess,
  onRecreatePaymentIntent,
  disabled = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [expressAvailable, setExpressAvailable] = useState(false);
  const errorRef = useRef(null);

  useEffect(() => {
    if (errorMessage && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [errorMessage]);

  const syncPaymentIntentAmount = useCallback(async () => {
    if (!onRecreatePaymentIntent) return;
    await onRecreatePaymentIntent(amountInCents);
    await new Promise((r) => setTimeout(r, 500));
  }, [onRecreatePaymentIntent, amountInCents]);

  const confirmPayment = useCallback(async () => {
    if (!stripe || !elements) {
      throw new Error("Stripe has not loaded yet. Please try again.");
    }

    if (onRecreatePaymentIntent) {
      try {
        await syncPaymentIntentAmount();
      } catch {
        throw new Error("Failed to update payment amount. Please try again.");
      }
    }

    onPersistCheckoutSnapshot?.();

    const { error: submitError } = await elements.submit();
    if (submitError) {
      throw new Error(submitError.message || "Please check your payment details.");
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: buildReturnUrl(),
      },
      redirect: "if_required",
    });

    if (error) {
      throw new Error(error.message || "Payment failed");
    }

    if (!paymentIntent?.id || paymentIntent.status !== "succeeded") {
      throw new Error(
        paymentIntent?.status
          ? `Payment status: ${paymentIntent.status}. Please try again.`
          : "Payment confirmation failed."
      );
    }

    return paymentIntent;
  }, [
    stripe,
    elements,
    onRecreatePaymentIntent,
    syncPaymentIntentAmount,
    onPersistCheckoutSnapshot,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || disabled) return;

    const billingOk = onValidateBilling?.();
    if (billingOk === false) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const paymentIntent = await confirmPayment();
      await onPaymentSuccess(
        paymentIntent.id,
        paymentIntent.client_secret
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setIsProcessing(false);
    }
  };

  const handleExpressConfirm = async () => {
    if (!stripe || !elements || disabled || isProcessing) return;

    const billingOk = onValidateBilling?.();
    if (billingOk === false) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const paymentIntent = await confirmPayment();
      await onPaymentSuccess(
        paymentIntent.id,
        paymentIntent.client_secret
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setIsProcessing(false);
    }
  };

  const displayAmount = (amountInCents / 100).toFixed(2);
  const payDisabled = !stripe || isProcessing || disabled;

  return (
    <form onSubmit={handleSubmit} className="stripe-checkout-form">
      <div className="stripe-express-checkout">
        <ExpressCheckoutElement
          options={EXPRESS_CHECKOUT_OPTIONS}
          onReady={({ availablePaymentMethods }) => {
            setExpressAvailable(!!availablePaymentMethods);
          }}
          onClick={({ resolve }) => {
            if (disabled || isProcessing) return;
            if (onValidateBilling?.() === false) return;
            resolve();
          }}
          onConfirm={handleExpressConfirm}
        />
      </div>

      {expressAvailable && (
        <div className="stripe-express-checkout-divider" aria-hidden="true">
          <span>Or pay with card</span>
        </div>
      )}

      <PaymentElement options={PAYMENT_ELEMENT_OPTIONS} />

      {errorMessage && (
        <div ref={errorRef} className="stripe-checkout-error">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        className="apply-button stripe-checkout-submit"
        disabled={payDisabled}
        style={{ width: "100%", marginTop: "16px" }}
      >
        {isProcessing ? "Processing..." : `CHECKOUT NOW — $${displayAmount}`}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
