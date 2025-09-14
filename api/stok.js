import fs from 'fs';

export default function handler(req, res) {
  const stokPath = 'stok.json';
  const auth = req.headers.authorization;

  if (req.method === 'GET') {
    const data = JSON.parse(fs.readFileSync(stokPath, 'utf8'));
    return res.status(200).json(data);
  }

  if (!auth || auth !== 'Bearer admin-secret-token') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { nama, harga, stock, wa, deskripsi } = req.body;
    const data = JSON.parse(fs.readFileSync(stokPath, 'utf8'));
    const id = Date.now().toString();
    data.push({ id, nama, harga, stock, wa, deskripsi });
    fs.writeFileSync(stokPath, JSON.stringify(data, null, 2));
    return res.status(200).json({ message: 'Stok ditambahkan' });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    let data = JSON.parse(fs.readFileSync(stokPath, 'utf8'));
    data = data.filter(p => p.id !== id);
    fs.writeFileSync(stokPath, JSON.stringify(data, null, 2));
    return res.status(200).json({ message: 'Stok dihapus' });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
