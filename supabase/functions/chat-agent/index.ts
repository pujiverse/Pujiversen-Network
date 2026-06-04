// ============================================================
// PUJIVERSE NETWORK — AI Chat Agent (Supabase Edge Function)
// Deploy:  supabase functions deploy chat-agent --no-verify-jwt
// Set key: supabase secrets set OPENAI_API_KEY=sk-...
// ============================================================
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { message, session_id } = await req.json();
    if (!message) return json({ error: "message required" }, 400);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY");
    const sb = createClient(SUPABASE_URL, SERVICE_KEY);

    // Pull a compact knowledge snapshot for grounding
    const [{ data: channels }, { data: anns }] = await Promise.all([
      sb.from("channels").select("name,handle,category,url,playlists").limit(50),
      sb.from("announcements").select("title,body").order("published_at", { ascending: false }).limit(5),
    ]);

    const knowledge = (channels || [])
      .map((c: any) => `${c.name} (${c.category}) ${c.handle} — ${c.url}`)
      .join("\n");
    const annText = (anns || []).map((a: any) => `- ${a.title}: ${a.body || ""}`).join("\n");

    // log incoming
    await sb.from("messages").insert({ session_id, role: "user", content: message });

    let reply: string;

    if (OPENAI_KEY) {
      const sys = `You are the friendly assistant for Pujiverse Network, a family of YouTube channels.
Help visitors find the right channel/video, explain the lottery, and share social links.
Be concise, warm, and use the channel list below. If unsure, suggest browsing the solar-system view.

CHANNELS:
${knowledge}

RECENT ANNOUNCEMENTS:
${annText}`;

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: sys },
            { role: "user", content: message },
          ],
          max_tokens: 350,
          temperature: 0.6,
        }),
      });
      const j = await r.json();
      reply = j?.choices?.[0]?.message?.content?.trim()
        || "I'm here to help you explore Pujiverse — what topic are you into?";
    } else {
      // No key configured: tiny built-in fallback
      const t = message.toLowerCase();
      const hit = (channels || []).find((c: any) =>
        (c.name + " " + c.category + " " + (c.playlists || []).join(" ")).toLowerCase()
          .includes(t.split(" ").find((w: string) => w.length > 3) || "xyz"));
      reply = hit
        ? `Check out ${hit.name} (${hit.category}): ${hit.url}`
        : `We have ${channels?.length || 0} channels across tech, mystery, finance, gaming and more. What are you into?`;
    }

    await sb.from("messages").insert({ session_id, role: "assistant", content: reply });
    return json({ reply });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
