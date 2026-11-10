const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'frontend', 'build');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const indexPath = path.join(targetDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(
    indexPath,
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Spread Smiles Foundation</title></head><body><h1>Spread Smiles Foundation</h1></body></html>'
  );
}

console.log('✅ Cloudflare frontend/build directory ready at:', targetDir);
