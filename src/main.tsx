import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { SettingsProvider } from './contexts/settings.context.tsx'
import { AppProvider } from './contexts/app.context.tsx'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AppProvider>
                    <SettingsProvider>
                        <App />
                    </SettingsProvider>
                </AppProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
)
