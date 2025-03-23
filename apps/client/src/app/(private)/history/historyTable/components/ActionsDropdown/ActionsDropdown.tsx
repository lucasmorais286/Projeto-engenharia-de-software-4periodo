import { mappedErrors } from "@common/constants/error";
import { PostEntityWithDetails } from "@common/interfaces/post";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { cancelPost } from "@processes/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { errorToast, successToast } from "@utils/toast";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { SeePostModal } from "../SeePostModal/SeePostModal";

export const ActionsDropdown = ({ post }: { post: PostEntityWithDetails }) => {
  const [isSeeModalOpen, setIsSeeModalOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const queryClient = useQueryClient()

  const { mutate: cancelPostMutation, isPending: isCancelPostPending } = useMutation({
    mutationKey: ['cancelPost'],
    mutationFn: async ({ postId, username }: { postId: string, username: string }) => {
      const response = await cancelPost({
        postId,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });

      // Optmistic UI -> updates the cache with the new post canceled
      queryClient.setQueryData(['history'], (old: { pages: { data: { data: PostEntityWithDetails[], meta: { page: number, limit: number, total: number } } }[] }) => {
        const newPages = old.pages.map(page => ({
          ...page,
          data: {
            ...page.data,
            data: page.data.data.map(item => 
              item._id === post._id 
                ? {...item, canceledAt: new Date()}
                : item
            )
          }
        }));

        return {
          ...old,
          pages: newPages
        }
      })
      successToast("Post cancelado com sucesso")
    },
    onError: (error: Error) => {
      const errorMessage = mappedErrors[error?.message] ?? 'Algo de errado aconteceu, tente novamente.'
      errorToast(errorMessage)
    },
  });

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={!!post.canceledAt}>
            <span className="sr-only">Abrir menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsSeeModalOpen(true)}>
            Visualizar
          </DropdownMenuItem>
          {post.scheduledAt && !post.canceledAt && (
            <DropdownMenuItem
              onSelect={(e) => { e.preventDefault(); cancelPostMutation({ postId: post._id, username: post.account.username }) }
              }
              className="text-red-600"
              disabled={isCancelPostPending}
            >
              {isCancelPostPending ? "Cancelando..." : "Cancelar agendamento"}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <SeePostModal post={post} open={isSeeModalOpen} onOpenChange={setIsSeeModalOpen} />
    </>
  )
}
