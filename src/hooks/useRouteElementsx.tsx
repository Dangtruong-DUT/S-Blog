import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Home from '../pages/Home'
import { routes } from 'src/config'
import BlogList from 'src/pages/Blog/BlogsPage'
import BlogDetail from 'src/pages/Blog/BlogDetail'
import ManageProfile from 'src/pages/Settings/ManageProfile'
import CreateBlog from 'src/pages/Blog/CreateBlog'
import MainLayout from 'src/layouts/MainLayout'
import NotFound from 'src/pages/NotFound'
import UserAccess from 'src/pages/Auth/UserAccess'
import FullWidthLayout from 'src/layouts/FullWidthLayout'
import Category from 'src/pages/Blog/Category'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import AuthLayout from 'src/layouts/AuthLayout'
import SettingLayout from 'src/layouts/SettingLayout'
import Profile from 'src/pages/Profile'
import ChangePassWord from 'src/pages/Settings/ChangePassword'

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
            path: routes.category,
            element: (
                <MainLayout>
                    <Category />
                </MainLayout>
            ),
            children: [
                {
                    path: routes.blogsOfCategory,
                    element: <BlogList />
                },
                {
                    path: routes.category,
                    element: <BlogList />
                }
            ]
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
                    path: routes.settingProfile,
                    element: (
                        <SettingLayout>
                            <ManageProfile />
                        </SettingLayout>
                    )
                },
                {
                    path: routes.changePassword,
                    element: (
                        <SettingLayout>
                            <ChangePassWord />
                        </SettingLayout>
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
