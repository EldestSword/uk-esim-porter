import { route, navigate } from './router.js';
import { el } from './ui.js';
import { loadRules } from './rules.js';
import { CARRIERS } from './carriers.js';

function carrierPicker(current) {
  return el('div', { class: 'card' }, [
    el('label', {}, ['Choose carrier']),
    el('select', { class: 'select', id: 'carrier' },
      CARRIERS.map(c =>
        el('option', { value: c.id, ...(c.id === current ? { selected: '' } : {}) }, c.label)
      )
    ),
    el('div', { style: 'margin-top:12px' }, [
      el('button', { class: 'btn', onClick: () => {
        const id = document.getElementById('carrier').value;
        const { path } = route();
        navigate(`${path}?carrier=${encodeURIComponent(id)}`);
      }}, 'Apply')
    ])
  ]);
}

function stepsCard(title, steps) {
  return el('div', { class: 'card' }, [
    el('h2', {}, title),
    el('ul', { class: 'steps' },
      steps.map(s => el('li', {}, [
        el('div', { html: s.html || s.text }),
        s.link ? el('div', { class: 'note' }, [
          'Help: ', el('a', { class: 'link', href: s.link, target: '_blank', rel: 'noopener' }, s.linkLabel || s.link)
        ]) : null
      ]))
    )
  ]);
}

function homeView(rules) {
  return el('div', {}, [
    carrierPicker(rules.meta.id),
    stepsCard('What this does', [
      { text: 'Helps you add an eSIM to a supported device using a QR code.' },
      { text: 'Guides you to get a PAC code from your current provider so you can keep your number.' },
      { text: 'Walks through common activation errors and fixes.' },
    ]),
    el('div', { class: 'card' }, [
      el('h2', {}, 'Start'),
      el('div', {}, [
        el('button', { class: 'btn primary', onClick: () => navigate(`#/scan-qr?carrier=${rules.meta.id}`) }, 'Scan QR (eSIM)'),
        ' ',
        el('button', { class: 'btn', onClick: () => navigate(`#/pac?carrier=${rules.meta.id}`) }, 'Use PAC'),
        ' ',
        el('button', { class: 'btn', onClick: () => navigate(`#/triage?carrier=${rules.meta.id}`) }, 'Error Triage')
      ])
    ])
  ]);
}

function scanQrView(rules) {
  const flow = rules.flows.scan_qr;
  return el('div', {}, [
    carrierPicker(rules.meta.id),
    stepsCard('Scan eSIM QR', flow.steps),
    el('div', { class: 'card' }, [
      el('h3', {}, 'Tips'),
      el('ul', {}, flow.tips.map(t => el('li', {}, t)))
    ])
  ]);
}

function pacView(rules) {
  const flow = rules.flows.pac;
  return el('div', {}, [
    carrierPicker(rules.meta.id),
    stepsCard('Keep your number with a PAC', flow.steps),
    el('div', { class: 'card' }, [
      el('h3', {}, 'Notes'),
      el('ul', {}, flow.notes.map(n => el('li', {}, n)))
    ])
  ]);
}

function triageView(rules) {
  const { issues } = rules.flows.triage;
  return el('div', {}, [
    carrierPicker(rules.meta.id),
    el('div', { class: 'card' }, [
      el('h2', {}, 'Troubleshooting'),
      el('label', {}, 'Select an error'),
      el('select', { class: 'select', id: 'issue' },
        issues.map(i => el('option', { value: i.code }, `${i.code} — ${i.title}`))
      ),
      el('div', { style: 'margin-top:12px' }, [
        el('button', { class: 'btn', onClick: () => {
          const code = document.getElementById('issue').value;
          const match = issues.find(i => i.code === code);
          const area = document.getElementById('issue-detail');
          area.innerHTML = '';
          area.appendChild(stepsCard(match.title, match.steps));
        } }, 'Show fix')
      ])
    ]),
    el('div', { id: 'issue-detail' })
  ]);
}

async function render() {
  const root = document.querySelector('#app');
  const { path, params } = route();
  const rules = await loadRules(params.carrier || 'o2');

  const view = {
    '/': homeView,
    '/scan-qr': scanQrView,
    '/pac': pacView,
    '/triage': triageView,
  }[path] || homeView;

  root.innerHTML = '';
  root.appendChild(view(rules));
}

export function mount(root) {
  window.addEventListener('hashchange', render);
  render();
}
