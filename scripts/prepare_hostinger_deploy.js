import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

async function copyRecursive(src, dest, exclude = []) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath, exclude);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function preparePackage() {
  console.log('--- Preparing Hostinger Deployment Package ---');

  const root = process.cwd();
  const stageDir = path.join(root, 'hostinger_deploy_package');
  const zipPath = path.join(root, 'manoj_hostinger_deploy.zip');

  // Clean old staging & zip
  await fs.rm(stageDir, { recursive: true, force: true });
  await fs.rm(zipPath, { force: true });
  await fs.mkdir(stageDir, { recursive: true });

  console.log('1. Copying app and lib...');
  await copyRecursive(path.join(root, 'app'), path.join(stageDir, 'app'));
  await copyRecursive(path.join(root, 'lib'), path.join(stageDir, 'lib'));

  console.log('2. Copying public directory (images, uploads, css, js)...');
  await copyRecursive(path.join(root, 'public'), path.join(stageDir, 'public'));

  console.log('3. Copying .next production build (excluding build cache)...');
  await copyRecursive(path.join(root, '.next'), path.join(stageDir, '.next'), ['cache']);

  console.log('4. Copying config files and live .env...');
  await fs.copyFile(path.join(root, 'package.json'), path.join(stageDir, 'package.json'));
  await fs.copyFile(path.join(root, 'server.js'), path.join(stageDir, 'server.js'));
  await fs.copyFile(path.join(root, 'next.config.mjs'), path.join(stageDir, 'next.config.mjs'));
  await fs.copyFile(path.join(root, 'jsconfig.json'), path.join(stageDir, 'jsconfig.json'));
  await fs.copyFile(path.join(root, '.env.production'), path.join(stageDir, '.env'));

  console.log('5. Copying Hostinger SQL import file...');
  const dbDest = path.join(stageDir, 'database');
  await fs.mkdir(dbDest, { recursive: true });
  await fs.copyFile(
    path.join(root, 'database', 'hostinger_live_database_import.sql'),
    path.join(dbDest, 'hostinger_live_database_import.sql')
  );

  console.log('6. Compressing into manoj_hostinger_deploy.zip via PowerShell...');
  const psCmd = `powershell -Command "Compress-Archive -Path '${stageDir}\\*' -DestinationPath '${zipPath}' -Force"`;
  execSync(psCmd, { stdio: 'inherit' });

  const stat = await fs.stat(zipPath);
  console.log(`\nSUCCESS! Deployment package created:`);
  console.log(`Path: ${zipPath}`);
  console.log(`Size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);

  // Cleanup staging folder
  await fs.rm(stageDir, { recursive: true, force: true });
  console.log('Cleaned up temporary staging directory.');
}

preparePackage().catch(err => {
  console.error('Packaging failed:', err);
  process.exit(1);
});

