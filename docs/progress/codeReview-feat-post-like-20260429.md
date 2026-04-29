# 게시글 좋아요 기능 코드 리뷰

> **담당자**: 정선영
> **브랜치**: `feat/post-like`
> **리뷰 대상 커밋**: `3933709` feat: 게시글 좋아요/좋아요 취소 기능 구현 (#37)
> **리뷰 일자**: 2026-04-29

---

## 리뷰 대상 파일

| 파일                                                   | 변경 내용                                             |
| ------------------------------------------------------ | ----------------------------------------------------- |
| `src/pages/community/CommunityDetailPage.tsx`          | 좋아요 토글 mutation 연동, Toast 알림, 중복 클릭 방지 |
| `src/components/community/PostActions/PostActions.tsx` | `isLikePending` prop 추가, disabled 조건 확장         |

---

## Phase 1: 컨벤션 검증

**상태: PASS**

| 항목                                                      | 결과 | 비고                                                                   |
| --------------------------------------------------------- | ---- | ---------------------------------------------------------------------- |
| Named export 사용                                         | PASS | `export function CommunityDetailPage`, `export function PostActions`   |
| import 순서 (외부 -> @/ 내부)                             | PASS | React/react-router -> @/components -> @/features -> @/stores 순서 준수 |
| 컴포넌트 파일 구조 (컴포넌트명/컴포넌트명.tsx + index.ts) | PASS | `PostActions/PostActions.tsx` + `index.ts` barrel export 확인          |
| Props 인터페이스 네이밍 (컴포넌트명 + Props)              | PASS | `PostActionsProps`                                                     |
| Tailwind 토큰 클래스 사용                                 | PASS | `text-primary`, `bg-primary-50`, `border-gray-300` 등 디자인 토큰 사용 |
| any 타입 금지                                             | PASS | any 타입 사용 없음                                                     |

---

## Phase 2: 심층 코드 리뷰

### Critical (반드시 수정)

없음.

### Warning (수정 권장)

#### W-1. 서버 상태와 로컬 상태의 이중 관리

- **파일**: `src/pages/community/CommunityDetailPage.tsx:70-71`
- **내용**: `isLiked`와 `likeCount`를 `useState`로 로컬 관리하면서 동시에 `useTogglePostLike`의 `onSuccess`에서 `queryClient.invalidateQueries`로 서버 캐시도 갱신하고 있다. Suspense + useSuspenseQuery 환경에서 invalidate가 일어나면 리렌더링 시 서버 데이터와 로컬 상태가 일시적으로 불일치할 수 있다.
- **수정 제안**: 낙관적 업데이트(optimistic update) 패턴을 `useMutation`의 `onMutate`/`onError`/`onSettled`에서 처리하거나, 로컬 상태를 완전히 제거하고 서버 캐시만 신뢰하는 방향으로 일원화 검토.

#### W-2. Toast 상태 3개를 개별 useState로 관리

- **파일**: `src/pages/community/CommunityDetailPage.tsx:73-77`
- **내용**: `toastMessage`, `toastVariant`, `toastVisible` 3개의 state가 항상 함께 변경된다. 상태가 분산되어 있으면 일관성 관리가 어려워지고, 불필요한 리렌더링이 발생할 수 있다.
- **수정 제안**: 하나의 객체 state로 통합하거나, `useReducer`를 사용하는 것을 권장.
  ```typescript
  const [toast, setToast] = useState<{
    message: string
    variant: 'error' | 'warning'
    visible: boolean
  }>({ message: '', variant: 'warning', visible: false })
  ```

#### W-3. handleShare에서 에러 미처리

- **파일**: `src/pages/community/CommunityDetailPage.tsx:122-129`
- **내용**: `navigator.share()`와 `navigator.clipboard.writeText()` 호출 시 에러 핸들링이 없다. 클립보드 API는 HTTPS가 아닌 환경이나 권한 거부 시 실패할 수 있다. 이 부분은 이번 PR 범위 밖(기존 코드)이지만, 좋아요 기능에서 Toast를 도입했으므로 공유 실패 시에도 Toast를 활용할 수 있다.
- **수정 제안**: try-catch로 감싸고 실패 시 Toast로 사용자에게 알림.

### Suggestion (개선 제안)

#### S-1. MSW 핸들러의 하드코딩된 like_count

- **파일**: `src/features/posts/like/handler.ts:11,21`
- **내용**: POST 시 `like_count: 4`, DELETE 시 `like_count: 3`으로 고정되어 있다. 모킹 환경에서 연속 좋아요/취소 테스트 시 항상 동일한 값만 반환하므로 실제 동작과 차이가 발생한다.
- **수정 제안**: 클로저로 카운터를 관리하거나, 요청 횟수에 따라 동적으로 값을 변경하는 방식 고려.

#### S-2. PostActions 컴포넌트의 `isLoggedIn` 체크 중복

- **파일**: `src/components/community/PostActions/PostActions.tsx:38`, `src/pages/community/CommunityDetailPage.tsx:97`
- **내용**: `PostActions`에서 `disabled={!isLoggedIn || isLikePending}`으로 비회원 클릭을 차단하고, `CommunityDetailPage`의 `handleLike`에서도 `!isAuthenticated` 체크를 한다. 방어적 코드로서 나쁘지 않지만, 두 곳에서 동일한 검증이 중복된다.
- **수정 제안**: 의도적 방어라면 주석으로 명시하거나, 한쪽으로 일원화.

#### S-3. 매직 넘버 2000 (공유 복사 피드백 타임아웃)

- **파일**: `src/components/community/PostActions/PostActions.tsx:28`
- **내용**: `setTimeout(() => setCopied(false), 2000)`의 2000ms가 매직 넘버이다. (기존 코드이므로 이번 PR 범위 밖)
- **수정 제안**: `const COPY_FEEDBACK_DURATION = 2000`으로 상수화 권장.

---

## 접근성 (a11y) 평가

| 항목                   | 결과 | 비고                                      |
| ---------------------- | ---- | ----------------------------------------- |
| 좋아요 버튼 aria-label | PASS | `좋아요` / `좋아요 취소` 동적 전환        |
| aria-pressed           | PASS | `isLiked` 상태 반영                       |
| 공유 버튼 aria-label   | PASS | `게시글 링크 복사`                        |
| SVG aria-hidden        | PASS | 장식 아이콘에 `aria-hidden="true"`        |
| Toast role="alert"     | PASS | Toast 컴포넌트에 role, aria-live 설정     |
| focus-visible 스타일   | PASS | `focus-visible:ring-2` 키보드 포커스 대응 |

---

## 에러 처리 평가

| 항목               | 결과 | 비고                                            |
| ------------------ | ---- | ----------------------------------------------- |
| 좋아요 API 에러    | PASS | `onError`에서 Toast로 알림                      |
| 비회원 좋아요 시도 | PASS | Toast 경고 + early return                       |
| 중복 클릭 방지     | PASS | `isPending` 체크 (버튼 disabled + 핸들러 guard) |
| ErrorBoundary      | PASS | `DetailErrorBoundary` class component로 구현    |
| Suspense fallback  | PASS | 로딩 중 메시지 표시                             |

---

## 요약

| 구분             | 결과        |
| ---------------- | ----------- |
| Phase 1 (컨벤션) | PASS        |
| Critical         | 0개         |
| Warning          | 3개         |
| Suggestion       | 3개         |
| **최종 판정**    | **APPROVE** |

좋아요/좋아요 취소 기능이 깔끔하게 구현되어 있다. 컨벤션을 모두 준수하고 있으며, 에러 처리와 접근성도 잘 갖추고 있다. Warning 항목들은 현재 동작에 문제를 일으키지 않지만, 코드 유지보수성 측면에서 후속 개선을 권장한다.
