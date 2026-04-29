import { Button } from '@/components/common/Button'

export interface PostAuthorActionsProps {
  onEdit: () => void
  onDelete: () => void
}

export function PostAuthorActions({
  onEdit,
  onDelete,
}: PostAuthorActionsProps) {
  return (
    <div className="flex items-center justify-end gap-0">
      <Button
        variant="ghost"
        onClick={onEdit}
        className="text-primary hover:bg-primary-50 h-auto! rounded-sm! px-4! py-2.5! text-base! font-normal! transition-colors"
      >
        수정
      </Button>
      <span className="inline-block h-6 w-px bg-gray-300" aria-hidden="true" />
      <Button
        variant="ghost"
        onClick={onDelete}
        className="h-auto! rounded-sm! px-4! py-2.5! text-base! font-normal! text-gray-500! transition-colors hover:bg-gray-100!"
      >
        삭제
      </Button>
    </div>
  )
}
