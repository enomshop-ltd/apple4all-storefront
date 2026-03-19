import { useState } from "preact/hooks";
import { Loader2 } from "lucide-react";

export function ProfileForm({ customer }: { customer: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError("");
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      phone: formData.get("phone"),
    };

    try {
      const res = await fetch("/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to update profile.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      {error && (
        <div class="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label for="firstName" class="block text-sm font-medium text-gray-700">First name</label>
          <input 
            type="text" 
            id="firstName" 
            name="firstName" 
            defaultValue={customer?.first_name || ""}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <div class="space-y-2">
          <label for="lastName" class="block text-sm font-medium text-gray-700">Last name</label>
          <input 
            type="text" 
            id="lastName" 
            name="lastName" 
            defaultValue={customer?.last_name || ""}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          defaultValue={customer?.email || ""}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-50"
          disabled
        />
        <p class="text-xs text-gray-500">Email cannot be changed.</p>
      </div>

      <div class="space-y-2">
        <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
        <input 
          type="tel" 
          id="phone" 
          name="phone" 
          defaultValue={customer?.phone || ""}
          placeholder="+1 (555) 000-0000"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>

      <div class="pt-4 flex items-center gap-4">
        <button 
          type="submit" 
          disabled={isLoading}
          class="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {isLoading && <Loader2 class="w-4 h-4 animate-spin" />}
          Save changes
        </button>
        {success && <span class="text-sm text-green-600 font-medium">Profile updated successfully!</span>}
      </div>
    </form>
  );
}
