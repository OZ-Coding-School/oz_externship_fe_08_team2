# 댓글 목록 작업 진행 내용

> **담당자**: 최민제
> **브랜치**: `fix/comment-ui`
> **대상 파일**: `src/pages/community/CommunityCommentsPage.tsx`

---

## 작업 개요

커뮤니티 게시글 상세 페이지 내 **댓글 목록 조회** 기능 구현.
`CommunityDetailPage`에서 `postId`를 prop으로 받아 독립적으로 동작하도록 설계.

---

## 구현 파일 목록

| 파일                                                                 | 설명                    | 상태    |
| -------------------------------------------------------------------- | ----------------------- | ------- |
| `src/features/posts/comments/types.ts`                               | API 요청/응답 타입 정의 | ✅ 완료 |
| `src/features/posts/comments/queries.ts`                             | useInfiniteQuery 훅     | ✅ 완료 |
| `src/features/posts/comments/handler.ts`                             | MSW 모킹 핸들러         | ✅ 완료 |
| `src/features/posts/comments/index.ts`                               | barrel export           | ✅ 완료 |
| `src/mocks/handlers.ts`                                              | MSW 핸들러 등록         | ✅ 완료 |
| `src/pages/community/CommunityCommentsPage.tsx`                      | 메인 페이지 컴포넌트    | ✅ 완료 |
| `src/components/community/CommentItem/CommentItem.tsx`               | 댓글 단일 아이템        | ✅ 완료 |
| `src/components/community/CommentLoadingDots/CommentLoadingDots.tsx` | 웨이브 로딩 애니메이션  | ✅ 완료 |
| `src/components/community/CommentSortButton/CommentSortButton.tsx`   | 정렬 버튼 + 드롭다운    | ✅ 완료 |
| `src/components/community/CommentInput/CommentInput.tsx`             | 댓글 입력 컴포넌트      | ✅ 완료 |

---

## API 명세

- **Method**: `GET`
- **Endpoint**: `/api/v1/posts/{post_id}/comments`
- **Query Params**: `?page=1&page_size=10`
- **인증**: 불필요 (읽기)

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
      "tagged_users": [{ "id": 2, "nickname": "testuser2" }],
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
- [x] 스크롤 로딩 중 웨이브 점 애니메이션 표시
- [x] 댓글 작성자 닉네임 + 프로필 이미지 표시
- [x] `@닉네임` 태그 파싱 — tagged_users와 매칭하여 볼드 + 보라색 처리
- [x] 작성일시 표시 (한국어 날짜 형식)
- [x] 로그인 사용자만 댓글 입력창 표시
- [x] 댓글 없을 시 "등록된 댓글이 없습니다." 표시
- [x] 최신순 / 오래된 순 정렬 버튼 + 드롭다운 모달

### 예외 처리

- [x] 게시물 404 → 토스트 메시지 후 `/community` 목록으로 이동

---

## 컴포넌트 분리 구조

`CommunityCommentsPage.tsx`의 코드를 기능별로 컴포넌트로 분리함 (396줄 → 125줄).

| 컴포넌트             | 역할                                           |
| -------------------- | ---------------------------------------------- |
| `CommentItem`        | 날짜 포맷, @멘션 파싱, 댓글 단일 아이템 렌더링 |
| `CommentLoadingDots` | 초기/무한스크롤 로딩 웨이브 점 애니메이션      |
| `CommentSortButton`  | 최신순/오래된 순 드롭다운 + 외부 클릭 닫기     |
| `CommentInput`       | textarea + 등록 버튼 (포커스 상태 스타일링)    |

---

## 상세 페이지 연결 방법

`CommunityDetailPage.tsx`에서 `postId`를 prop으로 전달:

```tsx
import { CommunityCommentsPage } from '@/pages/community/CommunityCommentsPage'

;<CommunityCommentsPage postId={postId} />
```

---

## 커밋 이력

| 커밋                                          | 내용                                    |
| --------------------------------------------- | --------------------------------------- |
| feat: 댓글 조회 feature 모듈 구현             | comments types, queries, handler, index |
| feat: 댓글 목록 조회 기능 구현                | 무한스크롤, 멘션 파싱, 404 처리         |
| fix: 댓글 UI 수정 및 등록 기능 구현           | 정렬, 입력창 UI, 댓글 submit 연결       |
| refactor: CommunityCommentsPage 컴포넌트 분리 | 기능별 컴포넌트로 분리, 125줄로 축소    |
