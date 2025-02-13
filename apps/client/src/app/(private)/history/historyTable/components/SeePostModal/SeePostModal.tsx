import { PostEntityWithDetails } from "@common/interfaces/post";
import { Dialog, DialogContent, DialogTitle } from "@components/ui/dialog";
import { formatToInstagramDate } from "@utils/date";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { SeeCommentsModal } from "./components/SeeCommentsModal/SeeCommentsModal";
import Image from "next/image";
import { DialogProps } from "@radix-ui/react-dialog";

export const SeePostModal = ({ post, ...rest }: { post: PostEntityWithDetails } & DialogProps) => {
  const [seeMoreComment, setSeeMoreComment] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const account = post.account;

  const redirectToInstagramPost = () => {
    window.open(`https://www.instagram.com/p/${post.code}/`, "_blank")
  }

  return (
    <>
      <Dialog {...rest}>
        <DialogContent hideClose className="p-0 bg-white overflow-hidden w-full max-w-md mx-auto">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="flex flex-col h-full">
            <div className=" p-4 border-b  flex items-center justify-between">
              <div className="flex items-center gap-3">
                {account?.profilePicUrl ? <Image src={account.profilePicUrl} alt="Profile" width={32} height={32} className="rounded-full" /> : <div className="w-8 h-8 rounded-full bg-gray-200" />}
                <span className="font-semibold">{account?.username}</span>
              </div>
              <button
                onClick={redirectToInstagramPost}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Ver no Instagram
              </button>
            </div>

            <div className="relative w-full min-h-[350px] bg-black flex items-center justify-center">
              <Image
                src={post.imageUrl}
                fill
                alt="Post"
                className="object-contain"
              />
            </div>

            <div className="p-4">
              <div className="flex gap-4">
                <button className="flex items-center gap-2" disabled>
                  <Heart className="w-7 h-7" fill={post.engagement?.hasLiked ? "red" : "none"} stroke={post.engagement?.hasLiked ? "none" : "currentColor"} />
                  {post.publishedAt && <span className="text-sm font-semibold">{post?.engagement?.likes ?? 0}</span>}
                </button>
                <button className="flex items-center gap-2 transition-all enabled:hover:opacity-70 enabled:hover:translate-y-[-2px]" disabled={!post.publishedAt} onClick={() => setShowComments(true)}>
                  <MessageCircle className="w-7 h-7" />
                  {post.publishedAt && <span className="text-sm font-semibold">{post?.engagement?.comments ?? 0}</span>}
                </button>
              </div>
            </div>

            <div className="px-4 pb-4 max-h-[200px] overflow-y-auto thin-scrollbar">
              <span className="text-sm font-bold mr-1">{account?.username}</span>
              <span className="text-sm overflow-y-auto">
                {post.caption.length > 90 ? !seeMoreComment ?
                  <>
                    {post.caption.slice(0, 90)}...{" "}
                    <button className="text-gray-500 hover:underline" onClick={() => setSeeMoreComment(true)}>
                      ver mais
                    </button>
                  </> : (
                    <>
                      {post.caption}
                      <button className="text-gray-500 hover:underline" onClick={() => setSeeMoreComment(false)}>
                        ver menos
                      </button>
                    </>
                  )
                  : (
                    post.caption
                  )}
              </span>
              <span className="flex gap-4 mt-2 text-xs text-gray-500">
                {post.publishedAt ? formatToInstagramDate(post.publishedAt) : "Ainda não publicado"}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <SeeCommentsModal post={post} open={showComments} redirectToInstagramPost={redirectToInstagramPost} onOpenChange={setShowComments} />
    </>
  )
}