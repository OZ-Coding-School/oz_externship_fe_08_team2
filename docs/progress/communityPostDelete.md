# 게시글 삭제 기능 구현

> **담당자**: 정선영
> **브랜치**: `feat/post-delete`
> **관련 이슈**: `#44`
> **PR**: `#45` (`feat/post-delete` → `dev`)
> **작업 일자**: 2026-04-30

---

## 작업 개요

커뮤니티 게시글 상세 페이지(`CommunityDetailPage`)에서 **삭제 버튼 → 확인 모달 → API 호출** 흐름을 완성.
기존 `useDeletePost` feature 모듈(API 분리)과 `ConfirmModal` 컴포넌트를 활용하여
성공/실패 토스트, 중복 클릭 방지, 모달 disabled 처리를 추가.

---

## 변경 파일 목록

| 파일                                           | 변경 내용                                                             | 상태    |
| ---------------------------------------------- | --------------------------------------------------------------------- | ------- |
| `src/components/common/Modal/ConfirmModal.tsx` | `isConfirmDisabled` prop 추가, 확인 버튼 `disabled` 처리              | ✅ 완료 |
| `src/pages/community/CommunityDetailPage.tsx`  | `isPending` 추출, 성공/실패 toast, 중복 클릭 방지, toast variant 확장 | ✅ 완료 |

---

## 컴포넌트별 주요 변경 사항

### ConfirmModal

- `isConfirmDisabled?: boolean` prop 추가
- 확인 버튼에 `disabled={isConfirmDisabled}` 적용
- disabled 상태 스타일: `disabled:cursor-not-allowed disabled:opacity-50`
- 기존 UI 구조·스타일 변경 없음

### CommunityDetailPage

#### isPending 추출

```tsx
const { mutate: deletePost, isPending: isDeletePending } = useDeletePost()
```

#### toast variant 확장

```tsx
// 기존: 'error' | 'warning'
// 변경: 'success' | 'error' | 'warning'
const [toast, setToast] = useState<{
  message: string
  variant: 'success' | 'error' | 'warning'
  visible: boolean
}>({ message: '', variant: 'warning', visible: false })
```

#### handleDeleteConfirm 업데이트

```tsx
const handleDeleteConfirm = () => {
  if (isDeletePending) return // 중복 요청 방지
  deletePost(postId, {
    onSuccess: () => {
      showToast('게시글이 삭제되었습니다.', 'success')
      setTimeout(() => navigate('/community'), 1500) // 토스트 확인 후 이동
    },
    onError: () => {
      showToast('게시글 삭제에 실패했습니다.', 'error')
    },
  })
}
```

#### 삭제 버튼 중복 클릭 방지

```tsx
onDelete={() => {
  if (!isDeletePending) setIsDeleteModalOpen(true)
}}
```

#### ConfirmModal에 disabled 전달

```tsx
<ConfirmModal
  isConfirmDisabled={isDeletePending}
  onConfirm={handleDeleteConfirm}
  ...
/>
```

---

## 구현 요구사항 체크리스트

- [x] 삭제 버튼 클릭 → 확인 모달 오픈
- [x] 모달에서 확인 시 `DELETE /api/v1/posts/{post_id}` 호출
- [x] 요청 중 확인 버튼 `disabled` 처리 (중복 클릭 방지)
- [x] 요청 중 삭제 버튼 재클릭 시 모달 오픈 차단
- [x] 성공 → 성공 토스트 표시 후 1.5초 뒤 목록 페이지(`/community`) 이동
- [x] 실패 → 에러 토스트 표시, 현재 페이지 유지
- [x] 작성자일 때만 삭제 버튼 노출 (기존 `isAuthor` 로직 활용)
- [x] Authorization 헤더는 `api/instance.ts` axios 인스턴스 자동 주입
- [x] API 로직은 기존 `src/features/posts/delete/` 모듈 재사용
- [x] UI 구조/스타일 변경 없음
- [x] TypeScript 타입 에러 없음 (`tsc --noEmit`)
- [x] 빌드 성공 (`pnpm build`)

---

## 연결 구조

```
CommunityDetailPage
├── PostAuthorActions   — 삭제 버튼 클릭 (isDeletePending 중이면 모달 오픈 차단)
├── ConfirmModal        — 삭제 확인 모달 (isConfirmDisabled로 확인 버튼 disabled)
│   └── handleDeleteConfirm → useDeletePost mutate
│       ├── onSuccess   — 성공 toast → 1.5s 후 /community 이동
│       └── onError     — 에러 toast, 현재 페이지 유지
└── Toast               — success / error 메시지 표시
```

---

## 커밋 이력

| 커밋 메시지                         | 내용                                                           |
| ----------------------------------- | -------------------------------------------------------------- |
| `feat: 게시글 삭제 기능 구현 (#44)` | ConfirmModal disabled prop, CommunityDetailPage 삭제 흐름 완성 |
