// api/login.js
const fs = require('fs');
const path = require('path');

const USERS_PATH = path.join(process.cwd(), 'users.json');

function readUsers(){
  try {
    return JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
  } catch (e) {
    return {};
  }
}

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

  const users = readUsers();
  if (users[username] && users[username] === password) {
    // token = base64 username (very simple)
    const token = Buffer.from(username).toString('base64');
    return res.status(200).json({ token });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
};
