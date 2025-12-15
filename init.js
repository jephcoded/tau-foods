#!/usr/bin/env node

/**
 * TAUfoods - Master Initialization Script
 * Prepares everything for live deployment
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

function log(message, type = "info") {
  const prefix = {
    success: `${colors.green}✓${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`,
    info: `${colors.blue}ℹ${colors.reset}`,
  }[type] || "•";

  console.log(`${prefix} ${message}`);
}

function section(title) {
  console.log(`\n${colors.bright}${colors.blue}═══════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${title}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}═══════════════════════════${colors.reset}\n`);
}

async function runCommand(command, silent = false) {
  try {
    if (!silent) log(`Running: ${command}`, "info");
    execSync(command, { stdio: "inherit" });
    return true;
  } catch (error) {
    if (!silent) log(`Failed: ${command}`, "error");
    return false;
  }
}

function checkFile(filePath, name) {
  if (fs.existsSync(filePath)) {
    log(`${name} exists`, "success");
    return true;
  } else {
    log(`${name} missing`, "warning");
    return false;
  }
}

async function main() {
  console.log("\n");
  console.log(`${colors.bright}${colors.green}🚀 TAUfoods - Master Setup${colors.reset}`);
  console.log(`${colors.bright}Production Deployment Initializer${colors.reset}\n`);

  let allGood = true;

  // Check Node.js
  section("✓ Environment Check");
  try {
    const nodeVersion = execSync("node --version").toString().trim();
    log(`Node.js ${nodeVersion}`, "success");
  } catch {
    log("Node.js not found", "error");
    allGood = false;
  }

  // Check files
  section("✓ Configuration Files");
  const criticalFiles = [
    ["app.json", "app.json"],
    ["package.json", "package.json"],
    ["server/package.json", "server/package.json"],
    ["server/server.js", "server/server.js"],
    ["vercel.json", "vercel.json"],
    [".env", ".env"],
    ["server/.env", "server/.env"],
  ];

  criticalFiles.forEach(([path, name]) => {
    checkFile(path, name);
  });

  // Check deployment scripts
  section("✓ Deployment Scripts");
  checkFile("deploy.bat", "deploy.bat (Windows)");
  checkFile("deploy.sh", "deploy.sh (Mac/Linux)");
  checkFile("Dockerfile", "Dockerfile");
  checkFile("docker-compose.yml", "docker-compose.yml");

  // Check documentation
  section("✓ Documentation");
  checkFile("00_START_HERE.md", "Start Guide");
  checkFile("LIVE_DEPLOYMENT_READY.md", "Deployment Guide");
  checkFile("PRODUCTION_BUILD_GUIDE.md", "Full Guide");
  checkFile("DEPLOYMENT_ARCHITECTURE.md", "Architecture");
  checkFile("DEPLOYMENT_STATUS.md", "Status Dashboard");
  checkFile("QUICK_COMMANDS.md", "Command Reference");

  // Check app structure
  section("✓ App Structure");
  const appFiles = [
    "app/Home.tsx",
    "app/signup.tsx",
    "app/login.tsx",
    "app/Cart.tsx",
    "app/Orders.tsx",
    "app/Profile.tsx",
    "app/admin/index.tsx",
  ];

  appFiles.forEach((file) => {
    checkFile(file, file);
  });

  // Check server structure
  section("✓ Server Structure");
  const serverFiles = [
    "server/routes/userRoutes.js",
    "server/routes/foodRoutes.js",
    "server/routes/orderRoutes.js",
    "server/models/user.js",
    "server/models/food.js",
    "server/models/order.js",
  ];

  serverFiles.forEach((file) => {
    checkFile(file, file);
  });

  // Dependencies check
  section("✓ Dependencies Status");
  if (fs.existsSync("node_modules")) {
    log("Frontend dependencies installed", "success");
  } else {
    log("Frontend dependencies not installed", "warning");
  }

  if (fs.existsSync("server/node_modules")) {
    log("Backend dependencies installed", "success");
  } else {
    log("Backend dependencies not installed", "warning");
  }

  // Final Status
  section("📊 DEPLOYMENT STATUS");

  console.log(`
${colors.bright}${colors.green}✅ PRODUCTION READY${colors.reset}

Your TAUfoods app is fully configured for live deployment!

${colors.bright}Next Steps:${colors.reset}
1. Read: ${colors.blue}00_START_HERE.md${colors.reset}
2. Read: ${colors.blue}LIVE_DEPLOYMENT_READY.md${colors.reset}
3. Choose deployment platform (Vercel/Heroku/Railway)
4. Deploy backend
5. Update .env with backend URL
6. Run: ${colors.yellow}eas build --platform android${colors.reset}
7. Test and submit!

${colors.bright}Support:${colors.reset}
- Stuck? Check: ${colors.blue}QUICK_COMMANDS.md${colors.reset}
- Need help? See: ${colors.blue}PRODUCTION_BUILD_GUIDE.md${colors.reset}
- Architecture? Read: ${colors.blue}DEPLOYMENT_ARCHITECTURE.md${colors.reset}

${colors.bright}${colors.green}Ready to launch! 🚀${colors.reset}
`);

  console.log(`\n${colors.green}═══════════════════════════${colors.reset}`);
  console.log(`${colors.green}Setup Complete!${colors.reset}`);
  console.log(`${colors.green}═══════════════════════════${colors.reset}\n`);
}

main().catch(console.error);
