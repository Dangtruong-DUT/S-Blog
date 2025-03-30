const routes = {
    home: '/',
    blogList: '/new',
    blogDetail: '/blogs/:nameId',
    createBlog: '/create',
    editBlog: '/blogs/:id/edit',
    blogsOfCategory: '/category/:category',
    category: '/category',
    setting: '/setting',
    changePassword: '/setting/change-password',
    settingProfile: '/setting',
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    notFound: '*',
    profile: '/:username'
} as const

export default routes
