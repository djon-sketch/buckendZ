import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "stok.json");

export default function handler(req, res) {
  let stok = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (req.method === "GET") {
    return res.status(200).json(stok);
  }

  if (req.method === "POST") {
    const { nama, harga, wa, deskripsi } = req.body;
    if (!nama || !harga) {
      return res.status(400).json({ message: "Nama dan harga wajib diisi" });
    }

    const newStok = {
      id: Date.now(),
      nama,
      harga,
      wa: wa || "",
      deskripsi: deskripsi || ""
    };

    stok.push(newStok);
    fs.writeFileSync(filePath, JSON.stringify(stok, null, 2));
    return res.status(201).json({ message: "Stok berhasil ditambah ✅", data: newStok });
  }

  if (req.method === "PUT") {
    const { id, nama, harga, wa, deskripsi } = req.body;
    const index = stok.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ message: "Stok tidak ditemukan" });

    stok[index] = { id, nama, harga, wa, deskripsi };
    fs.writeFileSync(filePath, JSON.stringify(stok, null, 2));
    return res.status(200).json({ message: "Stok berhasil diupdate ✅" });
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    stok = stok.filter(s => s.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(stok, null, 2));
    return res.status(200).json({ message: "Stok berhasil dihapus 🗑️" });
  }

  res.status(405).json({ message: "Method tidak diizinkan" });
}
