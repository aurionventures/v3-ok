#!/usr/bin/env node
/**
 * Validação offline do schema e das Edge Functions.
 * Não requer banco, API Supabase nem OpenAI.
 * Uso: node supabase/scripts/validate.mjs (a partir da raiz do projeto)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SUPABASE = path.join(ROOT, "supabase");
const MIGRATIONS = path.join(SUPABASE, "migrations");
const FUNCTIONS = path.join(SUPABASE, "functions");

const AGENTES_ESPERADOS = [
  "agente",
  "agente-ata",
  "agente-atas-reunioes",
  "agente-diagnostico-governanca",
  "agente-sinais-mercado",
  "agente-insights-estrategicos",
  "agente-processamento-documentos",
  "agente-pdi-conselho",
  "agente-historico-padroes",
  "agente-prioridade-agenda",
  "agente-pautas-sugestoes",
  "agente-briefing-pautas",
  "agente-busca-atas",
];

const MIGRATION_REGEX = /^\d{14}_.+\.sql$/;

let hasErrors = false;

function log(msg, type = "info") {
  const prefix = type === "error" ? "ERRO:" : type === "ok" ? "OK:" : "";
  console.log(prefix ? `${prefix} ${msg}` : msg);
}

function validateMigrations() {
  log("Validando pasta migrations...");
  if (!fs.existsSync(MIGRATIONS)) {
    log("Pasta supabase/migrations não encontrada.", "error");
    hasErrors = true;
    return;
  }
  const files = fs.readdirSync(MIGRATIONS).filter((f) => f !== ".gitkeep");
  for (const file of files) {
    if (!MIGRATION_REGEX.test(file)) {
      log(
        `Migração com nome inválido: ${file} (esperado: YYYYMMDDHHMMSS_descricao.sql)`,
        "error"
      );
      hasErrors = true;
    } else {
      log(`  ${file}`, "ok");
    }
  }
  if (files.length === 0) {
    log("  Nenhum arquivo de migração (apenas .gitkeep). Convenção documentada.");
  }
}

function validateFunctions() {
  log("Validando Edge Functions (agentes com prompt)...");
  if (!fs.existsSync(FUNCTIONS)) {
    log("Pasta supabase/functions não encontrada.", "error");
    hasErrors = true;
    return;
  }
  for (const nome of AGENTES_ESPERADOS) {
    const dir = path.join(FUNCTIONS, nome);
    const promptFile = path.join(dir, "prompt.ts");
    if (!fs.existsSync(dir)) {
      log(`Pasta da function ausente: functions/${nome}`, "error");
      hasErrors = true;
      continue;
    }
    if (!fs.existsSync(promptFile)) {
      log(`Arquivo prompt.ts ausente em: functions/${nome}`, "error");
      hasErrors = true;
      continue;
    }
    const content = fs.readFileSync(promptFile, "utf8");
    const hasExport = /export\s+const\s+PROMPT_/m.test(content);
    const hasContent = content.replace(/\s|\/\*\*[\s\S]*?\*\//g, "").length > 50;
    if (!hasExport) {
      log(`functions/${nome}/prompt.ts não exporta PROMPT_*`, "error");
      hasErrors = true;
    }
    if (!hasContent) {
      log(`functions/${nome}/prompt.ts parece vazio ou só comentários`, "error");
      hasErrors = true;
    }
    const indexFile = path.join(dir, "index.ts");
    if (!fs.existsSync(indexFile)) {
      log(`index.ts ausente em: functions/${nome}`, "error");
      hasErrors = true;
    }
    if (hasExport && hasContent && fs.existsSync(indexFile)) {
      log(`  ${nome}`, "ok");
    }
  }
}

function validateStructure() {
  log("Validando estrutura de pastas supabase...");
  const required = ["migrations", "functions"];
  for (const dir of required) {
    const full = path.join(SUPABASE, dir);
    if (!fs.existsSync(full)) {
      log(`Pasta supabase/${dir} não encontrada.`, "error");
      hasErrors = true;
    } else {
      log(`  supabase/${dir}`, "ok");
    }
  }
}

console.log("\n--- Validação offline (sem banco, sem API Supabase, sem OpenAI) ---\n");
validateStructure();
console.log("");
validateMigrations();
console.log("");
validateFunctions();
console.log("");
if (hasErrors) {
  console.log("Validação falhou. Corrija os erros acima.");
  process.exit(1);
}
console.log("Validação concluída com sucesso.");
process.exit(0);
