import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Home from '../pages/Home'
import { routes } from 'src/config'
import BlogList from 'src/pages/Blog/BlogList'
import BlogDetail from 'src/pages/Blog/BlogDetail'
import Profile from 'src/pages/User/Profile'
import CreateBlog from 'src/pages/Blog/CreateBlog'
import MainLayout from 'src/layouts/MainLayout'
import NotFound from 'src/pages/NotFound'
import UserAccess from 'src/pages/Auth/UserAccess'
import FullWidthLayout from 'src/layouts/FullWidthLayout'
import Topics from 'src/pages/Blog/Topics'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import AuthLayout from 'src/layouts/AuthLayout'

export function ProtectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return isAuthenticated ? <Outlet /> : <Navigate to={routes.login} />
}

export function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return !isAuthenticated ? <Outlet /> : <Navigate to={routes.blogList} />
}

function useRouteElements() {
    const routeElements = useRoutes([
        {
            path: routes.home,
            index: true,
            element: (
                <FullWidthLayout>
                    <Home />
                </FullWidthLayout>
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
                <FullWidthLayout>
                    <BlogDetail />
                </FullWidthLayout>
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
            path: routes.topicsList,
            element: (
                <MainLayout>
                    <Topics />
                </MainLayout>
            )
        },
        {
            path: '',
            element: <RejectedRoute />,
            children: [
                {
                    path: routes.login,
                    element: (
                        <AuthLayout>
                            <UserAccess />
                        </AuthLayout>
                    )
                },
                {
                    path: routes.register,
                    element: (
                        <AuthLayout>
                            <UserAccess />
                        </AuthLayout>
                    )
                }
            ]
        },
        {
            path: '',
            element: <ProtectedRoute />,
            children: [
                {
                    path: routes.me,
                    element: (
                        <MainLayout>
                            <Profile />
                        </MainLayout>
                    )
                },
                {
                    path: routes.createBlog,
                    element: (
                        <FullWidthLayout>
                            <CreateBlog />
                        </FullWidthLayout>
                    )
                },
                {
                    path: routes.editBlog,
                    element: (
                        <MainLayout>
                            <CreateBlog />
                        </MainLayout>
                    )
                }
            ]
        },
        {
            path: routes.notFound,
            element: (
                <FullWidthLayout>
                    <NotFound />
                </FullWidthLayout>
            )
        }
    ])
    return routeElements
}

export default useRouteElements
