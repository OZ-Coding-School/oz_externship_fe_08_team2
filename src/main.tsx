import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryProvider } from './providers/QueryProvider'
import './App.css'
import App from './App'

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { setupWorker } = await import('msw/browser')
    const { userSearchHandlers } =
      await import('./features/accounts/user-search')
    const worker = setupWorker(...userSearchHandlers)
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

function renderApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <QueryProvider>
          <App />
        </QueryProvider>
      </BrowserRouter>
    </StrictMode>
  )
}

enableMocking()
  .then(() => renderApp())
  .catch((error) => {
    console.error('MSW 초기화 실패:', error)
    renderApp()
  })
