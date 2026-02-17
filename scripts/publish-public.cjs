/**
 * Bump patch version in package.json and publish to npm with public access.
 * Usage: node scripts/publish-public.cjs [patch|minor|major]
 * Default: patch (0.0.1 -> 0.0.2)
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const pkgPath = path.join(root, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

const bump = (process.argv[2] || "patch").toLowerCase();
const [major, minor, patch] = (pkg.version || "0.0.0").split(".").map(Number);

let next;
if (bump === "major") {
  next = `${major + 1}.0.0`;
} else if (bump === "minor") {
  next = `${major}.${(minor || 0) + 1}.0`;
} else {
  next = `${major}.${minor || 0}.${(patch || 0) + 1}`;
}

const previous = pkg.version;
pkg.version = next;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`Bumped version ${previous} -> ${next}`);

execSync("npm run build", { cwd: root, stdio: "inherit" });
execSync("npm publish --access public", { cwd: root, stdio: "inherit" });
console.log(`Published @flexprice/mcp-server@${next}`);
