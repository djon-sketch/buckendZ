import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "users.json");

export default function handler(req, res) {
  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (req.method === "GET") {
    return res.status(200).json(users);
  }

  if (req.method === "POST") {
    const { user, pass } = req.body;
    if (!user || !pass) {
      return res.status(400).json({ message: "Username dan password wajib diisi" });
    }

    if (users[user]) {
      return res.status(400).json({ message: "User sudah ada!" });
    }

    users[user] = pass;
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    return res.status(201).json({ message: "User berhasil ditambah ✅" });
  }

  if (req.method === "DELETE") {
    const { user } = req.body;
    if (!users[user]) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    delete users[user];
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    return res.status(200).json({ message: "User berhasil dihapus 🗑️" });
  }

  res.status(405).json({ message: "Method tidak diizinkan" });
}
