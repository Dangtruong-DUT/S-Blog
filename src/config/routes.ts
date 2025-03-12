const routes = {
    home: '/',
    blogList: '/new',
    blogDetail: '/blogs/:id',
    createBlog: '/blogs/create',
    editBlog: '/blogs/:id/edit',
    readingList: '/reading-list',
    topics: '/topics/:topicId',
    topicsList: '/topics',
    setting: '/setting',
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    notFound: '*',
    profile: '/profile/:username',
    changePassword: '/auth/change-password'
} as const

export default routes
