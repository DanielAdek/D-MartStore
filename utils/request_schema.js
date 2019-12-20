export default {
  loginFrom: {
    formType: 'login',
    dataField: { field: 'dataField', required: true },
    password: { field: 'password', required: true }
  },
  signupForm: {
    formType: 'signup',
    email: { field: 'email', required: true, isEmail: true },
    username: { field: 'username', required: true, isName: true },
    password: {
      field: 'password', required: true, min: 8, max: 15
    },
    PhoneNumber: { field: 'phoneNumber', required: true, isPhoneNumber: true },
    address: { field: 'userAddress' }
  },
  productCreateForm: {
    formType: 'create_product',
    productName: { field: 'productName', required: true, isName: true },
    productImages: { field: 'productImages', required: true, isArray: true },
    productPrice: { field: 'productPrice', required: true, isDecimal: true },
    productDesc: { field: 'productDescription', required: true },
    productBrand: { field: 'productBrand', required: true },
    productCategory: { field: 'productCategory', required: true },
    productClr: { field: 'productColor', required: true },
    productCd: { field: 'productCode', required: true },
    productCaptionHeading: { field: 'productCaptionHeading', required: true }
  },
  productEditFrom: {
    formType: 'edit_product',
    productPrice: { field: 'productPrice', required: true, isDecimal: true }
  },
  orderForm: {
    formType: 'create_order',
    recipientName: { field: 'recipientName', isName: true },
    deliveryAdr: { field: 'recipientDeliveryAdr' },
    email: { field: 'recipientEmail', isEmail: true },
    phone: { field: 'recipientPhoneNumber', isPhoneNumber: true },
    note: { field: 'recipientOrderNote' },
    payOpt: { field: 'orderPaymentOption', required: true },
    productId: { field: 'productId', required: true, isArray: true }
  },
  kartForm: {
    formType: 'create_kart',
    data: { field: 'kartData' }
  },
  editKartForm: {
    formType: 'edit_kart',
    arrayOfItems: { field: 'itemsInKart', isArray: true, required: true },
  },
  reviewForm: {
    formType: 'create_review',
    username: { field: 'username' },
    email: { field: 'email', isEmail: true },
    review: { field: 'review' },
    rate: { field: 'rating', isInteger: true, range: { from: 1, to: 5 } },
  },
  editReviewForm: {
    formType: 'edit_review',
    review: { field: 'review' },
    email: { field: 'email', isEmail: true },
    rate: { field: 'rating', isInteger: true, range: { from: 1, to: 5 } },
  },
  wishlistForm: {
    formType: 'create_wishlist',
    wishCode: { field: 'wishlistcode' }
  }
};
