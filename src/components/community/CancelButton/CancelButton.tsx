import { Button } from '@/components/common/Button'

interface CancelButtonProps {
  onClick: () => void
}

export function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <Button type="button" variant="secondary" onClick={onClick}>
      취소
    </Button>
  )
}
