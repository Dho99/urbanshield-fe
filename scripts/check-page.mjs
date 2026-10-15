const res = await fetch("http://localhost:3005");
const html = await res.text();
const matches = html.match(/<link[^>]+rel="stylesheet"[^>]*>/g);
console.log("Stylesheets:", matches);

for (const m of matches || []) {
  const href = m.match(/href="([^"]+)"/)?.[1];
  if (href) {
    const cssRes = await fetch("http://localhost:3005" + href);
    const css = await cssRes.text();
    console.log(`Href: ${href}, Length: ${css.length}`);
    console.log("Snippet (1000..1500):", css.slice(1000, 1500));
    console.log("Matches 'bg-':", css.match(/\.bg-[a-z0-9-]+/g)?.slice(0, 5));
    console.log("Matches 'text-':", css.match(/\.text-[a-z0-9-]+/g)?.slice(0, 5));
  }
}
