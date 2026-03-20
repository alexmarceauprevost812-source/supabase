import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { message } = await req.json();

  return new Response(JSON.stringify({
    reply: "Réponse IA dynamique: " + message
  }), {
    headers: { "Content-Type": "application/json" }
  });
});
