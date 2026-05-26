import { useEffect, useState } from "preact/hooks";

export function CustomBox() {
  const [data, setData] = useState<{
    title: string;
    description: string;
    buttonText: string;
    linkText: string;
  } | null>(null);

  useEffect(() => {
    // Mock data from a JSON string
    const mockJson = JSON.stringify({
      title: "Track Repair Status",
      description:
        "Check the status of your repair and get real-time updates with our unified tracking system.",
      buttonText: "Track Repair",
      linkText: "Track repair status",
    });

    // Simulate fetching data
    setTimeout(() => {
      setData(JSON.parse(mockJson));
    }, 500);
  }, []);

  if (!data) {
    return (
      <div class="h-full bg-[#fdf5ff] rounded-2xl p-6 flex flex-col items-center justify-center animate-pulse">
        <div class="w-12 h-12 bg-purple-200 rounded-lg mb-4"></div>
        <div class="h-6 bg-purple-200 w-3/4 rounded mb-2"></div>
        <div class="h-4 bg-purple-200 w-full rounded mb-4"></div>
      </div>
    );
  }

  return (
    <div class="h-full bg-[#fdf5ff] rounded-2xl p-6 flex flex-col border border-purple-100">
      <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-6 text-purple-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
          <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
          <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
          <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
          <path d="m10 10 4 4"></path>
          <path d="m14 10-4 4"></path>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">{data.title}</h3>
      <p class="text-sm text-gray-700 mb-8 flex-1">{data.description}</p>

      <form action="/repairs/track" method="get" class="flex flex-col gap-4">
        <input
          type="text"
          name="ticket"
          placeholder="Enter ticket number..."
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <button
          type="submit"
          class="text-sm text-center font-medium text-gray-900 underline hover:text-gray-600 transition-colors"
        >
          {data.linkText}
        </button>
      </form>
    </div>
  );
}
