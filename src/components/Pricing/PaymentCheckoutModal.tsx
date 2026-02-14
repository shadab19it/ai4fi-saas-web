import { useState } from "react";
import { X, CreditCard, Shield, Loader2, Check } from "lucide-react";
import { cn } from "../../services/utils";
import { formatPrice } from "./currencyConfig";

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  planName: string;
  price: number;
  currency: string;
  creditsIncluded: number;
}

export const PaymentCheckoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  planName,
  price,
  currency,
  creditsIncluded,
}: PaymentCheckoutModalProps) => {
  const [step, setStep] = useState<"review" | "processing" | "success">("review");
  const [isProcessing, setIsProcessing] = useState(false);
  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setStep("processing");
    try {
      await onConfirm();
      setStep("success");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch {
      setStep("review");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    setStep("review");
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isProcessing) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !isProcessing) handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Payment checkout"
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Checkout</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            aria-label="Close checkout"
            tabIndex={0}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Success State */}
        {step === "success" && (
          <div className="px-6 py-12 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Payment Successful!</h3>
            <p className="text-sm text-gray-500 text-center">
              {creditsIncluded} credits have been added to your account.
            </p>
          </div>
        )}

        {/* Processing State */}
        {step === "processing" && (
          <div className="px-6 py-12 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Processing Payment...</h3>
            <p className="text-sm text-gray-500">Please wait, do not close this window.</p>
          </div>
        )}

        {/* Review State */}
        {step === "review" && (
          <>
            {/* Order Summary */}
            <div className="px-6 py-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Plan</span>
                  <span className="text-sm font-semibold text-gray-900">{planName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Credits</span>
                  <span className="text-sm font-semibold text-gray-900">{creditsIncluded} credits</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Billing</span>
                  <span className="text-sm text-gray-700">Monthly</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-purple-600">
                    {formatPrice(price, currency)}
                    <span className="text-xs font-normal text-gray-400 ml-1">{currency}</span>
                  </span>
                </div>
              </div>

              {/* Payment Method Placeholder */}
              <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center">
                <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Payment gateway will be integrated here</p>
                <p className="text-xs text-gray-300 mt-1">Razorpay / Stripe / Other</p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 justify-center">
                <Shield className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs text-gray-400">Secured & encrypted payment</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-100 space-y-2">
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                aria-label={`Pay ${formatPrice(price, currency)}`}
                tabIndex={0}
                className={cn(
                  "w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
                  "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
              >
                Pay {formatPrice(price, currency)}
              </button>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                aria-label="Cancel payment"
                tabIndex={0}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
