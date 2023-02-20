import { createWebHistory, createRouter } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'stateReport',
    component: () => import('@/views/StateReport'), 
  },
  {
    path: '/stockOrder',
    name: 'stockOrder',
    component: () => import('@/views/StockOrder'),
  },
  {
    path: '/fundMng',
    name: 'fundMng',
    component: () => import('@/views/StockFundMng'), 
  },
 {
    path: '/marketLevelMng',
    name: 'marketLevelMng',
    component: () => import('@/views/MarketLevelMng'), 
  },
  {
    path: '/stockMarketLevelMng/:level',
    name: 'stockMarketLevelMng',
    component: () => import('@/views/MarketLevelMng'), // 동적 import
  },

];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});