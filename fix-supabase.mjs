import fs from "fs";
import path from "path";

const root = "./";

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fullPath.includes("node_modules") || fullPath.includes(".next")) continue;

    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      let content = fs.readFileSync(fullPath, "utf8");

      const updated = content
        .replace(/await createServerSupabase\(\)/g, "createServerSupabase()")
        .replace(/createServerSupabase\(\)\(\)/g, "createServerSupabase()")
        .replace(/"\.\/login"/g, '"/auth/login"')
        .replace(/'\.\/login'/g, "'/auth/login'");

      if (updated !== content) {
        fs.writeFileSync(fullPath, updated, "utf8");
        console.log("fixed:", fullPath);
      }
    }
  }
}

walk(root);

console.log("DONE FIXING SUPABASE + LOGIN ROUTES");