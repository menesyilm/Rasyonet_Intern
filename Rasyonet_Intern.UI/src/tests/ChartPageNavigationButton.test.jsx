import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import App from '../App'

jest.mock('../services/api', () => ({
    getCategories: jest.fn().mockResolvedValue([]),

    getPurchaseMethodData: jest.fn().mockResolvedValue([]),
    getStoreLocationData: jest.fn().mockResolvedValue([]),
    getMonthlyTrendData: jest.fn().mockResolvedValue([])
}))
jest.mock('../components/PieChart', () => () => <div>PieChart</div>)

jest.mock('../components/BarChart', () => () => <div>BarChart</div>)

jest.mock('../components/LineChart', () => () => <div>LineChart</div>)
describe('ChartsPage Navigation', () => {
    test(
        'ChartsPage_WhenPerformanceButtonClicked_ShouldNavigateToPerformancePage',
        async () => {
            // Arrange
            const user = userEvent.setup()

            render(
                <MemoryRouter initialEntries={['/charts']}>
                    <App />
                </MemoryRouter>
            )

            // Act
            const button =
                await screen.findByRole('link', {
                    name: 'Performans Sayfası'
                })

            await user.click(button)

            // Assert
            expect(
                await screen.findByText('Performans')
            ).toBeInTheDocument()
        }
    )
})