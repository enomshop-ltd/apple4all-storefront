import { FileText } from "lucide-preact";

interface DownloadInvoiceButtonProps {
  orderId: string;
  variant?: "icon" | "button";
}

export default function DownloadInvoiceButton(
  { orderId, variant = "button" }: DownloadInvoiceButtonProps,
) {
  const handleDownload = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`/account/orders/${orderId}/invoice`, "_blank");
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleDownload}
        class="inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors text-gray-400 hover:bg-gray-100 hover:text-blue-600"
        title="Print / Save Invoice"
      >
        <FileText class="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-blue-600"
    >
      <FileText class="w-4 h-4" />
      Print Invoice
    </button>
  );
}
