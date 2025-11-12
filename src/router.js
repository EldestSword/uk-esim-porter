export function route() {
  const hash = (location.hash || '#/').replace(/^#/, '');
  const [path, q] = hash.split('?');
  const params = Object.fromEntries(new URLSearchParams(q || ''));
  return { path, params };
}

export function navigate(to) {
  if (!to.startsWith('#')) to = `#${to}`;
  if (location.hash === to) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    location.hash = to;
  }
}
