import DOMPurify from 'dompurify'

export interface PostBodyProps {
  /**
   * HTML 문자열 (리치텍스트 에디터 출력)
   * 이미지, 제목, 목록, 인용구 등 포함 가능
   */
  content: string
}

const ALLOWED_TAGS = [
  'p',
  'br',
  'b',
  'i',
  'em',
  'strong',
  'a',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'blockquote',
  'pre',
  'code',
  'img',
  'hr',
  'span',
  'div',
]

const ALLOWED_ATTR = ['href', 'src', 'alt', 'class', 'target', 'rel']

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  })
}

export function PostBody({ content }: PostBodyProps) {
  return (
    <div
      className={[
        'text-text-body min-h-40 py-8 text-base leading-relaxed',
        /* 단락 */
        '[&_p]:mb-4',
        /* 제목 */
        '[&_h1]:text-text-heading [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold',
        '[&_h2]:text-text-heading [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold',
        '[&_h3]:text-text-heading [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold',
        /* 목록 */
        '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6',
        '[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6',
        '[&_li]:mb-1',
        /* 인용구 */
        '[&_blockquote]:border-primary [&_blockquote]:text-text-muted [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:pl-4',
        /* 이미지 */
        '[&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg',
        /* 링크 */
        '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
        /* 코드 */
        '[&_pre]:bg-bg-muted [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:p-4',
        '[&_code]:bg-bg-muted [&_code]:rounded [&_code]:px-1 [&_code]:text-sm',
        /* 구분선 */
        '[&_hr]:border-border-base [&_hr]:my-6',
      ].join(' ')}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
    />
  )
}
