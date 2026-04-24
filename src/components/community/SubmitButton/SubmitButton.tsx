import { Button } from '@/components/common/Button'

interface SubmitButtonProps {
  label?: string
  loading?: boolean
}

export function SubmitButton({ label = '등록', loading }: SubmitButtonProps) {
  return (
    <Button type="submit" loading={loading} disabled={loading}>
      {label}
    </Button>
  )
}
