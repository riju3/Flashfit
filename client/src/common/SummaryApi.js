export const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080"

const SummaryApi = {
    register : {
        url : '/api/user/register',
        method : 'post'
    },
    login : {
        url : '/api/user/login',
        method : 'post'
    },
    forgot_password : {
        url : "/api/user/forgot-password",
        method : 'put'
    },
    forgot_password_otp_verification : {
        url : 'api/user/verify-forgot-password-otp',
        method : 'put'
    },
    resetPassword : {
        url : "/api/user/reset-password",
        method : 'put'
    },
    refreshToken : {
        url : 'api/user/refresh-token',
        method : 'post'
    },
    userDetails : {
        url : '/api/user/user-details',
        method : "get"
    },
    logout : {
        url : "/api/user/logout",
        method : 'get'
    },
    uploadAvatar : {
        url : "/api/user/upload-avatar",
        method : 'put'
    },
    updateUserDetails : {
        url : '/api/user/update-user',
        method : 'put'
    },
    addCategory : {
        url : '/api/category/add-category',
        method : 'post'
    },
    uploadImage : {
        url : '/api/file/upload',
        method : 'post'
    },
    getCategory : {
        url : '/api/category/get',
        method : 'get'
    },
    updateCategory : {
        url : '/api/category/update',
        method : 'put'
    },
    deleteCategory : {
        url : '/api/category/delete',
        method : 'delete'
    },
    createSubCategory : {
        url : '/api/subcategory/create',
        method : 'post'
    },
    getSubCategory : {
        url : '/api/subcategory/get',
        method : 'post'
    },
    updateSubCategory : {
        url : '/api/subcategory/update',
        method : 'put'
    },
    deleteSubCategory : {
        url : '/api/subcategory/delete',
        method : 'delete'
    },
    createProduct : {
        url : '/api/product/create',
        method : 'post'
    },
    getProduct : {
        url : '/api/product/get',
        method : 'post'
    },
    getProductByCategory : {
        url : '/api/product/get-product-by-category',
        method : 'post'
    },
    getProductByCategoryAndSubCategory : {
        url : '/api/product/get-pruduct-by-category-and-subcategory',
        method : 'post'
    },
    getProductDetails : {
        url : '/api/product/get-product-details',
        method : 'post'
    },
    updateProductDetails : {
        url : "/api/product/update-product-details",
        method : 'put'
    },
    deleteProduct : {
        url : "/api/product/delete-product",
        method : 'delete'
    },
    searchProduct : {
        url : '/api/product/search-product',
        method : 'post'
    },
    addTocart : {
        url : "/api/cart/create",
        method : 'post'
    },
    getCartItem : {
        url : '/api/cart/get',
        method : 'get'
    },
    updateCartItemQty : {
        url : '/api/cart/update-qty',
        method : 'put'
    },
    deleteCartItem : {
        url : '/api/cart/delete-cart-item',
        method : 'delete'
    },
    createAddress : {
        url : '/api/address/create',
        method : 'post'
    },
    getAddress : {
        url : '/api/address/get',
        method : 'get'
    },
    updateAddress : {
        url : '/api/address/update',
        method : 'put'
    },
    disableAddress : {
        url : '/api/address/disable',
        method : 'delete'
    },
    CashOnDeliveryOrder : {
        url : "/api/order/cash-on-delivery",
        method : 'post'
    },
    payment_url : {
        url : "/api/order/checkout",
        method : 'post'
    },
    getOrderItems : {
        url : '/api/order/order-list',
        method : 'get'
    },
    getSettings : {
        url : '/api/settings/get',
        method : 'get'
    },
    updateSettings : {
        url : '/api/settings/update',
        method : 'put'
    },
    cancelOrder : {
        url : '/api/order/cancel-order',
        method : 'post'
    },
    adminAllOrders : {
        url : '/api/order/admin-all-orders',
        method : 'get'
    },
    adminUpdateOrderStatus : {
        url : '/api/order/admin-update-order-status',
        method : 'put'
    },
    addReview : {
        url : '/api/review/add',
        method : 'post'
    },
    getProductReviews : {
        url : '/api/review/product',
        method : 'get'
    },
    getOrderReview : {
        url : '/api/review/order',
        method : 'get'
    },
    addCoupon : {
        url : '/api/coupon/add',
        method : 'post'
    },
    getAllCoupons : {
        url : '/api/coupon/all',
        method : 'get'
    },
    updateCoupon : {
        url : '/api/coupon/update',
        method : 'put'
    },
    deleteCoupon : {
        url : '/api/coupon/delete',
        method : 'delete'
    },
    verifyCoupon : {
        url : '/api/coupon/verify',
        method : 'post'
    },
    getBannerCoupon : {
        url : '/api/coupon/banner',
        method : 'get'
    },
    addBanner : {
        url : '/api/banner/add',
        method : 'post'
    },
    getAllBanners : {
        url : '/api/banner/all',
        method : 'get'
    },
    updateBanner : {
        url : '/api/banner/update',
        method : 'put'
    },
    deleteBanner : {
        url : '/api/banner/delete',
        method : 'delete'
    }
}

export default SummaryApi