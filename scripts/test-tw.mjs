import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import fs from "node:fs";

const css1 = fs.readFileSync("src/app/globals.css", "utf8");
const res1 = await postcss([tailwind]).process(css1, { from: "src/app/globals.css" });
console.log("Without extra @source - Length:", res1.css.length, "has bg-white:", res1.css.includes("bg-white"), "has bg-slate-900:", res1.css.includes("bg-slate-900"));

const css2 = `@import "tailwindcss";\n@source "../../src";\n` + css1.replace('@import "tailwindcss";', '');
const res2 = await postcss([tailwind]).process(css2, { from: "src/app/globals.css" });
console.log("With @source ../../src - Length:", res2.css.length, "has bg-white:", res2.css.includes("bg-white"), "has bg-slate-900:", res2.css.includes("bg-slate-900"));
