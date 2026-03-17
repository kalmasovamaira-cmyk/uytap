const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.next', 'dist', '.git', '.cache'];
const projectDir = __dirname;
const remoteHost = 'root@72.60.182.72';
const remoteDir = '/root/uytap';

// Ensure remote dir exists
try {
  execSync(`ssh -o StrictHostKeyChecking=no ${remoteHost} "mkdir -p ${remoteDir}"`);
} catch (e) {
  console.log('Failed to create remote directory', e.message);
}

function uploadDir(localPath, remotePath) {
  const items = fs.readdirSync(localPath);
  
  for (const item of items) {
    if (excludeDirs.includes(item)) continue;
    
    const fullPath = path.join(localPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      execSync(`ssh -o StrictHostKeyChecking=no ${remoteHost} "mkdir -p ${remotePath}/${item}"`);
      uploadDir(fullPath, `${remotePath}/${item}`);
    } else {
      console.log(`Uploading ${item}...`);
      execSync(`scp -o StrictHostKeyChecking=no "${fullPath}" "${remoteHost}:${remotePath}/${item}"`);
    }
  }
}

console.log('Starting upload...');
uploadDir(projectDir, remoteDir);
console.log('Done!');
