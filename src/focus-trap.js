export function trapFocus(container) {
  const focusableSelector = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const nodes = Array.from(container.querySelectorAll(focusableSelector));
  if (!nodes.length) return () => {};
  const first = nodes[0];
  const last = nodes[nodes.length - 1];

  function onKey(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  container.addEventListener('keydown', onKey);
  return () => container.removeEventListener('keydown', onKey);
}
