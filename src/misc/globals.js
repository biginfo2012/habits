/*
public endpoint api url
*/
export const globalSettings = {
  baseApiUrl: 'http://34.95.77.187/',
  userApi: 'users',
  authApi: 'auth',
  productsApi: 'products',
  nftApi: 'nft',
  nftSalesApi: 'nftsales',
  auctionApi: 'auction',
  auth: {
    dashboardResetPassword: '/dashboard-reset-password',
    forgotPassword: '/forgot-password/',
    resetPassword: '/reset-password'
  },
  user: {
    login: '/login',
    register: '/register',
    validate: '/validate',
    delete: '/delete/',
    info: '/updateinfo/',
    uploadImage: '/upload/',
    settings: '/update-settings/',
    activate: '/activate',
    changeRole: '/changeRole'
  },
  product: {
    brands: '/brands',
    brand: '/brand/',
    getBrand: '/brand',
    createBrand: '/createBrand',
    products: '/products',
    product: '/product/',
    createProduct: '/createProduct',
    categories: '/categories',
    image: '/image/',
    imageList: '/imageList/',
    effect: '/effect/',
    createVariant: '/createVariant/',
    wallets: '/wallets',
    wallet: '/wallet/',
    createWallet: '/createWallet/'
  },
  nft: {
    sale: '/nftsale',
    createSale: '/create-nftsale',
    auction: '/auction',
    createAuction: '/create-auction',
    image: '/image'
  }
};
