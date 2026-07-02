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

jest.mock('../services/signalr', () => ({
    createDashboardConnection: jest.fn(() => ({
        start: jest.fn().mockResolvedValue(),
        on: jest.fn(),
        onreconnecting: jest.fn(),
        onreconnected: jest.fn(),
        onclose: jest.fn(),
        off: jest.fn(),
        stop: jest.fn().mockResolvedValue()
    }))
}))

jest.mock('../components/PieChart', () => () => <div>PieChart</div>)

jest.mock('../components/BarChart', () => () => <div>BarChart</div>)

jest.mock('../components/LineChart', () => () => <div>LineChart</div>)
describe('PerformancePage Navigation', () => {
    test(
        'PerformancePage_WhenPortfolioButtonClicked_ShouldNavigateToChartsPage',
        async () => {
            // Arrange
            const user = userEvent.setup()

            render(
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            )

            // Act
            const button =
                await screen.findByRole('link', {
                    name: 'Portföy Dağılımı'
                })

            await user.click(button)

            // Assert
            expect(
                await screen.findByText('Grafikler')
            ).toBeInTheDocument()
        }
    )
})
