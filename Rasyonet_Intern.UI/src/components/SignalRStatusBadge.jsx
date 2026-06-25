const statusConfig = {
  connected: {
    label: 'Bağlı',
    className: 'bg-green-100 text-green-700 border-green-200',
    dotClassName: 'bg-green-500'
  },
  connecting: {
    label: 'Bağlanıyor',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    dotClassName: 'bg-blue-500 animate-pulse'
  },
  reconnecting: {
    label: 'Yeniden bağlanıyor',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dotClassName: 'bg-yellow-500 animate-pulse'
  },
  disconnected: {
    label: 'Bağlantı kapalı',
    className: 'bg-red-100 text-red-700 border-red-200',
    dotClassName: 'bg-red-500'
  }
}

function SignalRStatusBadge({ status }) {
  const config = statusConfig[status] ?? statusConfig.disconnected

  return (
    <div
      className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium ${config.className}`}
      title="SignalR connection status"
      aria-label={`SignalR durumu: ${config.label}`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${config.dotClassName}`}
        aria-hidden="true"
      />
      <span className="whitespace-nowrap">
        {config.label}
      </span>
    </div>
  )
}

export default SignalRStatusBadge
