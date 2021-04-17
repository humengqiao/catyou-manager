import store from '@/store'

const excludeRoutePath = [
  '/login',
  '/dashboard/no-authority',
  '/dashboard'
]

const isDynamicRoute = (permissionList, to) => {
  let { path, params } = to
  const keys = Object.keys(params)
  const values = Object.values(params)
  const reg1 = new RegExp(`${keys.map(item => `(\\/:${item})`).join('|')}\\/?$`, 'g')
  const reg2 = new RegExp(`${values.map(item => `(\\/${item})`).join('|')}\\/?$`, 'g')

  permissionList = permissionList.map(item => {
    return item.path.replace(reg1, '')
  })
  path = path.replace(reg2, '')

  return permissionList.findIndex(item => item === path) !== -1
}

const routerConfig = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    component: () => import('@views/login')
  },
  {
    path: '/dashboard',
    component: () => import('@views/dashboard'),
    children: [
      {
        path: 'goods-list',
        component: () => import('@views/goods-list')
      },
      {
        path: 'upc-list',
        component: () => import('@views/upc')
      },
      {
        path: 'buy-detail-list',
        component: () => import('@views/buy-detail')
      },
      {
        path: 'fba-post-list',
        component: () => import('@views/fba-post-detail')
      },
      {
        path: 'post-cost-list',
        component: () => import('@views/post-cost-detail')
      },
      {
        path: 'permission',
        component: () => import('@views/permission'),
        children: [
          {
            path: '/',
            redirect: 'list'
          },
          {
            path: 'list',
            component: () => import('@views/permission/list')
          },
          {
            path: 'modify/:username',
            component: () => import('@views/permission/modify')
          }
        ]
      },
      {
        path: 'navigation',
        component: () => import('@views/navigation')
      },
      {
        path: 'no-authority',
        component: () => import('@views/no-authority')
      }
    ]
  },
  {
    path: '*',
    component: () => import('@views/error')
  }
]

const getRouterFullPath = routerConfig => {
  return routerConfig
    .filter(item => !item.redirect)
    .reduce((prev, next) => {
      prev.push(next.path)

      if(next.children && next.children.length > 0) {
        prev.push(...getRouterFullPath(next.children.map(item => ({...item, path: item.path.startsWith('/') ? item.path : `${next.path}/${item.path}`}))))
      }

      return prev
  }, [])
}

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  routes: routerConfig
})

router.beforeEach((to, from, next) => {
  // eslint-disable-next-line
  const { user, permissionList } = (store.__esModule ? store.default : store).state.global
  if(to.path === '/login') return next()

  if(!user) {
    return next({
      path: '/login'
    })
  }

  if(excludeRoutePath.findIndex(item => item === to.path) !== -1) return next()

  // 检查用户权限
  if(
    permissionList &&
    permissionList.length > 0 &&
    (permissionList.findIndex(item => item.path === to.path) !== -1 || isDynamicRoute(permissionList, to))
  ) {
    next()
  }else {
    if(getRouterFullPath(routerConfig).findIndex(item => item === to.path ||
      item.replace(/(:([^\\/]+))/g, () => {
        return to.params[RegExp.$2] || ''
      })
    ) !== -1) {
      return next({
        path: '/dashboard/no-authority'
      })
    }

    return next()
  }
})

export default router
