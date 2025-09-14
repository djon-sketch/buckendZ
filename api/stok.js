import fs from 'fs';

export default function handler(req, res) {
  const stokPath = 'stok.json';
  const auth = req.headers.authorization;

  if (req.method === 'GET') {
    try {
      const data = JSON.parse(fs.readFileSync(stokPath, 'utf8'));
      return res.status(200).json(data);
    } catch {
      return res.status(500).json({ message: 'Server error' });
    }
  }

  if (!auth || auth !== 'Bearer admin-secret-token') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { nama, harga, stock, wa, deskripsi } = req.body;
    try {
      const data = JSON.parse(fs.readFileSync(stokPath, 'utf8'));
      const id = Date.now().toString();
      data.push({ id, nama, harga, stock, wa, deskripsi });
      fs.writeFileSync(stokPath, JSON.stringify(data, null, 2));
      return res.status(200).json({ message: 'Stok ditambahkan' });
    } catch {
      return res.status(500).json({ message: 'Server error' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    try {
      let data = JSON.parse(fs.readFileSync(stokPath, 'utf8'));
      data = data.filter(p => p.id !== id);
      fs.writeFileSync(stokPath, JSON.stringify(data, null, 2));
      return res.status(200).json({ message: 'Stok dihapus' });
    } catch {
      return res.status(500).json({ message: 'Server error' });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
