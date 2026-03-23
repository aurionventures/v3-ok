/**
 * Testa a Edge Function agente-atas-reunioes.
 * Uso: node scripts/test-ata-edge-function.mjs
 *
 * Requer VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env (ou export antes de rodar).
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  try {
    const envPath = join(root, ".env");
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {}
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env");
  process.exit(1);
}

const fnUrl = `${url.replace(/\/$/, "")}/functions/v1/agente-atas-reunioes`;
const prompt = `Você é um secretário executivo experiente em governança corporativa brasileira.
INSTRUÇÕES DE ESTILO:
- Seja direto e focado em decisões e ações
- Use terceira pessoa do singular
- Gere resumos executivos de 1000 palavras`;

const body = {
  input: "REUNIÃO: Conselho de Administração\nData: 22/03/2026\nHorário: 14:00\n\nPAUTA:\n1. Aprovação de balanço\n2. Renovação de mandatos",
  systemPrompt: prompt,
};

console.log("Testando", fnUrl);
console.log("---");

try {
  const res = await fetch(fnUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  console.log("Status:", res.status);
  console.log("Response:", JSON.stringify(json, null, 2));

  if (res.ok && json.textoCompleto) {
    console.log("\n✓ ATA gerada com sucesso. A Edge Function e a API OpenAI estão OK.");
  } else if (res.ok && json.error) {
    console.log("\n✗ Função respondeu com erro:", json.error);
  } else if (!res.ok) {
    console.log("\n✗ Erro HTTP:", res.status, json.error || json.message || text.slice(0, 200));
  }
} catch (err) {
  console.error("✗ Erro de rede:", err.message);
  if (err.cause) console.error("Causa:", err.cause);
}
