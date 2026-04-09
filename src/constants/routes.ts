export const ROUTES = {
  /* Todo: 도메인 추가 후 수정 */
  HOME: '',

  AUTH: {
    LOGIN: '',
  },

  SIGNUP: {
    SELECT: '',
    FORM: '',
  },

  MYPAGE: {
    HOME: '',
    EDIT: '',
    CHANGE_PASSWORD: '',
    QUIZ: '',
  },

  QUIZ: {
    EXAM: '',
    RESULT: '',
  },

  QNA: {
    LIST: '',
    WRITE: '',
    DETAIL: '',
    EDIT: '',
  },

  COMMUNITY: {
    LIST: '/community',
    WRITE: '/community/write',
    DETAIL: '/community/:postId',
    EDIT: '/community/:postId/edit',
  },
} as const
