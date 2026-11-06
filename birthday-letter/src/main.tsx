import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import '@fontsource-variable/noto-sans-tc'
import '@fontsource-variable/noto-serif-tc'
import './styles/tokens.css'
import './styles/global.css'
import './styles/paper.css'
import './styles/gifts.css'
import './styles/envelope.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
