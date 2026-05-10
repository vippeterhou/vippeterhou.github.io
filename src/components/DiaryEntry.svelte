<script>
  import { onMount } from 'svelte'

  const apiKey = import.meta.env.PUBLIC_NYT_API_KEY

  let entry  = $state(null)
  let loading = $state(true)

  onMount(async () => {
    try {
      const url = new URL('https://api.nytimes.com/svc/search/v2/articlesearch.json')
      url.searchParams.set('q', 'Metropolitan Diary')
      url.searchParams.set('sort', 'newest')
      url.searchParams.set('api-key', apiKey)

      const res  = await fetch(url)
      const data = await res.json()
      const doc  = data?.response?.docs?.[0]

      if (doc) {
        entry = {
          headline: doc.headline?.main ?? '',
          abstract: doc.abstract ?? doc.snippet ?? '',
          date:     new Date(doc.pub_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          byline:   doc.byline?.original ?? '',
          url:      doc.web_url,
        }
      }
    } catch {}
    loading = false
  })
</script>

{#if loading}
  <p class="state">Loading…</p>
{:else if entry}
  <article class="entry">
    <h2 class="entry-headline">{entry.headline}</h2>
    {#if entry.byline}<p class="entry-byline">{entry.byline}</p>{/if}
    <p class="entry-date">{entry.date}</p>
    <hr class="divider" />
    <p class="entry-abstract">{entry.abstract}</p>
    <a class="read-link" href={entry.url} target="_blank" rel="noopener">
      Read in full on NYT →
    </a>
  </article>
{:else}
  <p class="state">Could not load entry.</p>
{/if}

<style>
  .state {
    font-size: 0.9375rem;
    color: var(--text-muted);
  }

  .entry {
    max-width: 640px;
  }

  .entry-headline {
    font-size: 1.375rem;
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 0.5rem;
  }

  .entry-byline {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin-bottom: 0.25rem;
  }

  .entry-date {
    font-size: 0.8125rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }

  .entry-abstract {
    font-size: 1.0625rem;
    line-height: 1.75;
    margin-bottom: 1.75rem;
  }

  .read-link {
    display: inline-block;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--accent);
    border-bottom: 1px solid var(--accent);
    padding-bottom: 0.1rem;
    transition: opacity var(--transition);
  }

  .read-link:hover {
    opacity: 0.7;
  }
</style>
