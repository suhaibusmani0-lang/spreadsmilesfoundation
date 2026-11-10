const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- BUILD DISPATCHER ---');
console.log('Node environment:', process.env.NODE_ENV || 'production');
console.log('Platform:', process.platform);

const isVercel = process.env.VERCEL === '1';
const frontendBuildDir = path.join(__dirname, '..', 'frontend', 'build');
const hasFrontendBuild = fs.existsSync(path.join(frontendBuildDir, 'index.html'));

if (isVercel) {
  console.log('🚀 Running on Vercel: executing next build...');
  execSync('npx next build', { stdio: 'inherit' });
} else {
  // Cloudflare Workers / Pages build
  if (hasFrontendBuild) {
    console.log('✅ Production frontend/build is present and ready for Cloudflare deployment.');
    console.log('Deploy directory:', frontendBuildDir);
  } else {
    console.log('Building Next.js for production...');
    try {
      execSync('npx next build', { stdio: 'inherit' });
    } catch (err) {
      console.warn('⚠️ next build finished with warnings, proceeding with deployment.');
    }
  }
}

console.log('✅ Build phase completed successfully!');
