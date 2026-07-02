<script>
  import { onMount } from 'svelte'

  let { desktop, mobile } = $props()

  let url = $state('')
  let loaded = $state(false)

  onMount(() => {
    const isMobile = window.matchMedia('(orientation: portrait) and (max-width: 480px)').matches
    const images = isMobile && mobile.length ? mobile : desktop
    if (!images.length) return
    url = images[Math.floor(Math.random() * images.length)]

    const img = new Image()
    img.onload = () => { loaded = true }
    img.onerror = () => { loaded = true }
    img.src = url
  })
</script>

<section
  class="hero"
  style={loaded && url ? `background-image: url('${url}')` : ''}
  class:loaded={loaded && url}
  aria-label="Hero"
>
  {#if url && !loaded}
    <div class="loader" aria-hidden="true">
      <div class="spinner"></div>
    </div>
  {/if}
  <div class="overlay"></div>
  <h1 class="name">
    {#each 'Peter Hou'.split('') as char, i}
      <span class="letter" style="animation-delay: {i * 0.12}s">{char === ' ' ? '\u00A0' : char}</span>
    {/each}
  </h1>
</section>

<style>
  .hero {
    flex: 1;
    width: 100%;
    min-height: 70vh;
    position: relative;
    background-color: var(--bg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    overflow: hidden;
  }

  /* Animated shimmer placeholder shown until the image loads */
  .hero:not(.loaded)::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      100deg,
      var(--bg-secondary) 30%,
      color-mix(in srgb, var(--bg-secondary) 60%, var(--border)) 50%,
      var(--bg-secondary) 70%
    );
    background-size: 200% 100%;
    animation: hero-shimmer 1.4s ease-in-out infinite;
  }

  .hero.loaded {
    animation: hero-fade-in 0.6s ease forwards;
  }

  @keyframes hero-shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  @keyframes hero-fade-in {
    from { background-color: var(--bg-secondary); }
    to   { background-color: var(--bg); }
  }

  .loader {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .spinner {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 3px solid color-mix(in srgb, var(--text-muted) 30%, transparent);
    border-top-color: var(--accent);
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.55) 0%,
      rgba(0, 0, 0, 0.15) 50%,
      transparent 100%
    );
    pointer-events: none;
  }

  .name {
    position: relative;
    z-index: 1;
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #ffffff;
    padding: 2.5rem 3rem;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  }

  .letter {
    display: inline-block;
    opacity: 0;
    transform: translateY(-40px);
    animation: letter-drop 0.6s ease forwards;
  }

  @keyframes letter-drop {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    .name {
      padding: 1.75rem 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero:not(.loaded)::before,
    .hero.loaded,
    .spinner {
      animation: none;
    }
  }
</style>
