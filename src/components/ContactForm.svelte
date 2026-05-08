<script>
  const FORM_ID = 'xkoyzaqo'

  let name = ''
  let email = ''
  let message = ''
  let status = 'idle' // idle | submitting | success | error

  async function handleSubmit(e) {
    e.preventDefault()
    status = 'submitting'

    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (res.ok) {
        status = 'success'
        name = ''
        email = ''
        message = ''
      } else {
        status = 'error'
      }
    } catch {
      status = 'error'
    }
  }
</script>

{#if status === 'success'}
  <p class="feedback success">Message sent — I'll get back to you soon.</p>
{:else}
  <form onsubmit={handleSubmit} novalidate>
    <div class="row">
      <div class="field">
        <label for="name">Name</label>
        <input id="name" type="text" bind:value={name} required placeholder="Your name" />
      </div>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" bind:value={email} required placeholder="your@email.com" />
      </div>
    </div>

    <div class="field">
      <label for="message">Message</label>
      <textarea id="message" bind:value={message} required rows="5" placeholder="Write your message..."></textarea>
    </div>

    {#if status === 'error'}
      <p class="feedback error">Something went wrong. Please try again.</p>
    {/if}

    <button type="submit" disabled={status === 'submitting'}>
      {status === 'submitting' ? 'Sending…' : 'Send Message'}
    </button>
  </form>
{/if}

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.03em;
  }

  input, textarea {
    font-family: inherit;
    font-size: 0.9375rem;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.625rem 0.75rem;
    outline: none;
    resize: vertical;
    transition: border-color 0.2s ease;
  }

  input:focus, textarea:focus {
    border-color: var(--accent);
  }

  button {
    align-self: flex-start;
    font-family: var(--font-display);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--bg);
    background: var(--accent);
    border: none;
    border-radius: var(--radius);
    padding: 0.625rem 1.5rem;
    cursor: pointer;
    transition: background 0.2s ease, opacity 0.2s ease;
  }

  button:hover:not(:disabled) {
    background: var(--accent-hover);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .feedback {
    font-size: 0.9rem;
  }

  .success { color: #2d7a3a; }
  .error   { color: #b91c1c; }

  @media (max-width: 520px) {
    .row {
      grid-template-columns: 1fr;
    }
  }
</style>
