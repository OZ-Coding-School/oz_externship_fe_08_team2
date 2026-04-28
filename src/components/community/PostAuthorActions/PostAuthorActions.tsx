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
      <button
        type="button"
        onClick={onEdit}
        className="text-primary hover:bg-primary-50 rounded-sm px-4 py-2.5 text-base font-normal transition-colors"
      >
        수정
      </button>
      <span className="inline-block h-6 w-px bg-gray-300" aria-hidden="true" />
      <button
        type="button"
        onClick={onDelete}
        className="rounded-sm px-4 py-2.5 text-base font-normal text-gray-500 transition-colors hover:bg-gray-100"
      >
        삭제
      </button>
    </div>
  )
}
