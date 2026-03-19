import { define } from "../../../utils.ts";

export const handler = define.handlers({
  GET: () => {
    const headers = new Headers();
    headers.set("Location", "/login");
    headers.set("Set-Cookie", `_medusa_jwt=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);

    return new Response("", {
      status: 302,
      headers,
    });
  },
  POST: () => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    // Clear the cookie
    headers.set("Set-Cookie", `_medusa_jwt=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  }
});
