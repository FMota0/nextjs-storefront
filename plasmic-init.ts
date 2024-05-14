import { NextJsPlasmicComponentLoader, initPlasmicLoader } from '@plasmicapp/loader-nextjs'

import KiboHeroCarousel from '@/components/home/Carousel/KiboHeroCarousel'
import DefaultLayoutInner from '@/components/layout/DefaultLayout/DefaultLayoutInner'

export function createPlasmicLoader() {
  return initPlasmicLoader({
    projects: [
      {
        id: 'cxyW4F4gfDjbN4srhM5a8n', // ID of a project you are using
        token: 'aEUR2ZcsjIK5s1n3XaPWXVkdpPnp6aZxIxt4Ksk7AOaG73qvN6cpAkbliqr2qocnQ8wCAh0ApKN4dSQ', // API token for that project
      },
    ],
    // Fetches the latest revisions, whether or not they were unpublished!
    // Disable for production to ensure you render only published changes.
    preview: true,
  })
}

export function registerDefaultComponents(loader: NextJsPlasmicComponentLoader) {
  loader.registerComponent(DefaultLayoutInner, {
    name: 'DefaultLayoutInner',
    props: {
      children: {
        type: 'slot',
      },
    },
  })

  loader.registerComponent(KiboHeroCarousel, {
    name: 'KiboHeroCarousel',
    props: {
      carouselItem: {
        type: 'array',
      },
    },
  })
}
