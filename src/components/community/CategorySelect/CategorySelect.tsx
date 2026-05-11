import { Dropdown } from '@/components/common/Dropdown'
import type { DropdownOption } from '@/components/common/Dropdown/Dropdown'

interface CategorySelectProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  errorMessage?: string
  disabled?: boolean
}

export function CategorySelect({
  options,
  value,
  onChange,
  errorMessage,
  disabled,
}: CategorySelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-text-heading text-sm font-medium">
        카테고리 <span className="text-error">*</span>
      </span>
      <Dropdown
        options={options}
        value={value}
        onChange={onChange}
        placeholder="카테고리를 선택해 주세요."
        disabled={disabled}
      />
      {errorMessage && (
        <p role="alert" aria-live="polite" className="text-error text-xs">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
