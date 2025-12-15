#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

console.log("\n================================");
console.log("🚀 TAUfoods Setup Wizard");
console.log("================================\n");

// Helper function to run commands
function runCommand(command, args = [], cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    const cmd = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: true,
    });

    cmd.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed: ${command} ${args.join(" ")}`));
    });
  });
}

async function setup() {
  try {
    // Step 1: Install frontend dependencies
    console.log("\n📦 Installing frontend dependencies...");
    await runCommand("npm", ["install"]);

    // Step 2: Install backend dependencies
    console.log("\n📦 Installing backend dependencies...");
    await runCommand("npm", ["install"], path.join(__dirname, "server"));

    // Step 3: Install EAS CLI globally
    console.log("\n🔧 Installing EAS CLI...");
    await runCommand("npm", ["install", "-g", "eas-cli"]);

    // Step 4: Create .env files if they don't exist
    console.log("\n⚙️  Setting up configuration files...");

    const envContent = `EXPO_PUBLIC_API_URL=http://localhost:5000
EXPO_PUBLIC_API_TIMEOUT=30000
`;

    if (!fs.existsSync(path.join(__dirname, ".env"))) {
      fs.writeFileSync(path.join(__dirname, ".env"), envContent);
      console.log("✓ Created .env file");
    }

    const serverEnvContent = `PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/taufoods
JWT_SECRET=taufoods_jwt_secret_key_2024_production_secure
CORS_ORIGIN=*
HOST=0.0.0.0
`;

    if (!fs.existsSync(path.join(__dirname, "server", ".env"))) {
      fs.writeFileSync(path.join(__dirname, "server", ".env"), serverEnvContent);
      console.log("✓ Created server/.env file");
    }

    console.log("\n================================");
    console.log("✅ Setup Complete!");
    console.log("================================\n");

    console.log("Next steps:\n");
    console.log("1. Update your MongoDB connection in server/.env");
    console.log("2. Deploy backend to Vercel/Heroku/Railway");
    console.log("3. Update EXPO_PUBLIC_API_URL in .env");
    console.log("4. Run: eas login");
    console.log("5. Run: eas build --platform android --profile preview\n");

    console.log("📖 See LIVE_DEPLOYMENT_READY.md for full instructions\n");
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    process.exit(1);
  }
}

setup();
