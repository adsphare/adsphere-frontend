const fs = require("fs");
const path = require("path");

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

const TARGETS = ["app", "lib"];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  content = content

    // ❌ REMOVE BROKEN DOUBLE CALLS
    .replace(/createServerSupabase\(\)\(\)/g, "createServerSupabase()")

    // ❌ FIX WRONG AWAIT PATTERN
    .replace(/createServerSupabase()\(\)/g, "createServerSupabase()")

    // ❌ FIX OLD BROWSER DOUBLE CALL BUGS
    .replace(/createBrowserSupabase\(\)\(\)/g, "createServerSupabase()")

    // ❌ FIX IMPORTS (ONLY REMOVE WRONG ONES, DO NOT MODIFY VALID ONES)
    .replace(
      /import\s+\{\s*createBrowserSupabase\s*\}\s+from\s+"@supabase\/supabase-js";?/g,
      ""
    );

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("Fixed:", filePath);
  }
}

TARGETS.forEach((dir) => {
  if (fs.existsSync(dir)) {
    walk(dir, fixFile);
  }
});

console.log("✅ SAFE SUPABASE CLEANUP COMPLETE");