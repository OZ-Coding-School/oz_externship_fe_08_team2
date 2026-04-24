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
    <div className="flex items-center justify-end gap-2 pt-3">
      <Button variant="secondary" size="sm" onClick={onEdit}>
        수정
      </Button>
      <Button variant="danger" size="sm" onClick={onDelete}>
        삭제
      </Button>
    </div>
  )
}
