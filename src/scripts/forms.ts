/**
 * Message forms (home contact, support). Mark a form with data-mail-form and data-email="...".
 * With an action (a FormSubmit address from site.json) the message is sent in the background through
 * FormSubmit's AJAX endpoint. With no action, the visitor's email app opens with the message filled in.
 * data-subject sets the email subject; {field} is replaced by that field's value, e.g. "{topic} from {name}".
 */
export function setupMailForms() {
  document.querySelectorAll<HTMLFormElement>('[data-mail-form]').forEach((form) => {
    const note = form.querySelector<HTMLElement>('[data-form-note]');
    const btn = form.querySelector<HTMLButtonElement>('[type="submit"]');
    const email = form.dataset.email || '';
    const action = form.getAttribute('action');
    const say = (text: string, mail = false) => {
      if (!note) return;
      note.textContent = text;
      if (mail) {
        const a = document.createElement('a');
        a.href = `mailto:${email}`;
        a.textContent = email;
        note.append(' ', a, '.');
      }
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const field = (k: string) => String(data.get(k) || '').trim();
      const subject = (form.dataset.subject || '{topic} from {name}').replace(/\{(\w+)\}/g, (_m, k) => field(k)).replace(/\s+/g, ' ').trim();
      const name = field('name');

      if (!action) {
        const lines = [...data.entries()]
          .filter(([k, v]) => !k.startsWith('_') && typeof v === 'string' && v.trim() && k !== 'message')
          .map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)}: ${v}`);
        const body = `${field('message')}\n\n${lines.join('\n')}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        say('Your email app should open now. Press send there and we will get it.');
        return;
      }

      data.set('_subject', subject);
      data.delete('_next');
      if (btn) btn.disabled = true;
      say('Sending…');
      try {
        const res = await fetch(action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || String(json.success) !== 'true') throw new Error(json.message || 'Send failed');
        form.reset();
        say(form.dataset.thanks?.replace('{name}', name) || `Thanks${name ? ', ' + name : ''}. Your message is on its way.`);
      } catch {
        say("Sorry, that didn't send. Please email us at", true);
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  });
}
