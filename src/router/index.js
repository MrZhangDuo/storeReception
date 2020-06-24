import Vue from 'vue'
import Router from 'vue-router'
import commentArea from '@/views/store-manage/commodity/commodityEvaluate/commentArea.vue'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
/*  import componentsRouter from './modules/components'
 import chartsRouter from './modules/charts'
 import tableRouter from './modules/table'
 import nestedRouter from './modules/nested' */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基页
 * 所有角色都可以访问
 */
// 所有权限通用路由表
// 如首页和登录页和一些不用权限的公用页面
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/commentArea',
    name: 'commentArea',
    component: commentArea
  }

]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  // 用户管理
  {
    path: '/components1',
    component: Layout,
    redirect: '/components/sys',
    alwaysShow: true, // will always show the root menu
    name: 'components1',
    meta: {
      title: '系统管理',
      icon: 'lock',
      permissions: ['user:queryAllUser', 'role:queryAllRole']
      // roles: ['ww'] // you can set roles in root nav
    },
    children: [
      {
        path: 'userManage',
        name: 'userManage',
        component: () => import('@/views/store-manage/userManage/userManage'),
        meta: {
          title: '用户管理'
          // permission: 'user:queryAllUser',
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'roleManage',
        name: 'roleManage',
        component: () => import('@/views/store-manage/roleManage/roleManage'),
        meta: {
          // permission: 'role:queryAllRole',
          title: '角色管理'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },
  // 商品管理
  {
    path: '/components2',
    component: Layout,
    redirect: '/store-manage/commodity',
    alwaysShow: true, // will always show the root menu
    name: 'commodity',
    meta: {
      title: '商品管理',
      icon: 'lock',
      permission: 'commodity:selectLikeInfo.do'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'commodityTable',
        name: 'commodityTable',
        component: () => import('@/views/store-manage/commodity/commodityTable/commodityTable'),
        meta: {
          title: '商品列表',
          permission: '/xxx/xxx',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'addcommodity',
        name: 'addcommodity',
        component: () => import('@/views/store-manage/commodity/addcommodity/addcommodity'),
        meta: {
          permission: '/xxx/xxx',
          title: '添加商品'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'commodityExamine',
        name: 'commodityExamine',
        component: () => import('@/views/store-manage/commodity/commodityExamine/commodityExamine'),
        meta: {
          permission: '/xxx/xxx',
          title: '商品审核',
          roles: ['admin']
        }
      },
      {
        path: 'commodityEvaluate',
        name: 'commodityEvaluate',
        component: () => import('@/views/store-manage/commodity/commodityEvaluate/commodityEvaluate.vue'),
        meta: {
          title: '商品评价',
          permission: '/xxx/xxx',
          roles: ['admin']
        }
      },
      {
        path: 'commodityType',
        name: 'commodityType',
        component: () => import('@/views/store-manage/commodity/commodityType/commodityType'),
        meta: {
          title: '商品分类',
          permission: '/xxx/xxx',
          roles: ['admin']
        }
      },

      {
        path: 'specss',
        name: 'specss',
        component: () => import('@/views/store-manage/commodity/specss/specss'),
        meta: {
          title: '规格参数',
          permission: '/xxx/xxx',
          roles: ['admin']
        }
      }

    ]
  },
  // 订单管理
  {
    path: '/components3',
    component: Layout,
    redirect: '/components/order',
    alwaysShow: true, // will always show the root menu
    name: 'order',
    meta: {
      title: '订单管理',
      icon: 'lock',
      permissio: ['orders:queryAllOrders', 'returns:queryAllReturns']
    },
    children: [
      {
        path: 'orderTable',
        name: 'orderTable',
        component: () => import('@/views/store-manage/orders/orderTable/orderTable'),
        meta: {
          title: '订单列表',
          permissio: 'orders:queryAllOrders'
        }
      },
      {
        path: 'returns',
        name: 'returns',
        component: () => import('@/views/store-manage/orders/returns/returns'),
        meta: {
          title: '退货(款)申请处理',
          permissio: 'returns:queryAllReturns'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },
  // 库存管理
  {
    path: '/components4',
    component: Layout,
    redirect: '/components/order',
    alwaysShow: true, // will always show the root menu
    name: 'order',
    meta: {
      title: '库存管理',
      icon: 'lock',
      permissio: ['', '']
    },
    children: [
      {
        path: 'outLibrary',
        name: 'outLibrary',
        component: () => import('@/views/store-manage/goout/outLibrary/outLibrary'),
        meta: {
          title: '商品出库'
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'ruLibrary',
        name: 'ruLibrary',
        component: () => import('@/views/store-manage/goout/ruLibrary/ruLibrary'),
        meta: {
          title: '商品入库',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  // 客户管理
  {
    path: '/components5',
    component: Layout,
    redirect: '/components/customer',
    alwaysShow: true, // will always show the root menu
    name: 'customer',
    meta: {
      title: '客户管理',
      icon: 'lock',
      permission: 'customer:queryAllCustomer'
    },
    children: [
      {
        path: 'customerTable',
        name: 'customerTable',
        component: () => import('@/views/store-manage/customer/customerTable/customerTable'),
        meta: {
          title: '客户列表',
          permission: 'customer:queryAllCustomer'
        }
      }
    ]
  },
  // 运营管理
  {
    path: '/components6',
    component: Layout,
    redirect: '/components/customer',
    alwaysShow: true, // will always show the root menu 将始终显示根菜单
    name: 'seckill',
    meta: {
      title: '运营管理',
      icon: 'lock',
      permission: 'seckill:queryAllSeckill'
    },
    children: [
      {
        path: 'seckillTable',
        name: 'seckillTable',
        component: () => import('@/views/store-manage/operate/seckillTable/seckillTable'),
        meta: {
          title: '秒杀活动列表',
          permission: 'seckill:queryAllSeckill'// 或者 只能在子导航中设置角色
        }
      }
    ]
  },
  // 统计分析
  {
    path: '/components7',
    component: Layout,
    redirect: '/components/statistics',
    alwaysShow: true, // 将始终显示根菜单
    name: 'statistics',
    meta: {
      title: '统计分析',
      icon: 'lock',
      roles: ['超级管理员'] // 可以在根导航中设置角色 或者 只能在子导航中设置角色
    },
    children: [
      {
        path: 'commodityCount',
        name: 'commodityCount',
        component: () => import('@/views/store-manage/count/commodityCount/commodityCount'),
        meta: {
          title: '商品统计',
          permission: 'commodity:commodityCount' // 可以在根导航中设置角色 或者 只能在子导航中设置角色
        }
      },
      {
        path: 'vipCount',
        name: 'vipCount',
        component: () => import('@/views/store-manage/count/vipCount/vipCount'),
        meta: {
          title: '会员统计',
          permission: 'commodity:vipCountCount'
          // 如果不设置角色，则表示：此页不需要权限
        }
      },
      {
        path: 'tradeCount',
        name: 'tradeCount',
        component: () => import('@/views/store-manage/count/tradeCount/tradeCount'),
        meta: {
          title: '交易统计',
          permission: 'commodity:tradeCountCount'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },
  // 404页必须放在末尾！！！
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // 需要服务支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const router = createRouter()
// 详情见: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由器
}
export default router
