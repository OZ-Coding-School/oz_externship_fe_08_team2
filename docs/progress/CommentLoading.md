# 댓글 로딩 작업 진행 내용

> **담당자**: 최민제
> **브랜치**: `fix/comment-ui`
> **대상 파일**: `src/components/community/CommentLoadingDots/CommentLoadingDots.tsx`

---

## 작업 개요

댓글 목록 조회 시 **로딩 상태를 웨이브 점 애니메이션으로 표시**하는 기능 구현.
초기 진입 시 로딩과 무한스크롤 추가 로딩 두 가지 상황 모두 처리.

---

## 구현 파일 목록

| 파일                                                                 | 설명                              | 상태    |
| -------------------------------------------------------------------- | --------------------------------- | ------- |
| `src/components/community/CommentLoadingDots/CommentLoadingDots.tsx` | 웨이브 점 애니메이션 컴포넌트     | ✅ 완료 |
| `src/components/community/CommentLoadingDots/index.ts`               | barrel export                     | ✅ 완료 |
| `src/pages/community/CommunityCommentsPage.tsx`                      | 초기 로딩 및 무한스크롤 로딩 표시 | ✅ 완료 |

---

## 구현 내용

### CommentLoadingDots 컴포넌트

보라색(`#6201E0`) 점 3개가 0.2s 간격으로 순차적으로 위로 튀어오르는 웨이브 애니메이션.

```tsx
export function CommentLoadingDots() {
  return (
    <>
      <style>{`
        @keyframes comment-wave {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-12px); }
        }
        .comment-dot {
          animation: comment-wave 1.2s ease-in-out infinite;
        }
      `}</style>
      <div className="flex items-center justify-center gap-3 py-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="comment-dot inline-block h-3 w-3 rounded-full"
            style={{
              backgroundColor: '#6201E0',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </>
  )
}
```

### 1. 초기 로딩 (`isLoading`)

게시물 페이지 최초 진입 시 댓글 API 응답 전까지 `CommentLoadingDots` 표시.

```tsx
if (isLoading) {
  return (
    <section className="mt-8">
      <CommentLoadingDots />
    </section>
  )
}
```

### 2. 무한스크롤 추가 로딩 (`isFetchingNextPage`)

스크롤 시 다음 페이지 API 호출 중 댓글 목록 하단에 `CommentLoadingDots` 표시.

```tsx
<div ref={loadMoreRef} className="py-2">
  {isFetchingNextPage && <CommentLoadingDots />}
</div>
```

---

## 로딩 발생 시점

| 상황                           | 상태 변수                     | 표시 위치           |
| ------------------------------ | ----------------------------- | ------------------- |
| 페이지 최초 진입               | `isLoading === true`          | 전체 댓글 영역 대체 |
| 무한스크롤 다음 페이지 요청 중 | `isFetchingNextPage === true` | 댓글 목록 하단      |

---

## 구현 요구사항 체크리스트

- [x] 초기 진입 시 로딩 표시
- [x] 무한스크롤 스크롤 중 로딩 표시
- [x] 보라색 점 3개 웨이브 애니메이션
- [x] 로딩 완료 후 자연스럽게 댓글 목록으로 전환

---

## 커밋 이력

| 커밋                                                        | 내용                                         |
| ----------------------------------------------------------- | -------------------------------------------- |
| style: 댓글 로딩 표시를 웨이브 점 애니메이션으로 개선       | CommentLoadingDots 컴포넌트 추가, 두 곳 적용 |
| style: 댓글 로딩 점을 3개로 수정하고 웨이브 애니메이션 조정 | 점 10개 → 3개, 딜레이 0.2s 간격 조정         |
| style: 댓글 로딩 점 색상을 보라색으로 통일                  | opacity 제거, 항상 동일한 보라색 유지        |
| refactor: CommunityCommentsPage 컴포넌트 분리               | CommentLoadingDots를 별도 파일로 분리        |
