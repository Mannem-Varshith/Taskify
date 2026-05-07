#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks if the application is ready for Railway deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying deployment configuration...\n');

let errors = [];
let warnings = [];
let success = [];

// Check if required files exist
const requiredFiles = [
  'server/package.json',
  'client/package.json',
  'server/index.js',
  'client/src/main.jsx',
  'client/vite.config.js',
  'server/.env.example',
  'client/.env.example',
];

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    success.push(`✅ ${file} exists`);
  } else {
    errors.push(`❌ ${file} is missing`);
  }
});

// Check server package.json
console.log('\n📦 Checking server package.json...');
try {
  const serverPkg = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
  
  if (serverPkg.scripts && serverPkg.scripts.start) {
    success.push('✅ Server has start script');
  } else {
    errors.push('❌ Server missing start script');
  }
  
  const requiredDeps = ['express', 'mongoose', 'jsonwebtoken', 'bcryptjs', 'cors', 'socket.io'];
  requiredDeps.forEach(dep => {
    if (serverPkg.dependencies && serverPkg.dependencies[dep]) {
      success.push(`✅ Server has ${dep}`);
    } else {
      errors.push(`❌ Server missing ${dep}`);
    }
  });
} catch (error) {
  errors.push('❌ Cannot read server/package.json');
}

// Check client package.json
console.log('\n📦 Checking client package.json...');
try {
  const clientPkg = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
  
  if (clientPkg.scripts && clientPkg.scripts.build) {
    success.push('✅ Client has build script');
  } else {
    errors.push('❌ Client missing build script');
  }
  
  if (clientPkg.scripts && clientPkg.scripts.preview) {
    success.push('✅ Client has preview script');
  } else {
    warnings.push('⚠️  Client missing preview script (recommended for Railway)');
  }
  
  const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'axios', 'socket.io-client'];
  requiredDeps.forEach(dep => {
    if (clientPkg.dependencies && clientPkg.dependencies[dep]) {
      success.push(`✅ Client has ${dep}`);
    } else {
      errors.push(`❌ Client missing ${dep}`);
    }
  });
} catch (error) {
  errors.push('❌ Cannot read client/package.json');
}

// Check vite config
console.log('\n⚙️  Checking vite.config.js...');
try {
  const viteConfig = fs.readFileSync('client/vite.config.js', 'utf8');
  
  if (viteConfig.includes('preview')) {
    success.push('✅ Vite config has preview settings');
  } else {
    warnings.push('⚠️  Vite config missing preview settings');
  }
  
  if (viteConfig.includes('build')) {
    success.push('✅ Vite config has build settings');
  } else {
    warnings.push('⚠️  Vite config missing build settings');
  }
} catch (error) {
  warnings.push('⚠️  Cannot read vite.config.js');
}

// Check API configuration
console.log('\n🔌 Checking API configuration...');
try {
  const apiFile = fs.readFileSync('client/src/services/api.js', 'utf8');
  
  if (apiFile.includes('VITE_API_URL') || apiFile.includes('import.meta.env')) {
    success.push('✅ API uses environment variables');
  } else {
    errors.push('❌ API not configured for environment variables');
  }
} catch (error) {
  errors.push('❌ Cannot read client/src/services/api.js');
}

// Check .env files are not committed
console.log('\n🔒 Checking security...');
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  if (gitignore.includes('.env')) {
    success.push('✅ .env files are in .gitignore');
  } else {
    errors.push('❌ .env files not in .gitignore');
  }
} else {
  warnings.push('⚠️  No .gitignore file found');
}

// Check if .env files exist (they shouldn't be committed)
if (fs.existsSync('server/.env')) {
  warnings.push('⚠️  server/.env exists - make sure it\'s not committed to Git');
}
if (fs.existsSync('client/.env')) {
  warnings.push('⚠️  client/.env exists - make sure it\'s not committed to Git');
}

// Print results
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION RESULTS');
console.log('='.repeat(60));

if (success.length > 0) {
  console.log('\n✅ SUCCESS:');
  success.forEach(msg => console.log(`   ${msg}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach(msg => console.log(`   ${msg}`));
}

if (errors.length > 0) {
  console.log('\n❌ ERRORS:');
  errors.forEach(msg => console.log(`   ${msg}`));
}

console.log('\n' + '='.repeat(60));

if (errors.length === 0) {
  console.log('✅ Your application is ready for Railway deployment!');
  console.log('\n📚 Next steps:');
  console.log('   1. Push your code to GitHub');
  console.log('   2. Follow RAILWAY_SETUP.md for deployment');
  console.log('   3. Use DEPLOYMENT_CHECKLIST.md to track progress');
  process.exit(0);
} else {
  console.log('❌ Please fix the errors above before deploying');
  console.log('\n📚 Resources:');
  console.log('   - DEPLOYMENT.md - Detailed deployment guide');
  console.log('   - RAILWAY_SETUP.md - Quick start guide');
  process.exit(1);
}
