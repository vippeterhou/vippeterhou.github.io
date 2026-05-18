<script>
  import { onMount } from 'svelte'

  let { desktop, mobile } = $props()

  let url = $state('')

  onMount(() => {
    const isMobile = window.matchMedia('(orientation: portrait) and (max-width: 480px)').matches
    const images = isMobile && mobile.length ? mobile : desktop
    if (!images.length) return
    url = images[Math.floor(Math.random() * images.length)]
  })
</script>

<section
  class="hero"
  style={url ? `background-image: url('${url}')` : ''}
  aria-label="Hero"
>
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
</style>
