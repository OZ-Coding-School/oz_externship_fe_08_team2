const MAX_LENGTH = 2000

interface ContentTextareaProps {
  value: string
  onChange: (value: string) => void
  errorMessage?: string
}

export function ContentTextarea({
  value,
  onChange,
  errorMessage,
}: ContentTextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-text-heading text-sm font-medium">
          내용 <span className="text-error">*</span>
        </span>
        <span
          className={`text-xs ${value.length >= MAX_LENGTH ? 'text-error' : 'text-text-muted'}`}
        >
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
      <div
        className={[
          'rounded-sm border transition-colors duration-150',
          errorMessage
            ? 'border-error-dark'
            : 'border-border-base focus-within:border-primary',
        ].join(' ')}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="내용을 입력해 주세요."
          maxLength={MAX_LENGTH}
          rows={12}
          className="text-text-heading placeholder:text-text-muted w-full resize-none bg-transparent px-4 py-3 text-sm leading-relaxed tracking-tight outline-none"
        />
      </div>
      {errorMessage && (
        <p role="alert" aria-live="polite" className="text-error text-xs">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
