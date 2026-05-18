<script>
  import { onMount } from 'svelte'

  const apiKey  = import.meta.env.PUBLIC_NYT_API_KEY
  const GIST_ID = import.meta.env.PUBLIC_DIARY_GIST_ID

  let entries = $state([])
  let loading = $state(true)

  onMount(async () => {
    try {
      const [nytRes, giftMap] = await Promise.all([
        fetch((() => {
          const url = new URL('https://api.nytimes.com/svc/search/v2/articlesearch.json')
          url.searchParams.set('fq', 'kicker:("Metropolitan Diary")')
          url.searchParams.set('sort', 'newest')
          url.searchParams.set('api-key', apiKey)
          return url
        })()),
        GIST_ID
          ? fetch(`https://gist.githubusercontent.com/vippeterhou/${GIST_ID}/raw/diary-gift.json`)
              .then(r => r.json()).catch(() => ({}))
          : Promise.resolve({}),
      ])

      const data = await nytRes.json()
      const docs = (data?.response?.docs ?? []).filter(d => d.web_url?.includes('metropolitan-diary'))

      entries = docs.slice(0, 4).map(doc => {
        const dateKey = doc.pub_date?.slice(0, 10) ?? ''
        const giftUrl = giftMap[dateKey] || ''
        return {
          headline: doc.headline?.main ?? '',
          abstract: doc.abstract ?? doc.snippet ?? '',
          date:     new Date(doc.pub_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          byline:   doc.byline?.original ?? '',
          url:      giftUrl || doc.web_url,
          isGift:   !!giftUrl,
        }
      })
    } catch {}
    loading = false
  })
</script>

{#if loading}
  <p class="state">Loading…</p>
{:else if entries.length}
  <article class="entry">
    {#if entries[0].byline}<p class="entry-byline">{entries[0].byline}</p>{/if}
    <p class="entry-date">{entries[0].date}</p>
    <p class="entry-abstract"><span class="entry-headline">{entries[0].headline}</span>{entries[0].abstract}</p>
    <a class="read-link" href={entries[0].url} target="_blank" rel="noopener">
      Read in full on NYT →
    </a>
    {#if entries[0].isGift}
      <p class="gift-note">No subscription needed — I got your back.</p>
    {/if}
  </article>

  {#if entries.length > 1}
    <hr class="divider" />
    <p class="past-label">Past Editions</p>
    <ul class="past-list">
      {#each entries.slice(1) as entry}
        <li>
          <a href={entry.url} target="_blank" rel="noopener" class="past-link">
            <span class="past-headline">{entry.headline}</span>
            <span class="past-date">{entry.date}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
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
    display: block;
    font-weight: 600;
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
    margin-bottom: 0.75rem;
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

  .gift-note {
    font-size: 0.8125rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
    font-style: italic;
  }

  .divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 2.5rem 0;
    max-width: 640px;
  }

  .past-label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }

  .past-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .past-link {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
    transition: color var(--transition);
  }

  .past-link:hover {
    color: var(--accent);
  }

  .past-headline {
    font-size: 0.9375rem;
    font-weight: 500;
  }

  .past-date {
    font-size: 0.75rem;
    color: var(--text-muted);
    white-space: nowrap;
  }
</style>
