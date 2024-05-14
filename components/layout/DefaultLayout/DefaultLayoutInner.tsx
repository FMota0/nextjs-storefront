import React, { ReactElement } from 'react'

import { Container, Stack } from '@mui/material'
import { useRouter } from 'next/router'

import { Footer, KiboHeader, Preview } from '@/components/layout'
import { DialogRoot, SnackbarRoot } from '@/context'

import type { Maybe, PrCategory } from '@/lib/gql/types'

const DefaultLayoutInner = ({
  categoriesTree,
  children,
  className,
  footer,
}: {
  categoriesTree: Maybe<PrCategory>[]
  className: string
  children: ReactElement
  footer: any
}) => {
  const router = useRouter()
  return (
    <Stack className={className} sx={{ minHeight: '100vh' }}>
      <KiboHeader
        navLinks={[
          {
            link: '/order-status',
            text: 'order-status',
          },
          {
            link: '/wishlist',
            text: 'wishlist',
          },
        ]}
        categoriesTree={categoriesTree || []}
        isSticky={true}
      />
      <DialogRoot />
      <SnackbarRoot />
      <Container maxWidth={'xl'} sx={{ py: 2, flex: '1 0 auto' }}>
        {children}
      </Container>
      <Footer content={footer} />
      {router?.isPreview && <Preview />}
    </Stack>
  )
}

export default DefaultLayoutInner
