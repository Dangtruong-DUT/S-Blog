import useRouteElements from './hooks/useRouteElementsx'
import { ToastContainer } from 'react-toastify'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Modal from 'react-modal'
import './toastCustom.css'

Modal.setAppElement('#root')
function App() {
    const rootRoutes = useRouteElements()
    return (
        <>
            {rootRoutes}
            <ToastContainer />
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    )
}

export default App
