import React from 'react'

import '@testing-library/jest-dom'
import { composeStories } from '@storybook/testing-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as stories from '../../../../../components/layout/MegaMenu/MegaMenu.stories'

const { Common } = composeStories(stories)

describe('[components] - MegaMenu Integration', () => {
  const setup = () => {
    const user = userEvent.setup()
    render(<Common {...Common.args} />)

    return {
      user,
    }
  }

  it('should display menu items and advertisment while hovering on category', async () => {
    const { user } = setup()

    const category = Common.args?.categoryTree?.filter((c) => c?.isDisplayed === true) || []
    const childrenCategories = category[0]?.childrenCategories || []
    const menuItems = screen.getAllByRole('group')
    await user.hover(menuItems[0])

    childrenCategories.forEach((cat) => {
      const name = screen.getByText(cat?.content?.name || '')
      expect(name).toBeVisible()
    })

    const advertisment = screen.getByText('advertisment')
    expect(advertisment).toBeVisible()
  })
})
