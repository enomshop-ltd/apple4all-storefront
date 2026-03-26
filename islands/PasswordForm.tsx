import { useState } from "preact/hooks";
import { Loader2 } from "lucide-preact";

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to update password.");
        globalThis.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (_err) {
      setError("An error occurred. Please try again.");
      globalThis.scrollTo({ top: 0, behavior: "smooth" });
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

      <div class="space-y-4">
        <div class="space-y-2">
          <label
            for="oldPassword"
            class="block text-sm font-medium text-gray-700"
          >
            Current password
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div class="space-y-2">
          <label
            for="newPassword"
            class="block text-sm font-medium text-gray-700"
          >
            New password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div class="space-y-2">
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700"
          >
            Confirm new password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>

      <div class="pt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading}
          class="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {isLoading && <Loader2 class="w-4 h-4 animate-spin" />}
          Update password
        </button>
        {success && (
          <span class="text-sm text-green-600 font-medium">
            Password updated successfully!
          </span>
        )}
      </div>
    </form>
  );
}
