import { Dialog, DialogContent } from "@components/ui/dialog"
import { PostEntityWithDetails } from "@common/interfaces/post"
import { Button } from "@components/button"
import { DialogTitle } from "@components/ui/dialog"
import { formatToInstagramDate } from "@utils/date"
import { ArrowLeft, BadgeCheck } from "lucide-react"
import Image from "next/image"
import { DialogProps } from "@radix-ui/react-dialog"

export const SeeCommentsModal = ({ post, onOpenChange, redirectToInstagramPost, ...rest }: { post: PostEntityWithDetails, redirectToInstagramPost: () => void } & DialogProps) => {
  return (
    <Dialog {...rest} onOpenChange={onOpenChange} >
      <DialogTitle className="hidden"></DialogTitle>
      <DialogContent hideClose className="p-0 bg-white overflow-hidden w-full max-w-md mx-auto">
        <div className="p-4 border-b flex items-center">
          <button onClick={() => onOpenChange?.(false)} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-semibold">Comentários</span>
        </div>

        <div className="flex justify-between flex-col">
          <div className="p-4 space-y-4 overflow-y-auto thin-scrollbar h-[420px]">
            {post.comments?.recent.map((comment, index) => (
              <div key={index} className="flex items-start gap-3">
                <Image
                  src={comment.user.profile_pic_url}
                  alt={comment.user.username}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex flex-col gap-1">
                  <span>
                    <span className="font-semibold text-sm mr-1">{comment.user.username}</span>
                    {comment.user.verified && <BadgeCheck className="w-[14px] h-[14px] inline mr-1 rounded-full" fill="#3b82f6 " color="white"/>}
                    <span className="text-sm">{comment.text} asdf asdlfj alsdfjak sldf</span>

                  </span>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>{formatToInstagramDate(new Date(comment.created_at))}</span>
                    <span>{comment.like_count} curtidas </span>
                  </div>
                </div>
              </div>
            ))}
            {post.comments?.recent.length === 0 && (
              <div className="flex items-center justify-center px-4 pb-4">
                <span className="text-sm text-gray-500">Nenhum comentário encontrado</span>
              </div>
            )}
          </div>
          {post.comments?.has_more && (
            <div className="flex items-center justify-center px-4 pb-4">
              <Button variant="outline" className="w-full" onClick={redirectToInstagramPost}>
                Ver mais comentários
              </Button>
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  )
}
