import { JSX } from "preact";

export default function ContactForm({ storeDomain }: { storeDomain: string }) {
  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const subject = formData.get("subject")?.toString() || "";
    const message = formData.get("message")?.toString() || "";

    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailto = `mailto:info@${storeDomain}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailto;
  };

  return (
    <form class="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          for="name"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all"
          placeholder="John Doe"
          required
        />
      </div>
      <div>
        <label
          for="email"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all"
          placeholder="john@example.com"
          required
        />
      </div>
      <div>
        <label
          for="subject"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all bg-white"
        >
          <option>Sales Inquiry</option>
          <option>Repair Quote</option>
          <option>Trade-In Evaluation</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label
          for="message"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all resize-none"
          placeholder="How can we help you?"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        class="w-full bg-slate-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
      >
        Send Message
      </button>
    </form>
  );
}
