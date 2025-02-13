import Image from "next/image"

export const UserUi = ({ image, username }: { image?: string, username: string }) => {
  return (
    <div className="flex items-center gap-2">
      {image ? <Image src={image} alt="Profile" width={32} height={32} className="rounded-full" /> : <div className="w-8 h-8 rounded-full bg-gray-200" />}
      <span className="font-medium">{username}</span>
    </div>
  )
}