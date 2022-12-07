import { lazy } from 'react';

const Routez = [
  {
    path: 'home',
    component: lazy(() => import('../pages/habits/DashboardOverview')),
    exact: true
  },
  {
    path: 'brands',
    component: lazy(() => import('../pages/habits/Brands')),
    exact: true
  },
  {
    path: 'users',
    component: lazy(() => import('../pages/habits/Users')),
    exact: true
  },
  {
    path: 'products',
    component: lazy(() => import('../pages/habits/Products')),
    exact: true
  },
  {
    path: 'nfts',
    component: lazy(() => import('../pages/habits/NFTs')),
    exact: true
  },
  {
    path: 'nft',
    component: lazy(() => import('../pages/habits/NFT')),
    exact: true
  },
  {
    path: 'nft/auction',
    component: lazy(() => import('../pages/habits/Auction')),
    exact: true
  },
  {
    path: 'nft/auctions',
    component: lazy(() => import('../pages/habits/Auctions')),
    exact: true
  },
  {
    path: 'nft/nftsale',
    component: lazy(() => import('../pages/habits/NFTSale')),
    exact: true
  },
  {
    path: 'nft/nftsales',
    component: lazy(() => import('../pages/habits/NFTSales')),
    exact: true
  },
  {
    path: 'brand',
    component: lazy(() => import('../pages/habits/Brand')),
    exact: true
  },
  {
    path: 'settings',
    component: lazy(() => import('../pages/Settings')),
    exact: true
  },
  {
    path: 'product',
    component: lazy(() => import('../pages/habits/Product')),
    exact: true
  },
  {
    path: 'ireset-password',
    component: lazy(() => import('../pages/habits/InnerResetPassword')),
    exact: true
  }
];

export default Routez;