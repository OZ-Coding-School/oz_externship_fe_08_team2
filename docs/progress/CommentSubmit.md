# 댓글 등록 작업 진행 내용

> **담당자**: 최민제
> **브랜치**: `fix/comment-ui`
> **대상 파일**: `src/components/community/CommentInput/CommentInput.tsx`, `src/pages/community/CommunityCommentsPage.tsx`

---

## 작업 개요

로그인 사용자가 댓글 입력창에 내용을 작성하고 **등록 버튼을 눌러 서버에 저장**하는 기능 구현.
등록 성공 시 입력창이 초기화되고 댓글 목록이 자동으로 갱신됨.

---

## 구현 파일 목록

| 파일                                                     | 설명                                  | 상태    |
| -------------------------------------------------------- | ------------------------------------- | ------- |
| `src/features/posts/comments/types.ts`                   | `CommentSubmitRequest` 타입 정의      | ✅ 완료 |
| `src/features/posts/comments/queries.ts`                 | `useSubmitComment` mutation 훅        | ✅ 완료 |
| `src/features/posts/comments/handler.ts`                 | POST 댓글 MSW 모킹 핸들러             | ✅ 완료 |
| `src/components/community/CommentInput/CommentInput.tsx` | 등록 버튼 UI + isSubmitting 상태 처리 | ✅ 완료 |
| `src/pages/community/CommunityCommentsPage.tsx`          | handleSubmit 연결 + 에러 상태 관리    | ✅ 완료 |

---

## API 명세

- **Method**: `POST`
- **Endpoint**: `/api/v1/posts/{post_id}/comments`
- **인증**: 필요 (`Bearer Token` — axios 인스턴스에서 자동 주입)
- **Request Body**: `{ "content": "string" }`

### 응답

```json
// 성공 (201)
{
  "id": 1,
  "author": { "id": 1, "nickname": "testuser", "profile_img_url": null },
  "tagged_users": [],
  "content": "댓글 내용",
  "created_at": "2025-10-30T14:01:57.505250+09:00",
  "updated_at": "2025-10-30T14:01:57.505250+09:00"
}

// 실패 (404)
{ "error_detail": "해당 게시글을 찾을 수 없습니다." }
```

---

## 구현 내용

### 1. `CommentSubmitRequest` 타입 (`types.ts`)

```ts
export interface CommentSubmitRequest {
  content: string
}
```

### 2. `useSubmitComment` mutation (`queries.ts`)

```ts
export function useSubmitComment(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CommentSubmitRequest) => {
      const response = await api.post<Comment>(
        `/api/v1/posts/${postId}/comments`,
        body
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId, 'comments'] })
    },
  })
}
```

- 성공 시 `invalidateQueries`로 댓글 목록 캐시 무효화 → 자동 갱신

### 3. MSW POST 모킹 (`handler.ts`)

```ts
http.post('/api/v1/posts/:postId/comments', async ({ params, request }) => {
  const { postId } = params
  if (postId === '999') {
    return HttpResponse.json(
      { error_detail: '해당 게시글을 찾을 수 없습니다.' },
      { status: 404 }
    )
  }
  const body = (await request.json()) as { content: string }
  const newComment = {
    id: Date.now(),
    author: { id: 99, nickname: '테스트유저', profile_img_url: null },
    tagged_users: [],
    content: body.content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  return HttpResponse.json(newComment, { status: 201 })
})
```

- `postId === '999'`이면 404 반환 (삭제된 게시글 시나리오 테스트용)

### 4. 등록 버튼 UI (`CommentInput.tsx`)

- **포커스 or 내용 있을 때**: 보라색 테두리(`#6201E0`), 보라색 배경(`#EFE6FC`) 버튼
- **평시**: 회색 테두리(`#CECECE`), 회색 배경(`#ECECEC`) 버튼
- **제출 중**: 버튼 텍스트 `등록 중...` + `disabled` 처리

### 5. 제출 흐름 (`CommunityCommentsPage.tsx`)

```ts
const handleSubmit = useCallback(() => {
  if (!inputValue.trim()) return // 빈 내용 차단
  submitComment(
    { content: inputValue.trim() },
    {
      onSuccess: () => setInputValue(''), // 입력창 초기화
      onError: () => setSubmitError(true), // 에러 토스트 표시
    }
  )
}, [inputValue, submitComment])
```

---

## 구현 요구사항 체크리스트

### 완료 ✅

- [x] 등록 버튼 클릭 시 POST API 호출
- [x] 로그인 사용자에게만 입력창 + 버튼 표시
- [x] 500자 maxLength 제한 (초과 입력 차단)
- [x] 빈 내용 제출 시 조용히 차단 (`inputValue.trim()` 검사 후 return)
- [x] 제출 중 버튼 `disabled` + `등록 중...` 텍스트 (중복 요청 방지)
- [x] 성공 시 입력창 초기화
- [x] 성공 시 댓글 목록 자동 갱신 (`invalidateQueries`)
- [x] 서버 오류 시 에러 토스트 ("댓글 등록에 실패했습니다.")
- [x] 게시글 404 시 토스트 후 목록 이동 (CommunityCommentsPage에서 처리)
- [x] MSW POST 핸들러 구현 (개발 환경 테스트)
- [x] 401 인증 만료 시 자동 로그인 페이지 이동 (axios 인스턴스 전역 처리)

### 미완료 ⬜

- [ ] 빈 내용 제출 시 토스트 메시지 (현재는 조용히 return만 처리)
- [ ] 유저 태그 (`@닉네임`) 자동완성 드롭다운

---

## 예외 상황

| 상황                | 프론트 처리                                             | 완료 여부 |
| ------------------- | ------------------------------------------------------- | --------- |
| 빈 내용 제출        | `inputValue.trim()` 검사 후 return (토스트 없음)        | ⬜ 미완료 |
| 500자 초과 입력     | `maxLength={500}`으로 입력 자체 차단                    | ✅ 완료   |
| 제출 중 연속 클릭   | `isSubmitting` 동안 버튼 `disabled`                     | ✅ 완료   |
| 서버 오류 (5xx)     | "댓글 등록에 실패했습니다." 에러 토스트, 입력창 유지    | ✅ 완료   |
| 게시글 삭제됨 (404) | 토스트 후 게시글 목록 페이지로 자동 이동                | ✅ 완료   |
| 인증 만료 (401)     | axios 인스턴스에서 토큰 갱신 시도 → 실패 시 로그인 이동 | ✅ 완료   |
| 비로그인 접근       | 입력창 자체를 렌더링하지 않음                           | ✅ 완료   |

---

## 커밋 이력

| 커밋                                          | 내용                                              |
| --------------------------------------------- | ------------------------------------------------- |
| feat: 댓글 조회 feature 모듈 구현             | `CommentSubmitRequest` 타입 추가                  |
| fix: 댓글 UI 수정 및 등록 기능 구현           | `useSubmitComment` 훅 연결, 등록 버튼 UI 구현     |
| refactor: CommunityCommentsPage 컴포넌트 분리 | `CommentInput`으로 분리, `handleSubmit` prop 전달 |
