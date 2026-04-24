# 댓글 작성칸 (CommentInput) 작업 진행 내용

> **담당자**: 최민제
> **브랜치**: `feature/commentInput`
> **대상 파일**: `src/components/community/CommentInput/CommentInput.tsx`

---

## 작업 개요

댓글 목록 하단에서 로그인 사용자가 댓글을 입력할 수 있는 **텍스트 입력 영역** 구현.
등록 버튼(`feature/commentSubmit`)과 태그 기능(`feature/commentTag`)은 별도 브랜치에서 처리.

---

## 구현 범위 (이 브랜치)

| 컴포넌트       | 설명                           | 담당 브랜치             |
| -------------- | ------------------------------ | ----------------------- |
| `CommentInput` | textarea + 글자수 표시 (0/500) | ✅ 이 브랜치            |
| `WritingBtn`   | 등록 버튼 + POST API           | `feature/commentSubmit` |
| `UserTagList`  | @ 태그 자동완성                | `feature/commentTag`    |

---

## 사용자 시나리오

1. 사용자가 게시글 상세 페이지에서 댓글 목록으로 스크롤
2. 로그인 사용자에게만 댓글 입력창이 표시됨
3. 텍스트 입력 시 글자수가 실시간으로 표시됨 (0/500)
4. 500자 초과 입력 불가

---

## API 명세

- **Method**: `POST`
- **Endpoint**: `/api/v1/posts/{post_id}/comments`
- **Body**: `{ content: string }`
- **인증**: 필요 (로그인 사용자만)
- ※ 실제 API 호출은 `feature/commentSubmit` 브랜치에서 구현

---

## 요구사항 체크리스트

- [x] 로그인 사용자에게만 입력창 표시 (비로그인 시 숨김)
- [x] textarea 입력 영역 구현
- [x] 실시간 글자수 표시 (0/500)
- [x] 최대 500자 제한
- [x] CommentSection에 CommentInput 연결

---

## 예외 처리 (프론트 유효성)

| 상황          | 처리                                    |
| ------------- | --------------------------------------- |
| 빈 칸 제출    | `feature/commentSubmit`에서 토스트 처리 |
| 500자 초과    | textarea maxLength로 입력 차단          |
| 비로그인 접근 | 입력창 자체를 렌더링하지 않음           |

---

## 구현 파일 목록

| 파일                                                         | 설명                    | 상태    |
| ------------------------------------------------------------ | ----------------------- | ------- |
| `src/components/community/CommentInput/CommentInput.tsx`     | 댓글 입력 컴포넌트 본체 | ✅ 완료 |
| `src/components/community/CommentInput/index.ts`             | barrel export           | ✅ 완료 |
| `src/components/community/CommentSection/CommentSection.tsx` | CommentInput 연결       | ✅ 완료 |

---

## 주요 구현 내용

### CommentInput 컴포넌트

```tsx
// Props
interface CommentInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void // feature/commentSubmit에서 연결
}
```

- `textarea` + `maxLength={500}` 으로 입력 차단
- 실시간 글자수: `{value.length}/500` 우측 하단 표시
- 450자 이상 → 글자수 색상 `text-error`로 경고
- `Enter` 키 → `onSubmit?.()` 호출
- `Shift+Enter` → 줄바꿈

### CommentSection 연결

- `useAuthStore`로 로그인 여부 확인
- 로그인 시: `CommentInput` 렌더링
- 비로그인 시: 입력창 숨김
- `inputValue` 상태를 `CommentSection`에서 관리 (추후 `commentSubmit`이 공유)

---

## 다음 브랜치 연결 방법

`feature/commentSubmit` 브랜치에서 아래만 추가하면 됩니다:

```tsx
// CommentSection.tsx에서
<CommentInput
  value={inputValue}
  onChange={setInputValue}
  onSubmit={handleSubmit} // ← 이것만 추가
/>
```

---

## 커밋 이력

| 커밋                                       | 내용                                        |
| ------------------------------------------ | ------------------------------------------- |
| `docs: CommentInput.md 작성`               | 댓글 입력칸 요구사항 정리                   |
| `feat: CommentInput 컴포넌트 구현`         | textarea + 글자수 + 500자 제한 + 450자 경고 |
| `feat: CommentSection에 CommentInput 연결` | 로그인 사용자만 표시, inputValue 상태 관리  |
| `docs: CommentInput.md 구현 내용 업데이트` | 실제 구현 상세 내용 추가                    |
