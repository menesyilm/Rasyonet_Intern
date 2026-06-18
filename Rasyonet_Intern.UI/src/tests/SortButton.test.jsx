import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SortButton from '../components/SortButton'

describe('SortButton', () => {
    test(
        'SortButton_WhenClicked_ShouldCallOnSortWithColumn',
        async () => {
            // Arrange
            const user = userEvent.setup()

            const onSortMock = jest.fn()

            render(
                <SortButton
                    column="price"
                    sortConfig={{
                        key: null,
                        direction: 'asc'
                    }}
                    onSort={onSortMock}
                />
            )

            // Act
            const button = screen.getByRole('button')

            await user.click(button)

            // Assert
            expect(onSortMock).toHaveBeenCalledTimes(1)

            expect(onSortMock).toHaveBeenCalledWith(
                'price'
            )
        }
    )
})