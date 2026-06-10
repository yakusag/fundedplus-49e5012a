import type { VercelRequest, VercelResponse } from "@vercel/node";
import { exec } from "child_process";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "GITHUB_TOKEN is not configured." });
  }

  exec("bash scripts/push-github.sh", { env: { ...process.env, GITHUB_TOKEN: token } }, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr || err.message, output: stdout });
    }
    return res.json({ success: true, output: stdout });
  });
}
