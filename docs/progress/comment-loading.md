# 댓글 로딩 표시 작업 진행 내용

> **담당자**: 최민제
> **브랜치**: `feature/commentLoading`
> **관련 파일**: `src/pages/community/CommunityCommentsPage.tsx`

---

## 작업 개요

댓글 목록 조회 시 **로딩 상태를 `...`으로 표시**하는 기능 구현.
초기 진입 시 로딩과 무한스크롤 추가 로딩 두 가지 상황을 모두 처리.

---

## 구현 내용

### 1. 초기 로딩 (`isLoading`)

게시물 페이지 최초 진입 시 댓글 API 응답 전까지 `...` 표시.

```tsx
if (isLoading) {
  return (
    <section className="mt-8">
      <div className="text-text-muted py-8 text-center">...</div>
    </section>
  )
}
```

### 2. 무한스크롤 추가 로딩 (`isFetchingNextPage`)

스크롤 시 다음 페이지 API 호출 중 댓글 목록 하단에 `...` 표시.

```tsx
<div ref={loadMoreRef} className="py-2">
  {isFetchingNextPage && (
    <div className="text-text-muted py-4 text-center">...</div>
  )}
</div>
```

---

## 로딩 발생 시점

| 상황                           | 상태 변수                     | 표시 위치           |
| ------------------------------ | ----------------------------- | ------------------- |
| 페이지 최초 진입               | `isLoading === true`          | 전체 댓글 영역 대체 |
| 무한스크롤 다음 페이지 요청 중 | `isFetchingNextPage === true` | 댓글 목록 하단      |

---

## 요구사항 체크리스트

- [x] 초기 진입 시 `...` 로딩 표시
- [x] 무한스크롤 스크롤 중 `...` 로딩 표시
- [x] 로딩 완료 후 자연스럽게 댓글 목록으로 전환

---

## 커밋 이력

| 커밋                      | 내용                                  |
| ------------------------- | ------------------------------------- |
| feat: 댓글 로딩 표시 구현 | 초기 로딩 및 무한스크롤 로딩 ... 표시 |
