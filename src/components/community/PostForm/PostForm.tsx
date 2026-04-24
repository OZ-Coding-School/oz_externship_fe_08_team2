import { useMemo, useState } from 'react'
import MDEditor, {
  commands as mdCommands,
  type ICommand,
} from '@uiw/react-md-editor'
import type { Category } from '@/features/posts/categories'
import { Dropdown } from '@/components/common/Dropdown'
import { usePresignedUrl } from '@/features/posts/write'
import { SubmitButton } from '../SubmitButton'
import { CancelButton } from '../CancelButton'

interface PostFormValues {
  categoryId: string
  title: string
  content: string
}

interface PostFormErrors {
  categoryId?: string
  title?: string
  content?: string
}

export interface PostFormSubmitValues {
  title: string
  content: string
  category_id: number
}

export interface PostFormProps {
  mode: 'write' | 'edit'
  categories: Category[]
  isCategoriesError: boolean
  isCategoriesLoading: boolean
  defaultValues?: Partial<PostFormValues>
  onSubmit: (values: PostFormSubmitValues) => void
  onCancel: () => void
  isPending: boolean
}

const TITLE_MAX = 100
const CONTENT_MAX = 2000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

export function PostForm({
  mode,
  categories,
  isCategoriesError,
  isCategoriesLoading,
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
}: PostFormProps) {
  const [values, setValues] = useState<PostFormValues>(() => ({
    categoryId: defaultValues?.categoryId ?? '',
    title: defaultValues?.title ?? '',
    content: defaultValues?.content ?? '',
  }))
  const [errors, setErrors] = useState<PostFormErrors>({})
  const [imageError, setImageError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { mutateAsync: getPresignedUrl } = usePresignedUrl()

  const categoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: c.name,
  }))

  const handleChange = <K extends keyof PostFormValues>(
    key: K,
    value: PostFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  const validate = (): boolean => {
    const next: PostFormErrors = {}
    if (!values.categoryId) next.categoryId = '카테고리를 선택해 주세요.'
    if (!values.title.trim()) next.title = '제목을 입력해 주세요.'
    if (!values.content.trim()) {
      next.content = '내용을 입력해 주세요.'
    } else if (values.content.length > CONTENT_MAX) {
      next.content = `내용은 ${CONTENT_MAX}자 이내로 입력해 주세요.`
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      title: values.title,
      content: values.content,
      category_id: Number(values.categoryId),
    })
  }

  // 마크다운 에디터의 기본 이미지 버튼을 presigned URL 업로드로 덮어쓰기
  const imageCommand: ICommand = useMemo(
    () => ({
      name: 'image',
      keyCommand: 'image',
      buttonProps: {
        'aria-label': '이미지 업로드',
        title: '이미지 업로드',
      },
      icon: (
        <svg width="13" height="13" viewBox="0 0 20 20">
          <path
            fill="currentColor"
            d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 6V4h16v11z"
          />
        </svg>
      ),
      execute: (_state, api) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = ACCEPTED_IMAGE_TYPES.join(',')
        input.onchange = async () => {
          const file = input.files?.[0]
          if (!file) return

          if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            setImageError('JPG, PNG, GIF, WEBP 형식만 업로드할 수 있습니다.')
            return
          }

          setImageError(null)
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
            api.replaceSelection(`![${file.name}](${img_url})`)
          } catch {
            setImageError('이미지 업로드에 실패했습니다. 다시 시도해 주세요.')
          } finally {
            setIsUploading(false)
          }
        }
        input.click()
      },
    }),
    [getPresignedUrl]
  )

  // 기본 툴바에서 image 명령만 위 커스텀 버전으로 교체
  const editorCommands = useMemo(
    () =>
      mdCommands
        .getCommands()
        .map((c) => (c.name === 'image' ? imageCommand : c)),
    [imageCommand]
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* 카테고리 + 제목 카드 */}
      <div className="border-border-base bg-bg-base flex flex-col gap-4 rounded-lg border p-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-text-heading text-sm font-medium">
            카테고리
          </label>
          <Dropdown
            options={categoryOptions}
            value={values.categoryId}
            onChange={(v) => handleChange('categoryId', v)}
            placeholder="카테고리를 선택해 주세요."
            disabled={isCategoriesLoading || isCategoriesError}
          />
          {errors.categoryId && (
            <p className="text-error text-xs" role="alert">
              {errors.categoryId}
            </p>
          )}
          {isCategoriesError && (
            <p className="text-error text-xs" role="alert">
              카테고리를 불러오는데 실패했습니다.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-text-heading text-sm font-medium">제목</label>
          <div
            className={[
              'flex items-center rounded-sm border px-4 transition-colors duration-150',
              'bg-primary-50 border-primary-200 focus-within:border-primary',
              errors.title ? 'border-error-dark' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <input
              type="text"
              value={values.title}
              maxLength={TITLE_MAX}
              placeholder="제목을 입력해 주세요."
              onChange={(e) => handleChange('title', e.target.value)}
              className="text-text-heading placeholder:text-text-muted h-12 w-full bg-transparent text-base outline-none"
            />
            <span className="text-text-muted ml-2 shrink-0 text-xs">
              {values.title.length}/{TITLE_MAX}
            </span>
          </div>
          {errors.title && (
            <p className="text-error text-xs" role="alert">
              {errors.title}
            </p>
          )}
        </div>
      </div>

      {/* 에디터 카드 */}
      <div className="border-border-base bg-bg-base flex flex-col gap-1.5 rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <label className="text-text-heading text-sm font-medium">내용</label>
          <span
            className={`text-xs ${
              values.content.length > CONTENT_MAX
                ? 'text-error'
                : 'text-text-muted'
            }`}
          >
            {values.content.length}/{CONTENT_MAX}
          </span>
        </div>
        <div data-color-mode="light">
          <MDEditor
            value={values.content}
            onChange={(v) => handleChange('content', v ?? '')}
            height={480}
            preview="live"
            commands={editorCommands}
          />
        </div>
        {isUploading && (
          <p className="text-text-muted mt-1 text-xs" aria-live="polite">
            이미지 업로드 중...
          </p>
        )}
        {imageError && (
          <p className="text-error mt-1 text-xs" role="alert">
            {imageError}
          </p>
        )}
        {errors.content && (
          <p className="text-error mt-1 text-xs" role="alert">
            {errors.content}
          </p>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-3">
        <CancelButton onClick={onCancel} />
        <SubmitButton
          label={mode === 'write' ? '등록하기' : '수정하기'}
          loading={isPending}
        />
      </div>
    </form>
  )
}
