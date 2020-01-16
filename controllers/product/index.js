const addProduct = require('./addProduct')
const { getProducts, getOneProduct } = require('./getProducts')
const editProduct = require('./editProduct')
const deleteProduct = require('./deleteProduct')
const editStock = require('./editStock')

module.exports = {
  addProduct,
  getProducts,
  getOneProduct,
  editProduct,
  deleteProduct,
  editStock
}
