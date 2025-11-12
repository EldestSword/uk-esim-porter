import { readFileSync } from 'fs';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

function load(path) { return JSON.parse(readFileSync(new URL(path, import.meta.url))); }

test('all rules match schema', () => {
  const schema = load('../rules/schema.json', 'utf8');
  const validate = ajv.compile(schema);
  for (const f of ['o2.json','ee.json','vodafone.json','three.json']) {
    const data = load(`../rules/${f}`);
    const ok = validate(data);
    if (!ok) {
      console.error(validate.errors);
    }
    expect(ok).toBe(true);
  }
});

test('flows include basic steps', () => {
  const o2 = load('../rules/o2.json');
  expect(o2.flows.scan_qr.steps.length).toBeGreaterThan(1);
  expect(o2.flows.pac.steps[0].text).toMatch(/PAC/i);
});
