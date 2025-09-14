import fs from 'fs';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    if (users[username] && users[username] === password) {
      return res.status(200).json({ token: 'admin-secret-token' });
    }
    return res.status(401).json({ message: 'Login gagal' });
  }
  res.status(405).json({ message: 'Method not allowed' });
}
