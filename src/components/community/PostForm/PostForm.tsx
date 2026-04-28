import { useMemo, useState } from 'react'
import MDEditor, {
  commands as mdCommands,
  type ICommand,
} from '@uiw/react-md-editor'
import {
  Undo2,
  Redo2,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ChevronDown,
} from 'lucide-react'
import type { Category } from '@/features/posts/categories'
import { Dropdown } from '@/components/common/Dropdown'
import { usePresignedUrl } from '@/features/posts/write'
import { SubmitButton } from '../SubmitButton'
import { CancelButton } from '../CancelButton'
import './PostForm.css'

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

const FONT_FAMILIES = [
  { label: '기본서체', value: 'inherit' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: '돋움', value: 'Dotum, sans-serif' },
  { label: '맑은 고딕', value: "'Malgun Gothic', sans-serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: "'Courier New', monospace" },
]

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32]

const PALETTE_COLORS = [
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#b7b7b7',
  '#ff0000',
  '#ff7700',
  '#ffff00',
  '#00ff00',
  '#0000ff',
  '#9900ff',
  '#ff00ff',
  '#00ffff',
  '#ff6d6d',
  '#ffd966',
  '#93c47d',
  '#76a5af',
  '#4a86e8',
  '#8e7cc3',
  '#c27ba0',
]

/* ── 컴포넌트 외부 정적 커맨드 ── */

const undoCommand: ICommand = {
  name: 'undo',
  keyCommand: 'undo',
  buttonProps: { 'aria-label': '실행 취소', title: '실행 취소' },
  icon: <Undo2 size={14} />,
  execute: () => {
    const el = document.querySelector<HTMLTextAreaElement>(
      '.w-md-editor-text-input'
    )
    el?.focus()
    document.execCommand('undo')
  },
}

const redoCommand: ICommand = {
  name: 'redo',
  keyCommand: 'redo',
  buttonProps: { 'aria-label': '다시 실행', title: '다시 실행' },
  icon: <Redo2 size={14} />,
  execute: () => {
    const el = document.querySelector<HTMLTextAreaElement>(
      '.w-md-editor-text-input'
    )
    el?.focus()
    document.execCommand('redo')
  },
}

const fontFamilyCommand: ICommand = {
  name: 'font-family',
  keyCommand: 'font-family',
  groupName: 'font-family',
  buttonProps: {
    'aria-label': '글꼴',
    title: '글꼴',
    className: 'label-btn',
    style: { width: 'auto', minWidth: 72, fontSize: 11 },
  },
  icon: (
    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      기본서체 <ChevronDown size={10} />
    </span>
  ),
  children: ({ close, getState, textApi }) => (
    <div className="toolbar-popup">
      {FONT_FAMILIES.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          style={{ fontFamily: value === 'inherit' ? undefined : value }}
          onClick={() => {
            const s = getState?.()
            const inner = (s && 'selectedText' in s ? s.selectedText : '') || ''
            textApi?.replaceSelection(
              `<span style="font-family: ${value}">${inner}</span>`
            )
            close()
          }}
        >
          {label}
        </button>
      ))}
    </div>
  ),
  execute: () => {},
}

const fontSizeCommand: ICommand = {
  name: 'font-size',
  keyCommand: 'font-size',
  groupName: 'font-size',
  buttonProps: {
    'aria-label': '글자 크기',
    title: '글자 크기',
    style: { width: 'auto', minWidth: 44, fontSize: 11 },
  },
  icon: (
    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      16 <ChevronDown size={10} />
    </span>
  ),
  children: ({ close, getState, textApi }) => (
    <div className="toolbar-popup" style={{ minWidth: 60 }}>
      {FONT_SIZES.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => {
            const s = getState?.()
            const inner = (s && 'selectedText' in s ? s.selectedText : '') || ''
            textApi?.replaceSelection(
              `<span style="font-size: ${size}px">${inner}</span>`
            )
            close()
          }}
        >
          {size}
        </button>
      ))}
    </div>
  ),
  execute: () => {},
}

const underlineCommand: ICommand = {
  name: 'underline',
  keyCommand: 'underline',
  buttonProps: { 'aria-label': '밑줄', title: '밑줄' },
  icon: <Underline size={14} />,
  execute: (state, api) => {
    api.replaceSelection(`<u>${state.selectedText}</u>`)
  },
}

function makeColorCommand(
  name: string,
  label: string,
  icon: React.ReactElement,
  wrap: (color: string, text: string) => string
): ICommand {
  return {
    name,
    keyCommand: name,
    groupName: name,
    buttonProps: { 'aria-label': label, title: label },
    icon,
    children: ({ close, getState, textApi }) => (
      <div className="color-palette">
        {PALETTE_COLORS.map((color) => (
          <div
            key={color}
            className="color-swatch"
            style={{ background: color }}
            title={color}
            onClick={() => {
              const s = getState?.()
              const selected =
                (s && 'selectedText' in s ? s.selectedText : '') || ''
              textApi?.replaceSelection(wrap(color, selected))
              close()
            }}
          />
        ))}
      </div>
    ),
    execute: () => {},
  }
}

const bgColorCommand = makeColorCommand(
  'bg-color',
  '배경색',
  <span
    style={{
      display: 'inline-block',
      width: 14,
      height: 14,
      background: '#ffff00',
      border: '1px solid #ccc',
      borderRadius: 2,
    }}
  />,
  (color, text) => `<mark style="background-color: ${color}">${text}</mark>`
)

const textColorCommand = makeColorCommand(
  'text-color',
  '글자색',
  <span
    style={{
      fontWeight: 700,
      fontSize: 13,
      borderBottom: '2px solid #e53e3e',
      lineHeight: 1,
    }}
  >
    A
  </span>,
  (color, text) => `<span style="color: ${color}">${text}</span>`
)

const alignLeftCommand: ICommand = {
  name: 'align-left',
  keyCommand: 'align-left',
  buttonProps: { 'aria-label': '왼쪽 정렬', title: '왼쪽 정렬' },
  icon: <AlignLeft size={14} />,
  execute: (state, api) => {
    api.replaceSelection(
      `<div style="text-align: left">${state.selectedText}</div>`
    )
  },
}

const alignCenterCommand: ICommand = {
  name: 'align-center',
  keyCommand: 'align-center',
  buttonProps: { 'aria-label': '가운데 정렬', title: '가운데 정렬' },
  icon: <AlignCenter size={14} />,
  execute: (state, api) => {
    api.replaceSelection(
      `<div style="text-align: center">${state.selectedText}</div>`
    )
  },
}

const alignRightCommand: ICommand = {
  name: 'align-right',
  keyCommand: 'align-right',
  buttonProps: { 'aria-label': '오른쪽 정렬', title: '오른쪽 정렬' },
  icon: <AlignRight size={14} />,
  execute: (state, api) => {
    api.replaceSelection(
      `<div style="text-align: right">${state.selectedText}</div>`
    )
  },
}

const alignJustifyCommand: ICommand = {
  name: 'align-justify',
  keyCommand: 'align-justify',
  buttonProps: { 'aria-label': '양쪽 정렬', title: '양쪽 정렬' },
  icon: <AlignJustify size={14} />,
  execute: (state, api) => {
    api.replaceSelection(
      `<div style="text-align: justify">${state.selectedText}</div>`
    )
  },
}

const unorderedListCmd: ICommand = {
  name: 'unordered-list',
  keyCommand: 'unordered-list',
  buttonProps: { 'aria-label': '글머리 목록', title: '글머리 목록' },
  icon: <List size={14} />,
  execute: (state, api) => {
    const lines = state.selectedText
      ? state.selectedText
          .split('\n')
          .map((l) => `- ${l}`)
          .join('\n')
      : '- '
    api.replaceSelection(lines)
  },
}

const orderedListCmd: ICommand = {
  name: 'ordered-list',
  keyCommand: 'ordered-list',
  buttonProps: { 'aria-label': '번호 목록', title: '번호 목록' },
  icon: <ListOrdered size={14} />,
  execute: (state, api) => {
    const lines = state.selectedText
      ? state.selectedText
          .split('\n')
          .map((l, i) => `${i + 1}. ${l}`)
          .join('\n')
      : '1. '
    api.replaceSelection(lines)
  },
}

const indentCommand: ICommand = {
  name: 'indent',
  keyCommand: 'indent',
  buttonProps: { 'aria-label': '들여쓰기', title: '들여쓰기' },
  icon: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="9" y1="18" x2="21" y2="18" />
      <polyline points="3 9 6 12 3 15" />
    </svg>
  ),
  execute: (state, api) => {
    const lines = state.selectedText
      ? state.selectedText
          .split('\n')
          .map((l) => `  ${l}`)
          .join('\n')
      : '  '
    api.replaceSelection(lines)
  },
}

const outdentCommand: ICommand = {
  name: 'outdent',
  keyCommand: 'outdent',
  buttonProps: { 'aria-label': '내어쓰기', title: '내어쓰기' },
  icon: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="9" y1="18" x2="21" y2="18" />
      <polyline points="6 9 3 12 6 15" />
    </svg>
  ),
  execute: (state, api) => {
    const lines = state.selectedText
      ? state.selectedText
          .split('\n')
          .map((l) => (l.startsWith('  ') ? l.slice(2) : l))
          .join('\n')
      : ''
    api.replaceSelection(lines)
  },
}

/* ── 컴포넌트 ── */

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

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      title: values.title,
      content: values.content,
      category_id: Number(values.categoryId),
    })
  }

  /* 이미지 업로드 커맨드 (presigned URL) */
  const imageCommand: ICommand = useMemo(
    () => ({
      name: 'image',
      keyCommand: 'image',
      buttonProps: { 'aria-label': '이미지 업로드', title: '이미지 업로드' },
      icon: (
        <svg width="14" height="14" viewBox="0 0 20 20">
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

  /* 툴바 Row 1 */
  const editorCommands: ICommand[] = useMemo(
    () => [
      undoCommand,
      redoCommand,
      mdCommands.divider,
      fontFamilyCommand,
      fontSizeCommand,
      mdCommands.divider,
      mdCommands.bold,
      mdCommands.italic,
      underlineCommand,
      mdCommands.strikethrough,
      mdCommands.divider,
      bgColorCommand,
      textColorCommand,
      mdCommands.divider,
      mdCommands.link,
      imageCommand,
    ],
    [imageCommand]
  )

  /* 툴바 Row 2 */
  const editorExtraCommands: ICommand[] = useMemo(
    () => [
      alignLeftCommand,
      alignCenterCommand,
      alignRightCommand,
      alignJustifyCommand,
      mdCommands.divider,
      unorderedListCmd,
      orderedListCmd,
      mdCommands.divider,
      indentCommand,
      outdentCommand,
    ],
    []
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
        </div>
        <div data-color-mode="light" className="post-editor-wrap">
          <MDEditor
            value={values.content}
            onChange={(v) => handleChange('content', v ?? '')}
            preview="live"
            commands={editorCommands}
            extraCommands={editorExtraCommands}
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
