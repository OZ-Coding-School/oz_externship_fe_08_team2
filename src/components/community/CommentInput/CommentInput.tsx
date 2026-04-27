const MAX_LENGTH = 500

export interface CommentInputProps {
  value: string
  onChange: (value: string) => void
  /** 엔터키 제출 시 호출 (commentSubmit 브랜치에서 연결) */
  onSubmit?: () => void
}

export function CommentInput({ value, onChange, onSubmit }: CommentInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      onChange(e.target.value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit?.()
    }
  }

  const isNearLimit = value.length >= MAX_LENGTH * 0.9

  return (
    <div className="flex flex-col gap-1">
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="댓글을 입력하세요... (Shift+Enter로 줄바꿈)"
        rows={3}
        maxLength={MAX_LENGTH}
        aria-label="댓글 입력"
        className="border-border-base bg-bg-base text-text-heading placeholder:text-text-muted focus:border-primary w-full resize-none rounded-sm border px-4 py-3 text-sm transition-colors duration-150 outline-none"
      />
      <p
        className={[
          'text-right text-xs',
          isNearLimit ? 'text-error' : 'text-text-muted',
        ].join(' ')}
      >
        {value.length}/{MAX_LENGTH}
      </p>
    </div>
  )
}
