import Router from 'vue-router'
import Vue from 'vue'
import Dashboard from '@/components/Dashboard.vue'
import Login from '@/components/Login.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      meta: {
        requiresAuth: true,
      },
      component: Dashboard,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guest: true,
      },
    },
  ],
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = !!localStorage.jwt
  const { requiresAuth, guest } = to.meta
  const nextObj = {}

  if (requiresAuth && !isLoggedIn) nextObj.name = 'login'
  else if (guest && isLoggedIn) nextObj.name = 'dashboard'
  
  next(nextObj)
})

export default router
