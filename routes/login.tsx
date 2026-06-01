import { define } from "../lib/utils.ts";
import LoginForm from "../islands/LoginForm.tsx";
import { page } from "fresh";
import { Head } from "fresh/runtime";

import { getCookies } from "jsr:@std/http@0.224.0/cookie";
import { STORE_NAME } from "../lib/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    const token = cookies["_medusa_jwt"];

    ctx.state.title = `Login - ${STORE_NAME}`;
    ctx.state.description =
      "Log in to your {STORE_NAME} account to manage your orders and profile.";

    const url = new URL(ctx.req.url);
    const redirectUrl = url.searchParams.get("redirect") || "/account";

    if (token) {
      return new Response("", {
        status: 302,
        headers: { Location: redirectUrl },
      });
    }
    return page();
  },
});

export default define.page(function LoginPage(props) {
  const url = new URL(props.url);
  const redirectUrl = url.searchParams.get("redirect") || "/account";

  return (
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <Head>
        <title>{props.state.title as string}</title>
        <meta name="description" content={props.state.description as string} />
      </Head>
      <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p class="text-gray-600">
            Sign in to access an enhanced shopping experience.
          </p>
        </div>

        <LoginForm redirect={redirectUrl} />
      </div>
    </main>
  );
});
