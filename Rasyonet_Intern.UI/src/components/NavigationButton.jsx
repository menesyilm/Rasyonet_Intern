import { Link } from 'react-router-dom'

function NavigationButton({ to, text }) {
  return (
    <Link
      to={to}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
    >
      {text}
    </Link>
  )
}

export default NavigationButton