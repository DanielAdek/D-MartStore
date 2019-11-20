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
    PhoneNumber: { field: 'phoneNumber', required: true, isPhoneNumber: true }
  },
  productCreateForm: {
    formType: 'create_product',
    productName: { field: 'productName', required: true, isName: true },
    productImages: { field: 'productImages', required: true, isArray: true },
    productPrice: { field: 'productPrice', required: true, isDecimal: true },
    productDesc: { field: 'productDescription', required: true },
    productBrand: { field: 'productBrand', required: true },
    productCategory: { field: 'productCategory', required: true },
    productCaptionHeading: { field: 'productCaptionHeading', required: true }
  },
  productEditFrom: {
    formType: 'edit_product',
    productPrice: { field: 'productPrice', required: true, isDecimal: true }
  }
};
