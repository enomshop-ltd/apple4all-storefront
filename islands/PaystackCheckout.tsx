import { Component } from "preact";

interface PaystackCheckoutProps {
  accessCode: string;
  onSuccess?: (transaction: any) => void;
  onCancel?: () => void;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  autoTrigger?: boolean;
}

export class PaystackCheckout extends Component<PaystackCheckoutProps> {
  override componentDidMount() {
    // Load Paystack script dynamically if it doesn't exist
    if (!document.querySelector('script[src="https://js.paystack.co/v2/inline.js"]')) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v2/inline.js";
      script.async = true;
      script.onload = () => {
        if (this.props.autoTrigger && this.props.accessCode) {
          this.payWithPaystack(new Event('autoclick'));
        }
      };
      document.body.appendChild(script);
    } else if (this.props.autoTrigger && this.props.accessCode) {
      // Small timeout to ensure component is fully mounted
      setTimeout(() => this.payWithPaystack(new Event('autoclick')), 100);
    }
  }

  payWithPaystack = (e: Event) => {
    e.preventDefault();
    
    if (!this.props.accessCode) {
      alert("Payment session not initialized properly. Missing access code.");
      return;
    }

    // @ts-ignore
    const paystack = new window.PaystackPop();
    
    paystack.resumeTransaction(this.props.accessCode, {
      onSuccess: (transaction: any) => {
        if (this.props.onSuccess) {
          this.props.onSuccess(transaction);
        } else {
          alert(`Payment successful! Reference: ${transaction.reference}`);
        }
      },
      onCancel: () => {
        if (this.props.onCancel) {
          this.props.onCancel();
        } else {
          alert("Payment window closed.");
        }
      },
    });
  };

  render() {
    const { buttonText = "Pay Now", className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", disabled = false } = this.props;
    
    return (
      <button 
        class={`paystack-checkout-btn ${className}`}
        onClick={this.payWithPaystack}
        disabled={disabled}
      >
        {buttonText}
      </button>
    );
  }
}

export default PaystackCheckout;
