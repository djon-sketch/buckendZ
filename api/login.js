import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method tidak diizinkan" });
  }

  const filePath = path.join(process.cwd(), "users.json");
  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const { username, password } = req.body;

  if (users[username] && users[username] === password) {
    return res.status(200).json({ ok: true, message: "Login sukses ✅" });
  } else {
    return res.status(401).json({ ok: false, message: "Login gagal ❌" });
  }
}
