import { useEffect, useState } from "preact/hooks";

export default function CustomerRepairsIsland() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const response = await fetch(`/api/account/repairs`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.warn("[CustomerRepairsIsland] Session expired. Redirecting...");
            if (typeof window !== "undefined") {
              window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
              return;
            }
            throw new Error("You must be logged in to view your repairs.");
          }
          const errText = await response.text();
          console.error("Failed to load repairs:", errText);
          throw new Error("Failed to load your repairs.");
        }

        const data = await response.json();
        const repairs = data.repair_tickets || data.repairs || [];
        setTickets(repairs);
      } catch (err: any) {
        if (err.message !== "You must be logged in to view your repairs.") {
           console.error("[CustomerRepairsIsland] Fetch error:", err);
        }
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepairs();
  }, []);

  if (loading) {
    return (
      <div class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="p-6 bg-red-50 border border-red-200 text-red-600 rounded-lg">
        <h3 class="font-bold mb-2">Error Loading Repairs</h3>
        <p>{error}</p>
        <a href="/login" class="inline-block mt-4 text-sm font-medium text-slate-900 hover:underline">
          Go to Login
        </a>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div class="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center text-slate-500">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-12 h-12 mx-auto text-slate-400 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 class="text-lg font-medium text-slate-900 mb-1">No repairs found</h3>
        <p class="mb-4">You have not booked any device for repair yet.</p>
        <a href="/repairs/book" class="text-slate-900 hover:underline font-medium">Book your first repair</a>
      </div>
    );
  }

  return (
    <div class="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-slate-200 text-left">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Ticket / Device</th>
            <th class="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Issue</th>
            <th class="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
            <th class="px-6 py-4 px-6 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          {tickets.map((t) => (
            <tr key={t.id} class="hover:bg-slate-50 transition">
              <td class="px-6 py-4">
                <div class="font-mono text-sm font-medium text-slate-900">{t.ticket_number}</div>
                <div class="text-sm text-slate-800">{t.device?.model_name || "Unknown Device"}</div>
                <div class="text-xs text-slate-500 uppercase">{t.device?.brand || ""}</div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize border border-slate-200">
                  {t.status.replace(/_/g, " ")}
                </span>
                {t.status === "awaiting_approval" && !t.is_approved && t.terms_accepted && (
                  <div class="mt-1 text-xs text-amber-600 font-medium">Needs Approval</div>
                )}
                {!t.terms_accepted && (
                  <div class="mt-1 text-xs text-red-600 font-medium">Terms Pending</div>
                )}
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 line-clamp-2 max-w-[200px]" title={t.issue_description}>
                {t.issue_description}
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                {new Date(t.created_at).toLocaleDateString()}
              </td>
              <td class="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                <a href={`/repairs/track?token=${t.approval_token || t.ticket_number}`} class="text-slate-900 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors">
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