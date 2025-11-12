export async function loadRules(carrier) {
  // Fallback to o2 if nothing chosen
  const name = (carrier || 'o2').toLowerCase();
  const res = await fetch(`./rules/${name}.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load rules for ${name}`);
  return res.json();
}

export async function listCarriers() {
  const carriers = await (await fetch('./src/carriers.js')).text();
  // quick parse without eval: format is `export const CARRIERS = [...]`
  const match = carriers.match(/CARRIERS\s*=\s*(\[[\s\S]*?\])/);
  return match ? JSON.parse(match[1]) : [];
}
