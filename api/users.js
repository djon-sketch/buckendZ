import fs from 'fs';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const auth = req.headers.authorization;
    if (!auth || auth !== 'Bearer admin-secret-token') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { user, pass } = req.body;
    const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    if (users[user]) return res.status(400).json({ message: 'User sudah ada' });

    users[user] = pass;
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    return res.status(200).json({ message: 'User berhasil ditambahkan' });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
