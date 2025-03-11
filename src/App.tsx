import useRouteElements from './hooks/useRouteElementsx'

function App() {
    const rootRoutes = useRouteElements()
    return <>{rootRoutes}</>
}

export default App
