# 댓글 작성 작업 진행 내용

> **담당자**: 최민제
> **브랜치**: `fix/comment-ui`
> **대상 파일**: `src/components/community/CommentInput/CommentInput.tsx`

---

## 작업 개요

커뮤니티 게시글 상세 페이지에서 **댓글을 작성하고 서버에 등록**하는 기능 구현.
로그인 사용자에게만 입력창이 표시되며, 등록 성공 시 입력창이 초기화됨.

---

## 구현 파일 목록

| 파일                                                     | 설명                          | 상태    |
| -------------------------------------------------------- | ----------------------------- | ------- |
| `src/components/community/CommentInput/CommentInput.tsx` | textarea + 등록 버튼 컴포넌트 | ✅ 완료 |
| `src/components/community/CommentInput/index.ts`         | barrel export                 | ✅ 완료 |
| `src/features/posts/comments/queries.ts`                 | useSubmitComment mutation 훅  | ✅ 완료 |
| `src/features/posts/comments/handler.ts`                 | POST 댓글 MSW 모킹 핸들러     | ✅ 완료 |
| `src/pages/community/CommunityCommentsPage.tsx`          | CommentInput 사용 + 상태 관리 | ✅ 완료 |

---

## API 명세

- **Method**: `POST`
- **Endpoint**: `/api/v1/posts/{post_id}/comments`
- **인증**: 필요 (`Bearer Token`)
- **Request Body**: `{ "content": "string" }`

### 응답

```json
// 성공 (201)
{ "detail": "댓글이 등록되었습니다." }

// 실패 (400)
{ "error_detail": { "content": ["이 필드는 필수 항목입니다."] } }

// 실패 (404)
{ "error_detail": "해당 게시글을 찾을 수 없습니다." }
```

---

## 구현 내용

### CommentInput 컴포넌트 props

```tsx
interface CommentInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  submitError: boolean
  onSubmitErrorClose: () => void
}
```

### 주요 동작

- **포커스 상태**: 테두리 색상 `#CECECE` → `#6201E0` 전환, 등록 버튼 보라색 활성화
- **등록 버튼**: 포커스 or 내용 있을 때 보라색(`#EFE6FC` 배경, `#6201E0` 텍스트), 평시 회색
- **제출 중**: 버튼 텍스트 `등록 중...` + `disabled` 처리로 중복 클릭 방지
- **성공 시**: `onSuccess` 콜백에서 `setInputValue('')`로 입력창 초기화
- **실패 시**: `submitError` 토스트 표시 ("댓글 등록에 실패했습니다.")
- **최대 글자수**: `maxLength={500}` 입력 차단

---

## 구현 요구사항 체크리스트

### 완료 ✅

- [x] 로그인 사용자에게만 입력창 표시 (비로그인 시 숨김)
- [x] textarea 입력 영역 구현
- [x] 500자 maxLength 제한
- [x] 포커스 시 보라색 테두리 + 등록 버튼 활성화 스타일
- [x] 등록 버튼 구현
- [x] 제출 중 버튼 비활성화 (중복 요청 방지)
- [x] 등록 성공 시 입력창 초기화
- [x] 서버 오류 시 에러 토스트 메시지
- [x] 게시글 404 토스트 후 목록 이동 (CommunityCommentsPage에서 처리)

### 미완료 ⬜

- [ ] 빈 내용 제출 시 토스트 메시지 (현재는 조용히 return만 처리)
- [ ] 실시간 글자수 표시 (0/500)
- [ ] 유저 태그 (`@닉네임`) 자동완성 드롭다운

---

## 예외 상황

| 상황                | 프론트 처리                             | 완료 여부 |
| ------------------- | --------------------------------------- | --------- |
| 500자 초과 입력     | `maxLength`로 입력 차단                 | ✅ 완료   |
| 비로그인 접근       | 입력창 자체를 렌더링하지 않음           | ✅ 완료   |
| 제출 중 연속 클릭   | `isSubmitting` 동안 버튼 `disabled`     | ✅ 완료   |
| 서버 오류 (5xx)     | "댓글 등록에 실패했습니다." 에러 토스트 | ✅ 완료   |
| 게시글 삭제됨 (404) | 토스트 후 게시물 목록 페이지로 이동     | ✅ 완료   |
| 빈 내용 제출        | 조용히 return (토스트 미구현)           | ⬜ 미완료 |

---

## 커밋 이력

| 커밋                                          | 내용                                        |
| --------------------------------------------- | ------------------------------------------- |
| feat: CommentInput 컴포넌트 구현              | textarea + 글자수 + 500자 제한 (구버전)     |
| feat: CommentSection에 CommentInput 연결      | 로그인 사용자만 표시                        |
| fix: 댓글 UI 수정 및 등록 기능 구현           | 실제 피그마 UI로 교체, submit 연결          |
| refactor: CommunityCommentsPage 컴포넌트 분리 | CommentInput을 별도 파일로 분리, props 정리 |
