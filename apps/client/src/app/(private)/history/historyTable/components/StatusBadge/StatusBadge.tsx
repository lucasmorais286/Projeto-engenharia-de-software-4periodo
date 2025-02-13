export const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    canceled: "bg-red-100 text-red-800",
    published: "bg-green-100 text-green-800",
    scheduled: "bg-blue-100 text-blue-800",
  }

  const getStatusStyle = () => {
    switch (status) {
      case "Cancelado": return styles.canceled
      case "Publicado": return styles.published
      case "Agendado": return styles.scheduled
    }
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle()}`}>
      {status}
    </span>
  )
}
