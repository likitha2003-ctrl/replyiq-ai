const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function updateTheme() {
  const dirs = ['./app', './components'];
  
  dirs.forEach(dir => {
    walkDir(dir, (filePath) => {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let originalContent = content;
        
        // Replace slate with zinc
        content = content.replace(/slate-/g, 'zinc-');
        
        // Replace purple with zinc for monochromatic minimalist look
        content = content.replace(/purple-/g, 'zinc-');
        
        // Replace indigo with zinc
        content = content.replace(/indigo-/g, 'zinc-');
        
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`Updated ${filePath}`);
        }
      }
    });
  });
}

updateTheme();
