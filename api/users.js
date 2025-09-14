// api/users.js
const fs = require('fs');
const path = require('path');

const USERS_PATH = path.join(process.cwd(), 'users.json');

function readUsers(){
  try { return JSON.parse(fs.readFileSync(USERS_PATH,'utf8')); } catch(e) { return {}; }
}
function writeUsers(u){ fs.writeFileSync(USERS_PATH, JSON.stringify(u, null, 2), 'utf8'); }
function authFromReq(req){
  const h = (req.headers.authorization||'').split(' ');
  if (h[0] !== 'Bearer' || !h[1]) return null;
  try { return Buffer.from(h[1], 'base64').toString('utf8'); } catch(e){ return null; }
}

module.exports = (req, res) => {
  try {
    if (req.method === 'GET') {
      // return users list only if token valid
      const u = authFromReq(req);
      const users = readUsers();
      if (!u || !users[u]) return res.status(401).json({ message: 'Unauthorized' });
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      // add user (requires auth)
      const authUser = authFromReq(req);
      const users = readUsers();
      if (!authUser || !users[authUser]) return res.status(401).json({ message: 'Unauthorized' });

      const { user, pass } = req.body || {};
      if (!user || !pass) return res.status(400).json({ message: 'Missing fields' });
      if (users[user]) return res.status(400).json({ message: 'User exists' });
      users[user] = pass; // plaintext as requested
      writeUsers(users);
      return res.status(200).json({ message: 'User added' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};
