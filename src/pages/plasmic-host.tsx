import * as React from 'react'

import { PlasmicCanvasHost } from '@plasmicapp/loader-nextjs'

import { createPlasmicLoader, registerDefaultComponents } from '@/plasmic-init'
import { registerPDPComponents } from '@/src/pages/product/[productCode]'

const PLASMIC = createPlasmicLoader()
registerDefaultComponents(PLASMIC)
registerPDPComponents(PLASMIC)

export default function PlasmicHost() {
  return PLASMIC && <PlasmicCanvasHost />
}

export function getStaticProps() {
  return {
    props: {
      isPlasmicPage: true,
    },
  }
}
