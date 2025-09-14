// api/stok.js
const fs = require('fs');
const path = require('path');

const STOK_PATH = path.join(process.cwd(), 'stok.json');
const USERS_PATH = path.join(process.cwd(), 'users.json');

function readStok(){
  try { return JSON.parse(fs.readFileSync(STOK_PATH,'utf8')); } catch(e){ return []; }
}
function writeStok(data){
  fs.writeFileSync(STOK_PATH, JSON.stringify(data, null, 2), 'utf8');
}
function readUsers(){
  try { return JSON.parse(fs.readFileSync(USERS_PATH,'utf8')); } catch(e){ return {}; }
}
function authFromReq(req){
  const h = (req.headers.authorization||'').split(' ');
  if (h[0] !== 'Bearer' || !h[1]) return null;
  try { const user = Buffer.from(h[1], 'base64').toString('utf8'); return user; } catch(e){return null;}
}

module.exports = (req, res) => {
  try {
    if (req.method === 'GET') {
      const arr = readStok();
      return res.status(200).json(arr);
    }

    if (req.method === 'POST') {
      // add product (auth required)
      const user = authFromReq(req);
      const users = readUsers();
      if (!user || !users[user]) return res.status(401).json({ message: 'Unauthorized' });

      const { nama, harga, stock, wa, deskripsi } = req.body || {};
      if (!nama || typeof harga === 'undefined' || typeof stock === 'undefined') return res.status(400).json({ message: 'Invalid input' });

      const arr = readStok();
      const id = arr.length ? Math.max(...arr.map(x=>x.id)) + 1 : 1;
      const item = { id, nama, harga: Number(harga), stock: Number(stock), wa: wa||'', deskripsi: deskripsi||'' };
      arr.push(item);
      writeStok(arr);
      return res.status(200).json({ ok:true, item });
    }

    if (req.method === 'PUT') {
      // edit stock by delta {id, delta}
      const user = authFromReq(req);
      const users = readUsers();
      if (!user || !users[user]) return res.status(401).json({ message: 'Unauthorized' });

      const { id, delta } = req.body || {};
      if (typeof id !== 'number' || typeof delta !== 'number') return res.status(400).json({ message: 'Invalid input' });
      const arr = readStok();
      const idx = arr.findIndex(p=>p.id===id);
      if (idx === -1) return res.status(404).json({ message: 'Not found' });
      arr[idx].stock = Math.max(0, (arr[idx].stock||0) + delta);
      writeStok(arr);
      return res.status(200).json({ ok:true, item: arr[idx] });
    }

    if (req.method === 'DELETE') {
      // delete {id}
      const user = authFromReq(req);
      const users = readUsers();
      if (!user || !users[user]) return res.status(401).json({ message: 'Unauthorized' });

      const { id } = req.body || {};
      if (typeof id !== 'number') return res.status(400).json({ message: 'Invalid input' });
      let arr = readStok();
      const lenBefore = arr.length;
      arr = arr.filter(p=>p.id !== id);
      if (arr.length === lenBefore) return res.status(404).json({ message: 'Not found' });
      writeStok(arr);
      return res.status(200).json({ ok:true });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};
