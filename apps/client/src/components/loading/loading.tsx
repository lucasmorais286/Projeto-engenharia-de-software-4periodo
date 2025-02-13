import { cn } from "@lib/utils"

export const Loading = ({ containerClassName }: { containerClassName?: string }) => {
  return (
    <div className={cn("flex items-center justify-center", containerClassName)}>
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
      <span className="ml-4 text-gray-600">Carregando...</span>
    </div>

  )
}
