import { useState, useRef, useCallback } from 'react'
import { Toast } from '@/components'
import { useUserSearch } from '@/features/accounts/user-search'
import { UserTagList } from '@/components/community/UserTagList'

interface CommentInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  submitError: boolean
  submitErrorMessage?: string
  onSubmitErrorClose: () => void
}

function getMentionQuery(text: string, cursorPos: number): string | null {
  const textBeforeCursor = text.slice(0, cursorPos)
  const match = textBeforeCursor.match(/@(\S*)$/)
  return match ? match[1] : null
}

export function CommentInput({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  submitError,
  submitErrorMessage = '댓글 등록에 실패했습니다. 잠시 후 다시 시도해주세요.',
  onSubmitErrorClose,
}: CommentInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { data: searchData } = useUserSearch(mentionQuery ?? '')

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      onChange(newValue)
      const cursor = e.target.selectionStart ?? newValue.length
      setMentionQuery(getMentionQuery(newValue, cursor))
    },
    [onChange]
  )

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape') {
        setMentionQuery(null)
        return
      }
      const cursor = textareaRef.current?.selectionStart ?? value.length
      setMentionQuery(getMentionQuery(value, cursor))
    },
    [value]
  )

  const handleSelectUser = useCallback(
    (nickname: string) => {
      const cursor = textareaRef.current?.selectionStart ?? value.length
      const before = value.slice(0, cursor)
      const after = value.slice(cursor)
      // @query 부분을 @nickname 으로 교체
      const replaced = before.replace(/@(\S*)$/, `@${nickname} `)
      const newValue = replaced + after
      onChange(newValue)
      setMentionQuery(null)

      // 커서를 삽입된 닉네임 뒤로 이동
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.selectionStart = replaced.length
          textareaRef.current.selectionEnd = replaced.length
        }
      })
    },
    [value, onChange]
  )

  const users = searchData?.results ?? []
  const showDropdown = mentionQuery !== null && users.length > 0

  return (
    <div className="mb-4">
      <Toast
        message={submitErrorMessage}
        variant="error"
        visible={submitError}
        onClose={onSubmitErrorClose}
      />
      <div
        className="relative rounded-lg border transition-colors duration-150"
        style={{ borderColor: isFocused ? '#6201E0' : '#CECECE' }}
      >
        {showDropdown && (
          <UserTagList users={users} onSelect={handleSelectUser} />
        )}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            setMentionQuery(null)
          }}
          placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포 시 모니터링 후 삭제될 수 있습니다."
          rows={2}
          maxLength={500}
          disabled={isSubmitting}
          className="bg-bg-base text-text-heading w-full resize-none rounded-lg px-4 py-3 pb-10 text-sm outline-none disabled:opacity-50"
          style={{ '--placeholder-color': '#CECECE' } as React.CSSProperties}
        />
        <style>{`textarea::placeholder { color: #CECECE; }`}</style>
        <div className="absolute right-3 bottom-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="rounded-full border text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50"
            style={
              isFocused || value.trim()
                ? {
                    width: '80px',
                    height: '40px',
                    borderColor: '#6201E0',
                    backgroundColor: '#EFE6FC',
                    color: '#6201E0',
                  }
                : {
                    width: '80px',
                    height: '40px',
                    borderColor: '#CECECE',
                    backgroundColor: '#ECECEC',
                    color: '#4D4D4D',
                  }
            }
          >
            {isSubmitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  )
}
