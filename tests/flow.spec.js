import { readFileSync } from 'fs';

function load(path) { return JSON.parse(readFileSync(new URL(path, import.meta.url))); }

test('triage issues have codes and steps', () => {
  const o2 = load('../rules/o2.json');
  for (const issue of o2.flows.triage.issues) {
    expect(issue.code).toBeTruthy();
    expect(issue.steps.length).toBeGreaterThan(0);
  }
});
