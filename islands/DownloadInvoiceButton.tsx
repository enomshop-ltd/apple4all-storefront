import { useState } from "preact/hooks";
import { FileText } from "lucide-preact";

interface DownloadInvoiceButtonProps {
  orderId: string;
  variant?: "icon" | "button";
}

export default function DownloadInvoiceButton({ orderId, variant = "button" }: DownloadInvoiceButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`);
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to download invoice");
      }
      
      const data = await response.json();
      
      if (data.url) {
        // Open the PDF URL in a new tab
        window.open(data.url, "_blank");
      } else {
        throw new Error("Invoice URL not found in response");
      }
    } catch (err: any) {
      console.error("Error downloading invoice:", err);
      setError(err.message || "An error occurred");
      // Hide error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <div class="relative inline-block">
        <button
          onClick={handleDownload}
          disabled={loading}
          class={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            loading ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:bg-gray-100 hover:text-blue-600"
          }`}
          title="Download Invoice"
        >
          {loading ? (
            <div class="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          ) : (
            <FileText class="w-4 h-4" />
          )}
        </button>
        {error && (
          <div class="absolute bottom-full right-0 mb-2 w-48 p-2 bg-red-100 text-red-800 text-xs rounded shadow-lg z-10">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div class="relative inline-block">
      <button
        onClick={handleDownload}
        disabled={loading}
        class={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          loading 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-blue-600"
        }`}
      >
        {loading ? (
          <div class="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        ) : (
          <FileText class="w-4 h-4" />
        )}
        {loading ? "Generating..." : "Download Invoice"}
      </button>
      {error && (
        <div class="absolute top-full right-0 mt-2 w-48 p-2 bg-red-100 text-red-800 text-xs rounded shadow-lg z-10">
          {error}
        </div>
      )}
    </div>
  );
}
