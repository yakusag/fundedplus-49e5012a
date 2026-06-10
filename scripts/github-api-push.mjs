import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = "yakusag/fundedplus-49e5012a";
const BRANCH = "main";
const BASE = process.cwd();

const IGNORE = new Set([
  "node_modules", ".git", "dist", "dist-server", ".local",
  "scripts/github-api-push.mjs"
]);

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORE.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

async function api(method, path, body) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/${path}`, {
    method,
    headers: {
      Authorization: `token ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "FundedPlus-Push",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`API ${path}: ${res.status} ${JSON.stringify(json).slice(0,200)}`);
  return json;
}

async function main() {
  console.log("📦 Collecting files...");
  const files = walk(BASE);
  console.log(`   ${files.length} files found`);

  // Get current GitHub HEAD
  const refData = await api("GET", `git/ref/heads/${BRANCH}`);
  const baseCommitSha = refData.object.sha;
  const commitData = await api("GET", `git/commits/${baseCommitSha}`);
  const baseTreeSha = commitData.tree.sha;
  console.log(`🌿 GitHub HEAD: ${baseCommitSha.slice(0,10)}, tree: ${baseTreeSha.slice(0,10)}`);

  // Create blobs for all files
  console.log("📤 Creating blobs...");
  const treeItems = [];
  for (const filePath of files) {
    const relPath = relative(BASE, filePath);
    let content, encoding;
    try {
      const buf = readFileSync(filePath);
      // Try UTF-8 first, fallback to base64 for binary
      try {
        content = buf.toString("utf-8");
        encoding = "utf-8";
      } catch {
        content = buf.toString("base64");
        encoding = "base64";
      }
      const blob = await api("POST", "git/blobs", { content, encoding });
      treeItems.push({ path: relPath, mode: "100644", type: "blob", sha: blob.sha });
      process.stdout.write(".");
    } catch (e) {
      console.error(`\n  ⚠ Skipped ${relPath}: ${e.message.slice(0,80)}`);
    }
  }
  console.log(`\n✅ ${treeItems.length} blobs created`);

  // Create new tree
  console.log("🌳 Creating tree...");
  const newTree = await api("POST", "git/trees", { tree: treeItems });
  console.log(`   New tree: ${newTree.sha.slice(0,10)}`);

  // Create commit
  console.log("💾 Creating commit...");
  const newCommit = await api("POST", "git/commits", {
    message: `chore: sync from Replit — account pool, Express server, email notifications\n\n- Migrated Vercel → Replit Express server\n- PostgreSQL account pool system\n- Admin account pool management UI\n- Email notifications via Nodemailer`,
    tree: newTree.sha,
    parents: [baseCommitSha],
  });
  console.log(`   Commit: ${newCommit.sha.slice(0,10)}`);

  // Force update ref
  console.log("🚀 Updating branch...");
  await api("PATCH", `git/refs/heads/${BRANCH}`, { sha: newCommit.sha, force: true });
  console.log(`✅ Pushed to GitHub: https://github.com/${REPO}`);
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
