import {
  ComponentRenderData,
  NextJsPlasmicComponentLoader,
  PlasmicComponent,
  PlasmicRootProvider,
} from '@plasmicapp/loader-nextjs'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { ProductDetailTemplate, ProductDetailSkeleton } from '@/components/page-templates'
import { useGetProduct } from '@/hooks'
import { getProduct, getCategoryTree, productSearch } from '@/lib/api/operations'
import { productGetters } from '@/lib/getters'
import { buildProductPath } from '@/lib/helpers'
import type { CategorySearchParams, MetaData, PageWithMetaData } from '@/lib/types'
import { createPlasmicLoader, registerDefaultComponents } from '@/plasmic-init'

import { PrCategory, Product } from '@/lib/gql/types'
import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  NextPage,
} from 'next'

const { serverRuntimeConfig } = getConfig()

interface ProductPageType extends PageWithMetaData {
  categoriesTree?: PrCategory[]
  plasmicData?: ComponentRenderData
  product?: Product
  productWithPreview?: Product
  isPreview?: boolean
}

function getMetaData(product: Product): MetaData {
  return {
    title: product?.content?.metaTagTitle || null,
    description: product?.content?.metaTagDescription || null,
    keywords: product?.content?.metaTagKeywords || null,
    canonicalUrl: null,
    robots: null,
  }
}

const PLASMIC = createPlasmicLoader()
registerDefaultComponents(PLASMIC)
registerPDPComponents(PLASMIC)

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<any>> {
  const { locale, params } = context
  const { productCode } = params as any

  const product = await getProduct(productCode)
  const categoriesTree = await getCategoryTree()
  const plasmicData = await PLASMIC.maybeFetchComponentData('ProductPage')

  if (!product) {
    return { notFound: true }
  }
  return {
    props: {
      plasmicData,
      product,
      categoriesTree,
      metaData: getMetaData(product),
      ...(await serverSideTranslations(locale as string, ['common'])),
      isPlasmicPage: true,
    },
    revalidate: parseInt(serverRuntimeConfig.revalidate),
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const { serverRuntimeConfig } = getConfig()
  const { staticPathsMaxSize } = serverRuntimeConfig?.pageConfig?.productDetail || {}
  const searchResult = await productSearch({
    pageSize: parseInt(staticPathsMaxSize),
  } as CategorySearchParams)
  const items = searchResult?.data?.products?.items || []

  const paths: string[] = items.map(buildProductPath)
  return { paths, fallback: true }
}

const ProductDetailPage: NextPage<ProductPageType> = (props) => {
  const { product, plasmicData } = props
  const router = useRouter()

  const { isFallback, query } = router

  const { data: productResponse } = useGetProduct(query)

  if (isFallback) {
    return <ProductDetailSkeleton />
  }

  const breadcrumbs = product ? productGetters.getBreadcrumbs(product) : []

  return (
    <>
      <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
        <PlasmicComponent
          component="ProductPage"
          componentProps={{
            pdp: {
              product: {
                ...product,
                ...productResponse,
              },
              breadcrumbs,
            },
          }}
        />
      </PlasmicRootProvider>
    </>
  )
}

export function registerPDPComponents(loader: NextJsPlasmicComponentLoader) {
  loader.registerComponent(ProductDetailTemplate, {
    name: 'ProductDetailTemplate',
    props: {
      product: {
        type: 'object',
      },
      breadcrumbs: {
        type: 'array',
        itemType: {
          type: 'object',
          fields: {
            link: {
              type: 'string',
            },
            text: {
              type: 'string',
            },
          },
        },
      },
      children: {
        type: 'slot',
      },
    },
  })
}

export default ProductDetailPage
