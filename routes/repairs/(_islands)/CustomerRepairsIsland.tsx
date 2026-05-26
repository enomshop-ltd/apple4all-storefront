import { useEffect, useState } from "preact/hooks";

interface CustomerRepairsIslandProps {
  backendUrl: string;
}

export default function CustomerRepairsIsland({
  backendUrl,
}: CustomerRepairsIslandProps) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/store/customers/me/repairs`,
          {
            method: "GET",
            credentials: "include", // Requires the customer to be logged in and session active
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("You must be logged in to view your repairs.");
          }
          throw new Error("Failed to load your repairs.");
        }

        const data = await response.json();
        setTickets(data.repair_tickets || []);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRepairs();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-lg">
        <h3 className="font-bold mb-2">Error Loading Repairs</h3>
        <p>{error}</p>
        <a
          href="/login"
          className="inline-block mt-4 text-sm font-medium text-blue-600 hover:underline"
        >
          Go to Login
        </a>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center text-gray-500">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-12 h-12 mx-auto text-gray-400 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No repairs found
        </h3>
        <p className="mb-4">You have not booked any device for repair yet.</p>
        <a href="/repairs/book" className="text-blue-600 hover:underline">
          Book your first repair
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ticket / Device
            </th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Issue
            </th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-4 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tickets.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4">
                <div className="font-mono text-sm font-medium text-blue-600">
                  {t.ticket_number}
                </div>
                <div className="text-sm text-gray-900">
                  {t.device?.model_name || "Unknown Device"}
                </div>
                <div className="text-xs text-gray-500 uppercase">
                  {t.device?.brand || ""}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {t.status.replace(/_/g, " ")}
                </span>
                {t.status === "awaiting_approval" &&
                  !t.is_approved &&
                  t.terms_accepted && (
                    <div className="mt-1 text-xs text-orange-600 font-medium">
                      Needs Approval
                    </div>
                  )}
                {!t.terms_accepted && (
                  <div className="mt-1 text-xs text-red-600 font-medium">
                    Terms Pending
                  </div>
                )}
              </td>
              <td
                className="px-6 py-4 text-sm text-gray-500 line-clamp-2 max-w-[200px]"
                title={t.issue_description}
              >
                {t.issue_description}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {new Date(t.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                <a
                  href={`/repairs/track?token=${t.approval_token || t.ticket_number}`}
                  className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded"
                >
                  View details
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
