import { useEffect, useState } from "preact/hooks";
import { HttpTypes } from "@medusajs/types";
import {
  getOrderStatusTheme,
  getUnifiedOrderStatus,
  UnifiedOrderStatus,
} from "../lib/order-utils.ts";

interface OrderStatusBadgeProps {
  initialOrder: HttpTypes.StoreOrder;
  // How often to check for updates (default 10 seconds)
  pollIntervalMs?: number;
}

export default function OrderStatusBadge({
  initialOrder,
  pollIntervalMs = 10000,
}: OrderStatusBadgeProps) {
  // Track the core properties needed to calculate status
  const [orderState, setOrderState] = useState({
    status: initialOrder.status,
    payment_status: initialOrder.payment_status,
    fulfillment_status: initialOrder.fulfillment_status,
  });

  // Calculate the current unified status based on state
  // We cast it as HttpTypes.StoreOrder because the helper only reads these 3 properties
  const unifiedStatus = getUnifiedOrderStatus(
    orderState as HttpTypes.StoreOrder,
  );
  const themeClasses = getOrderStatusTheme(unifiedStatus);

  useEffect(() => {
    // Stop polling if the order has reached a terminal state
    const terminalStates: UnifiedOrderStatus[] = [
      "Delivered",
      "Canceled",
      "Refunded",
    ];
    if (terminalStates.includes(unifiedStatus)) {
      return;
    }

    const fetchLatestStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${initialOrder.id}/status`);
        if (res.ok) {
          const updatedData = await res.json();
          setOrderState(updatedData);
        }
      } catch (error) {
        console.error("Failed to poll order status:", error);
      }
    };

    // Set up the polling interval
    const intervalId = setInterval(fetchLatestStatus, pollIntervalMs);

    // Cleanup the interval if the component unmounts
    return () => clearInterval(intervalId);
  }, [initialOrder.id, unifiedStatus, pollIntervalMs]);

  return (
    <span
      class={`inline-flex items-center px-3 py-1 text-sm font-medium border rounded-full transition-colors duration-300 ${themeClasses}`}
      title="Status updates automatically"
    >
      {/* Optional: Add a little pulsing dot if it's currently processing/pending */}
      {["Processing", "Pending Payment"].includes(unifiedStatus) && (
        <span class="flex w-2 h-2 mr-2 bg-current rounded-full animate-pulse">
        </span>
      )}
      {unifiedStatus}
    </span>
  );
}
