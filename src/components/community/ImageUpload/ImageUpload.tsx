import { useRef, useState } from 'react'
import { Spinner } from '@/components/common/Spinner'
import { usePresignedUrl } from '@/features/posts/write'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

interface ImageUploadProps {
  images: string[]
  onAdd: (url: string) => void
  onRemove: (url: string) => void
}

export function ImageUpload({ images, onAdd, onRemove }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const { mutateAsync: getPresignedUrl } = usePresignedUrl()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError('JPG, PNG, GIF, WEBP 형식만 업로드할 수 있습니다.')
      return
    }

    setUploadError(null)
    setIsUploading(true)

    try {
      const { presigned_url, img_url } = await getPresignedUrl({
        file_name: file.name,
      })
      await fetch(presigned_url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      onAdd(img_url)
    } catch {
      setUploadError('이미지 업로드에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-text-heading text-sm font-medium">
        이미지 첨부 <span className="text-error">*</span>
      </span>
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div key={url} className="relative h-20 w-20">
            <img
              src={url}
              alt="업로드된 이미지"
              className="h-full w-full rounded-sm object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(url)}
              aria-label="이미지 삭제"
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-xs text-white hover:bg-gray-900"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="border-border-base bg-bg-muted text-text-muted hover:border-primary hover:text-primary flex h-20 w-20 flex-col items-center justify-center rounded-sm border border-dashed disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <Spinner size="sm" />
          ) : (
            <span className="text-2xl leading-none">+</span>
          )}
          <span className="mt-1 text-xs">사진 추가</span>
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
      {uploadError && (
        <p role="alert" className="text-error text-xs">
          {uploadError}
        </p>
      )}
    </div>
  )
}
