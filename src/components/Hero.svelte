<script>
  import { onMount } from 'svelte'

  let { images } = $props()
  // images: [{ lqip, full }]

  let url = $state('')

  onMount(() => {
    if (!images.length) return
    const picked = images[Math.floor(Math.random() * images.length)]
    url = picked.lqip
    const img = new Image()
    img.src = picked.full
    img.onload = () => { url = picked.full }
    return () => { img.onload = null }
  })
</script>

<section
  class="hero"
  style={url ? `background-image: url('${url}')` : ''}
  aria-label="Hero"
>
  <div class="overlay"></div>
  <h1 class="name">Peter Hou</h1>
</section>

<style>
  .hero {
    flex: 1;
    width: 100%;
    min-height: 70vh;
    position: relative;
    background-color: #1a2a3a;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
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

  @media (max-width: 480px) {
    .name {
      padding: 1.75rem 1.5rem;
    }
  }
</style>
