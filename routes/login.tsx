import { Partial } from "fresh/runtime";
import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import { LoginForm } from "../islands/LoginForm.tsx";

import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export default define.page(function LoginPage(ctx) {
  const cookies = getCookies(ctx.req.headers);
  const token = cookies["_medusa_jwt"];

  if (token) {
    return new Response("", { status: 302, headers: { Location: "/account" } });
  }

  return (
    <div class="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 flex flex-col">
      <Head>
        <title>Login - Apple4All</title>
        <meta name="description" content="Log in to your Apple4All account to manage your orders and profile." />
      </Head>

      <Header />

      <Partial name="main">
        <main class="flex-1 flex items-center justify-center px-4 py-12">
          <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div class="text-center mb-8">
              <h1 class="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p class="text-gray-600">Sign in to access an enhanced shopping experience.</p>
            </div>
            
            <LoginForm />
          </div>
        </main>
      </Partial>

      <Footer />
    </div>
  );
});
