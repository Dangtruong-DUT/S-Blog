import { useRoutes } from 'react-router-dom'
import Home from '../pages/Home'
import { routes } from 'src/config'
import BlogList from 'src/pages/Blog/BlogList'
import BlogDetail from 'src/pages/Blog/BlogDetail'
import Profile from 'src/pages/User/Profile'
import CreateBlog from 'src/pages/Blog/CreateBlog'
import MainLayout from 'src/layouts/MainLayout'
import NotFound from 'src/pages/NotFound'

function useRouteElements() {
    const routeElements = useRoutes([
        {
            path: routes.home,
            element: (
                <MainLayout>
                    <Home />
                </MainLayout>
            )
        },
        {
            path: routes.blogs,
            element: (
                <MainLayout>
                    <BlogList />
                </MainLayout>
            )
        },
        {
            path: routes.blogDetail,
            element: (
                <MainLayout>
                    <BlogDetail />
                </MainLayout>
            )
        },
        {
            path: routes.createBlog,
            element: (
                <MainLayout>
                    <CreateBlog />
                </MainLayout>
            )
        },
        {
            path: routes.editBlog,
            element: (
                <MainLayout>
                    <CreateBlog />
                </MainLayout>
            )
        },
        {
            path: routes.profile,
            element: (
                <MainLayout>
                    <Profile />
                </MainLayout>
            )
        },
        {
            path: routes.notFound,
            element: (
                <MainLayout>
                    <NotFound />
                </MainLayout>
            )
        }
    ])
    return routeElements
}

export default useRouteElements
