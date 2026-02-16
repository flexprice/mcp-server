/**
 * After openapi-mcp-generator runs with --output ., it overwrites package.json.
 * This script merges back our repo scripts and devDependencies so generate,
 * dev:runtime, and tests keep working.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pkgPath = path.join(root, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

const extraScripts = {
  generate:
    "npx openapi-mcp-generator --input swagger/swagger-3-0.json --output . --server-name flexprice-mcp --force",
  "generate:install":
    "npm run generate && node scripts/merge-package-after-generate.cjs && npm install",
  "run:generated": "npm start",
  "dev:runtime": "ts-node runtime/server.ts",
  test: "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:ci": "jest --ci --coverage",
};

const extraDevDependencies = {
  "@types/jest": "^29.5.12",
  "@types/winston": "^2.4.4",
  jest: "^29.7.0",
  "jest-mock-axios": "^4.7.3",
  nock: "^13.5.4",
  "ts-jest": "^29.1.2",
  "ts-node": "^10.9.2",
};

pkg.scripts = { ...pkg.scripts, ...extraScripts };
pkg.devDependencies = { ...pkg.devDependencies, ...extraDevDependencies };

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

// Ensure coverage/ stays in .gitignore for Jest
const gitignorePath = path.join(root, ".gitignore");
if (fs.existsSync(gitignorePath)) {
  let content = fs.readFileSync(gitignorePath, "utf-8");
  if (!content.includes("coverage/")) {
    content += "\n# Jest\ncoverage/\n";
    fs.writeFileSync(gitignorePath, content);
  }
}

console.log("Merged scripts and devDependencies into package.json.");
