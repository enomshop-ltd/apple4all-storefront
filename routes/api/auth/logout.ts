// routes/api/auth/logout.ts
import { define } from "../../../lib/utils.ts";

export const handler = define.handlers({
  GET: () => {
    const headers = new Headers();
    headers.set("Location", "/login");
    // Append both cookie clearings
    headers.append(
      "Set-Cookie",
      `_medusa_jwt=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    );
    headers.append(
      "Set-Cookie",
      `_medusa_cart_id=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    );

    return new Response("", {
      status: 302,
      headers,
    });
  },
  POST: () => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    // Append both cookie clearings
    headers.append(
      "Set-Cookie",
      `_medusa_jwt=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    );
    headers.append(
      "Set-Cookie",
      `_medusa_cart_id=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  },
});
