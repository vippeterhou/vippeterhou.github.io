<script>
  import { onMount } from 'svelte'

  let { images } = $props()
  // images: [{ thumb, full, width, height, alt }]

  onMount(async () => {
    const [{ default: PhotoSwipeLightbox }] = await Promise.all([
      import('photoswipe/lightbox'),
    ])
    await import('photoswipe/style.css')

    const lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery',
      children: 'a.gallery-item',
      pswpModule: () => import('photoswipe'),
    })
    lightbox.init()

    return () => lightbox.destroy()
  })
</script>

<div id="gallery" class="masonry">
  {#each images as img}
    <a
      class="gallery-item"
      href={img.full}
      data-pswp-width={img.width}
      data-pswp-height={img.height}
      target="_blank"
      rel="noopener"
    >
      <img
        src={img.thumb}
        alt={img.alt}
        loading="lazy"
        decoding="async"
      />
    </a>
  {/each}
</div>

<style>
  .masonry {
    columns: 3;
    column-gap: 8px;
  }

  .gallery-item {
    display: block;
    break-inside: avoid;
    margin-bottom: 8px;
    overflow: hidden;
    border-radius: 4px;
    cursor: zoom-in;
  }

  .gallery-item img {
    width: 100%;
    display: block;
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  .gallery-item:hover img {
    transform: scale(1.02);
    filter: brightness(0.92);
  }

  @media (max-width: 768px) {
    .masonry { columns: 2; }
  }

  @media (max-width: 480px) {
    .masonry { columns: 1; }
  }
</style>
