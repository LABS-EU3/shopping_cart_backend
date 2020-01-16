const Product = require('../../models/product')
const validateStock = require('../../middleware/validateEditStock')

async function editStock(req, res) {
  try {
    const { errors, isValid } = validateStock(req.body)
    const quantity = req.body.quantity
    if (!isValid) {
      return res.status(400).json(errors)
    }
    const { product_id: productId } = req.params
    const product = await Product.findById({ _id: productId })
    if (!product) {
      return res.status(404).json({ message: 'No product found' })
    }
    // res.send(product)

    if (Number(quantity) > product.stock) {
      return res.status(400).json({ message: 'Not enough stock. Re-stock!' })
    } else {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId },
        { $inc: { stock: -Number(quantity) } },
        { new: true }
      )

      return res.status(200).json(updatedProduct)
    }
  } catch (error) {
    res.status(500).json(error.message)
  }
}

module.exports = editStock
