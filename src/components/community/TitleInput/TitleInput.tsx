import { Input } from '@/components/common/Input'

const MAX_LENGTH = 100

interface TitleInputProps {
  value: string
  onChange: (value: string) => void
  errorMessage?: string
}

export function TitleInput({ value, onChange, errorMessage }: TitleInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-text-heading text-sm font-medium">
          제목 <span className="text-error">*</span>
        </span>
        <span
          className={`text-xs ${value.length >= MAX_LENGTH ? 'text-error' : 'text-text-muted'}`}
        >
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="제목을 입력해 주세요."
        maxLength={MAX_LENGTH}
        errorMessage={errorMessage}
        isError={!!errorMessage}
      />
    </div>
  )
}
