import { useRoutes } from 'react-router-dom'
import Home from '../pages/Home'
import { routes } from 'src/config'
import BlogList from 'src/pages/Blog/BlogList'
import BlogDetail from 'src/pages/Blog/BlogDetail'
import Profile from 'src/pages/User/Profile'
import CreateBlog from 'src/pages/Blog/CreateBlog'
import MainLayout from 'src/layouts/MainLayout'
import NotFound from 'src/pages/NotFound'
import Topics from 'src/pages/Topics'
import Login from 'src/pages/Auth/Login'
import Register from 'src/pages/Auth/Register'
import FullWidthLayout from 'src/layouts/FullWidthLayout'

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
            path: routes.blogList,
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
                <FullWidthLayout>
                    <NotFound />
                </FullWidthLayout>
            )
        },
        {
            path: routes.topicsList,
            element: (
                <MainLayout>
                    <Topics />
                </MainLayout>
            )
        },
        {
            path: routes.login,
            element: (
                <MainLayout>
                    <Login />
                </MainLayout>
            )
        },

        {
            path: routes.register,
            element: (
                <FullWidthLayout>
                    <Register />
                </FullWidthLayout>
            )
        }
    ])
    return routeElements
}

export default useRouteElements
