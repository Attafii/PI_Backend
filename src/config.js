const fs = require('fs');
const path = require('path');

const createDirectories = () => {
  const directories = ['uploads/images', 'uploads/cvs','uploads/programme'];
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
    }
  });
};

createDirectories();
