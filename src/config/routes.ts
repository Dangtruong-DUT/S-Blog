const routes = {
    home: '/',
    blogs: '/blogs',
    blogDetail: '/blogs/:id',
    createBlog: '/blogs/create',
    editBlog: '/blogs/:id/edit',
    setting: '/setting',
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    notFound: '*',
    profile: '/:username',
    changePassword: '/auth/change-password'
} as const

export default routes
