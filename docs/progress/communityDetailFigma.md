# 게시글 상세 페이지 Figma UI 반영 작업 내용

> **담당자**: 정선영
> **브랜치**: `style/community-detail-figma-ui`
> **관련 이슈**: `#34`
> **PR**: `#36` (`style/community-detail-figma-ui` → `dev`)

---

## 작업 개요

게시글 상세 페이지(`CommunityDetailPage`) 및 하위 컴포넌트에 **Figma 디자인 반영**.
기존 API 연동 기반의 동작 코드는 유지하면서, 레이아웃·타이포그래피·색상·버튼 형태를 Figma 스펙에 맞게 교체.
공유하기 버튼(링크 복사)도 이 PR에서 함께 구현.

---

## 변경 파일 목록

| 파일                                                               | 변경 내용                                                                    | 상태    |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------- |
| `src/pages/community/CommunityDetailPage.tsx`                      | `pt-16` 상단 여백, 구분선 추가, 레이아웃 조정                                | ✅ 완료 |
| `src/components/community/PostHeader/PostHeader.tsx`               | 카테고리 `text-xl font-bold`, 제목 `text-[32px]`, Avatar `lg`, 메타 레이아웃 | ✅ 완료 |
| `src/components/community/PostAuthorActions/PostAuthorActions.tsx` | 수정(`text-primary`) / 삭제(`text-gray-500`) 텍스트 버튼, 세로 구분선        | ✅ 완료 |
| `src/components/community/PostBody/PostBody.tsx`                   | 본문 색상 `text-text-heading`, 상하 여백 `py-10`                             | ✅ 완료 |
| `src/components/community/PostActions/PostActions.tsx`             | 좋아요 pill shape, 공유하기 버튼(링크 복사) 추가                             | ✅ 완료 |

---

## 컴포넌트별 주요 변경 사항

### PostHeader

- 카테고리 뱃지: `text-primary text-xl font-bold` — Figma 주요 색상·크기 반영
- 제목: `text-[32px] leading-snug font-bold` — 정확한 픽셀값으로 지정
- 프로필 영역: `Avatar size="lg"` + 닉네임 `text-base font-semibold text-gray-600`
- 메타(조회수·날짜): `flex gap-1 text-base text-gray-400` + `·` 구분자

### PostAuthorActions

- 수정 버튼: `text-primary` 색상의 텍스트 버튼
- 삭제 버튼: `text-gray-500` 색상의 텍스트 버튼
- 두 버튼 사이: `|` 세로 구분선 (`text-gray-300`)
- 공통 `Button` 컴포넌트(`variant="ghost"`) 사용

### PostBody

- 본문 래퍼 색상: `text-text-heading` (디자인 토큰)
- 본문 상하 여백: `py-10`

### PostActions

- 좋아요 버튼: pill shape(`rounded-full`) + 좋아요 상태에 따라 `border-primary bg-primary-50 text-primary` ↔ `border-gray-300 text-gray-500`
- 공유하기 버튼: pill shape + `navigator.clipboard.writeText`로 현재 URL 복사
  - 복사 성공 시 2초간 "복사됨!" 텍스트 피드백
  - 링크 아이콘(SVG) + "공유하기" 텍스트
- 두 버튼 모두 `Button variant="ghost"` 공통 컴포넌트로 교체 (`refactor` 커밋에서 진행)

### CommunityDetailPage

- 최상단 컨테이너 `pt-16` 상단 여백 추가
- 헤더 하단, 본문 하단에 `<hr />` 구분선 삽입
- 작성자 본인일 때만 `PostAuthorActions` 렌더링 (기존 `isAuthor` 로직 유지)

---

## 구현 요구사항 체크리스트

### Figma UI 반영

- [x] 카테고리 텍스트 스타일 (`text-primary text-xl font-bold`)
- [x] 제목 32px, 굵게
- [x] Avatar 크기 `lg`
- [x] 조회수·날짜 메타 정보 레이아웃
- [x] 수정/삭제 텍스트 버튼 + 세로 구분선
- [x] 본문 영역 색상 및 여백
- [x] 좋아요 pill shape, 상태별 색상 토글
- [x] 페이지 상단 여백 및 구분선

### 공유하기 기능

- [x] 현재 페이지 URL을 클립보드에 복사
- [x] 복사 성공 시 2초간 "복사됨!" 피드백
- [x] Figma 디자인 반영 (pill shape, 링크 아이콘)
- [x] 공통 `Button` 컴포넌트 활용

---

## 상세 페이지 연결 구조

```
CommunityDetailPage
├── PostHeader          — 카테고리, 제목, 프로필, 메타
├── PostAuthorActions   — 수정/삭제 (isAuthor일 때만)
├── PostBody            — 본문 HTML 렌더
├── PostActions         — 좋아요, 공유하기
└── CommunityCommentsPage — 댓글 (별도 PR에서 구현)
```

---

## 커밋 이력

| 커밋 메시지                                                                             | 내용                                                                     |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `style: 게시글 상세 페이지 Figma UI 반영 (#34)`                                         | PostHeader, PostAuthorActions, PostBody, CommunityDetailPage 스타일 반영 |
| `feat: 게시글 공유하기 버튼 구현 (#34)`                                                 | navigator.clipboard 복사, "복사됨!" 피드백                               |
| `style: 공유하기 버튼 Figma 디자인 반영 (#34)`                                          | PostActions pill shape, 링크 아이콘 반영                                 |
| `refactor: reorder share and like buttons in PostActions component`                     | 좋아요→공유하기 버튼 순서 조정                                           |
| `refactor: PostAuthorActions와 PostActions에서 기본 버튼을 공통 Button 컴포넌트로 교체` | variant="ghost" 공통 컴포넌트 적용                                       |
