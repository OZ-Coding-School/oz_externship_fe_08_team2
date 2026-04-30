import { useState, useRef, useEffect, useId } from 'react'
import { ChevronIcon, CheckIcon } from '../Dropdown/icons'

export interface DropdownListOption {
  value: string
  label: string
}

export interface DropdownListProps {
  options: DropdownListOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DropdownList({
  options,
  value,
  onChange,
  placeholder = '선택해 주세요.',
  disabled = false,
  className = '',
}: DropdownListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const baseId = useId()

  const selectedOption = options.find((o) => o.value === value)

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || highlightIndex < 0) return
    const item = listboxRef.current?.children[highlightIndex] as
      | HTMLElement
      | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, highlightIndex])

  const toggle = () => {
    if (disabled) return
    setIsOpen((prev) => !prev)
    setHighlightIndex(-1)
  }

  const select = (opt: DropdownListOption) => {
    onChange?.(opt.value)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen && highlightIndex >= 0) {
          select(options[highlightIndex])
        } else {
          toggle()
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setHighlightIndex(0)
        } else {
          setHighlightIndex((prev) => Math.min(prev + 1, options.length - 1))
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div
      ref={containerRef}
      className={['relative w-full', className].filter(Boolean).join(' ')}
    >
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${baseId}-listbox`}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={[
          'flex h-12 w-full items-center justify-between rounded-sm px-4 py-2.5 text-sm transition-colors duration-150 outline-none',
          disabled
            ? 'cursor-not-allowed bg-gray-200 text-gray-400'
            : isOpen
              ? 'bg-white text-gray-900'
              : value
                ? 'bg-white text-gray-900'
                : 'bg-white text-gray-400',
          !disabled &&
            'focus-visible:ring-primary hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-1',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="truncate tracking-tight">
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronIcon open={isOpen} />
      </button>

      {isOpen && (
        <ul
          ref={listboxRef}
          id={`${baseId}-listbox`}
          role="listbox"
          aria-label={placeholder}
          className="absolute right-0 left-0 z-40 mt-2 max-h-60 overflow-y-auto rounded-sm border border-gray-500 bg-white py-1 shadow-lg"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value
            const isHighlighted = i === highlightIndex

            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => select(opt)}
                onMouseEnter={() => setHighlightIndex(i)}
                className={[
                  'mx-1 flex h-12 cursor-pointer items-center justify-between rounded-sm px-3 py-2.5 text-sm tracking-tight transition-colors duration-100',
                  isSelected
                    ? 'text-primary font-semibold'
                    : 'font-normal text-gray-900',
                  isHighlighted && !isSelected ? 'bg-primary-100' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <CheckIcon />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
