const routes = {
    home: '/',
    blogList: '/new',
    blogDetail: '/:nameId',
    createBlog: '/create',
    editBlog: '/:id/edit',
    readingList: '/reading-list',
    topics: '/topics/:topicId',
    topicsList: '/topics',
    setting: '/setting',
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    notFound: '*',
    profile: '/profile/:username',
    me: '/me',
    changePassword: '/auth/change-password'
} as const

export default routes
