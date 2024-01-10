import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

/**
 * createRouter 创建路由实例
 * 1.createWebHistory history模式 不带#
 * 2.createWebHashHistory hash模式 带#
 * */
const router = createRouter({
  // import.meta.env.BASE_URL 是 vite中的环境变量(base配置项)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const userStroe = useUserStore()
  if (!userStroe.token && to.path !== '/login') return '/login'
  return true
})
export default router
