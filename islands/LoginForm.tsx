import { useState } from "preact/hooks";
import { Loader2 } from "lucide-preact";

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        globalThis.location.href = "/account";
      } else {
        const data = await res.json();
        setError(
          data.error ||
            (isLogin ? "Invalid email or password." : "Registration failed."),
        );
        globalThis.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (_err) {
      setError(
        `An error occurred during ${
          isLogin ? "login" : "registration"
        }. Please try again.`,
      );
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

      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          {isLogin && (
            <a
              href="/login"
              f-client-nav
              class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Forgot password?
            </a>
          )}
        </div>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        class="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 class="w-4 h-4 animate-spin" />}
        {isLogin ? "Sign in" : "Sign up"}
      </button>

      <div class="text-center text-sm text-gray-600">
        {isLogin
          ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                class="font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Sign up
              </button>
            </>
          )
          : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                class="font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Sign in
              </button>
            </>
          )}
      </div>
    </form>
  );
}
