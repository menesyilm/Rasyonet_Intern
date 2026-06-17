import { HiOutlineFunnel } from 'react-icons/hi2'

function SortButton({ column, sortConfig, onSort }) {
  const getIcon = () => {
    if (sortConfig.key !== column) {
      return '↕'
    }

    return sortConfig.direction === 'asc'
      ? '↑'
      : '↓'
  }

  return (
    <button
      onClick={() => onSort(column)}
      className="ml-2 inline-flex items-center gap-1 text-gray-500 hover:text-green-600"
    >
      <HiOutlineFunnel size={16} />
      <span className="text-xs">{getIcon()}</span>
    </button>
  )
}

export default SortButton