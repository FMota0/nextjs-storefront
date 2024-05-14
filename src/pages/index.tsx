import {
  ComponentRenderData,
  PlasmicComponent,
  PlasmicRootProvider,
} from '@plasmicapp/loader-nextjs'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import getCategoryTree from '@/lib/api/operations/get-category-tree'
import type { CategoryTreeResponse, NextPageWithLayout } from '@/lib/types'
import { createPlasmicLoader, registerDefaultComponents } from '@/plasmic-init'

import type { GetStaticPropsContext } from 'next'

interface HomePageProps {
  carouselItem: any
  categoriesTree: CategoryTreeResponse
  plasmicData?: ComponentRenderData
}

const PLASMIC = createPlasmicLoader()
registerDefaultComponents(PLASMIC)

export async function getStaticProps(context: GetStaticPropsContext) {
  const { locale } = context

  const plasmicData = await PLASMIC.maybeFetchComponentData('Homepage')

  const categoriesTree: CategoryTreeResponse = (await getCategoryTree()) || null

  return {
    props: {
      plasmicData,
      categoriesTree,
      ...(await serverSideTranslations(locale as string, ['common'])),
      isPlasmicPage: true,
    },
  }
}

const Home: NextPageWithLayout<HomePageProps> = (props) => {
  const { plasmicData, categoriesTree } = props
  return (
    <>
      <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
        <PlasmicComponent
          component="Homepage"
          componentProps={{
            innerLayout: {
              categoriesTree,
            },
          }}
        />
      </PlasmicRootProvider>
    </>
  )
}

export default Home
