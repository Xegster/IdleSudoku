const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const keystorePath = path.join(__dirname, '..', 'android', 'app', 'idlesudoku-release-key.keystore');
const keystoreDir = path.dirname(keystorePath);

// Check if keystore already exists
if (fs.existsSync(keystorePath)) {
  console.log('Keystore already exists at:', keystorePath);
  console.log('Skipping keystore creation. Delete the existing keystore if you want to regenerate it.');
  process.exit(0);
}

// Default passwords (user should change these in production)
// For development, these are acceptable, but for production releases,
// the user should regenerate with secure passwords
const defaultStorePassword = 'idlesudoku-release-password';
const defaultKeyPassword = 'idlesudoku-release-password';
const keyAlias = 'idlesudoku-key-alias';

console.log('Creating release keystore...');
console.log('Note: Using default passwords. For production, regenerate with secure passwords.');
console.log('');

// Create keystore directory if it doesn't exist
if (!fs.existsSync(keystoreDir)) {
  fs.mkdirSync(keystoreDir, { recursive: true });
}

// Generate keystore using keytool
// Using -storepass and -keypass to avoid interactive prompts
// Note: dname needs to be quoted on Windows
const dname = 'CN=IdleSudoku, OU=Development, O=IdleSudoku, L=Unknown, ST=Unknown, C=US';
const keytoolCommand = `keytool -genkeypair -v -storetype PKCS12 -keystore "${keystorePath}" -alias ${keyAlias} -keyalg RSA -keysize 2048 -validity 10000 -storepass ${defaultStorePassword} -keypass ${defaultKeyPassword} -dname "${dname}"`;

try {
  execSync(keytoolCommand, { stdio: 'inherit' });
  console.log('');
  console.log('✓ Keystore created successfully at:', keystorePath);
  console.log('');
  console.log('IMPORTANT: Update android/gradle.properties with your keystore passwords.');
  console.log('For production releases, regenerate this keystore with secure passwords.');
} catch (error) {
  console.error('Error creating keystore:', error.message);
  console.error('');
  console.error('Make sure Java JDK is installed and keytool is in your PATH.');
  process.exit(1);
}

