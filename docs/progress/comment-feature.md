# 댓글 기능 작업 진행 내용

> **담당자**: 최민제
> **브랜치**: `feature/comment`
> **대상 파일**: `src/pages/community/CommunityCommentsPage.tsx`

---

## 작업 개요

커뮤니티 게시글 상세 페이지 내 **댓글 목록 조회** 기능 구현.
상세 페이지(`CommunityDetailPage`)는 별도 담당자가 구현하며, 이 컴포넌트는 독립적으로 작성되어 병합 시 충돌 없이 import 가능하도록 설계.

---

## 충돌 방지 원칙

- `CommunityDetailPage.tsx` **수정 금지** — 상세 페이지 담당자 영역
- `RouterProvider.tsx` **수정 금지** — 라우트 등록은 상세 페이지 담당자가 처리
- `CommunityCommentsPage`는 `useParams`로 `postId`를 직접 읽는 독립 컴포넌트
  - 상세 페이지 담당자가 `<CommunityCommentsPage />` 한 줄로 임베드 가능

---

## 구현 파일 목록

| 파일 | 설명 | 상태 |
|------|------|------|
| `src/features/posts/comments/types.ts` | API 요청/응답 타입 정의 | ✅ 완료 |
| `src/features/posts/comments/queries.ts` | useInfiniteQuery 훅 | ✅ 완료 |
| `src/features/posts/comments/handler.ts` | MSW 모킹 핸들러 | ✅ 완료 |
| `src/features/posts/comments/index.ts` | barrel export | ✅ 완료 |
| `src/mocks/handlers.ts` | MSW 핸들러 등록 | ✅ 완료 |
| `src/pages/community/CommunityCommentsPage.tsx` | 메인 페이지 컴포넌트 | ✅ 완료 |

---

## API 명세

- **Method**: `GET`
- **Endpoint**: `/api/v1/posts/{post_id}/comments`
- **Query Params**: `?page=1&page_size=10`
- **인증**: 불필요 (읽기), 필요 (댓글 작성)

### 응답 구조

```json
{
  "count": 100,
  "next": "http://api.ozcoding.site/api/v1/posts/1/comments?page=2&page_size=10",
  "previous": null,
  "results": [
    {
      "id": 1,
      "author": {
        "id": 1,
        "nickname": "testuser",
        "profile_img_url": "https://example.com/image.png"
      },
      "tagged_users": [
        { "id": 2, "nickname": "testuser2" }
      ],
      "content": "@testuser2 댓글 내용",
      "created_at": "2025-10-30T14:01:57.505250+09:00",
      "updated_at": "2025-10-30T14:01:57.505250+09:00"
    }
  ]
}
```

---

## 구현 요구사항 체크리스트

### 필수 기능
- [x] 댓글 목록 무한스크롤 (10개씩, IntersectionObserver)
- [x] 스크롤 로딩 중 `...` 표시
- [x] 댓글 작성자 닉네임 + 프로필 이미지 표시
- [x] `@닉네임` 태그 파싱 — tagged_users와 매칭하여 볼드 + 색상 처리
- [x] 작성일시 표시
- [x] 로그인 사용자만 댓글 입력창 표시
- [x] 댓글 없을 시 "등록된 댓글이 없습니다." 표시

### 예외 처리
- [x] 게시물 404 → 토스트 메시지 후 `/community` 목록으로 이동
- [x] 잘못된 postId (숫자 아님) → 404 페이지

---

## 상세 페이지 담당자에게

`CommunityDetailPage.tsx` 하단에 아래 코드를 추가하면 댓글 섹션이 붙습니다:

```tsx
import { CommunityCommentsPage } from '@/pages/community/CommunityCommentsPage'

// CommunityDetailPage 렌더 내부
<CommunityCommentsPage />
```

`postId`는 컴포넌트 내부에서 `useParams`로 자동으로 읽어옵니다.

---

## 커밋 이력

| 커밋 | 내용 |
|------|------|
| 작업 진행 파일 생성 | docs/progress/comment-feature.md 추가 |
| feature 모듈 구현 | comments types, queries, handler, index |
| CommunityCommentsPage 구현 | 무한스크롤, 멘션 파싱, 404 처리 |
