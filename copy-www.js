const fs = require('fs');
const path = require('path');
['index.html', 'styles.css', 'app.js'].forEach((f) => {
  const src = path.join(__dirname, f);
  const dest = path.join(__dirname, 'www', f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Copied:', f);
  } else {
    console.error('Missing:', src);
    process.exit(1);
  }
});
