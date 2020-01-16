const request = require('supertest')
const server = require('../../../server')
const Store = require('../../../models/store')
const Product = require('../../../models/product')
const Seller = require('../../../models/seller')

let token
let storeId
let product1Id

async function clearDb() {
  await Seller.deleteMany({})
  await Product.deleteMany({})
  await Store.deleteMany({})
}

beforeAll(async () => {
  try {
    await clearDb()
    const response = await request(server)
      .post('/api/auth/register')
      .send({
        phone: '+233276202069',
        password: 'password12345'
      })

    token = response.body.token

    const store = await request(server)
      .post('/api/store')
      .send({
        storeName: 'Laptops & Phones',
        ownerName: 'Jane Doe',
        currency: 'dollars',
        imageUrl: 'some image'
      })
      .set('Authorization', token)
    storeId = store.body.saved._id

    //   create products
    const product1 = await request(server)
      .post('/api/store/products')
      .send({
        name: 'Shoes1',
        description: 'A very nice',
        price: 500,
        stock: 10,
        images: ['mee.jpg', 'us.jpg'],
        storeId
      })
      .set('Authorization', token)
    product1Id = product1.body._id
  } catch (error) {
    console.error(error.name, error.message)
  }
})

describe('edit stock', () => {
  it('should work', async () => {
    expect(1).toBe(1)
  })

  it('should return quantity is required', async () => {
    const response = await request(server)
      .put(`/api/store/products/${product1Id}/stock`)
      .send({ quantity: '' })
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ quantity: 'Quantity is required' })
  })

  it('should return quantity must be a number', async () => {
    const response = await request(server)
      .put(`/api/store/products/${product1Id}/stock`)
      .send({ quantity: 'aa' })
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ quantity: 'Quantity must be an integer' })
  })

  it('should return quantity must be greater than zero', async () => {
    const response = await request(server)
      .put(`/api/store/products/${product1Id}/stock`)
      .send({ quantity: -1 })
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      quantity: 'Quantity must be greater than zero'
    })
  })

  it('should return product not found', async () => {
    const response = await request(server)
      .put(`/api/store/products/5e1defb857aff215deecc4ad/stock`)
      .send({ quantity: '4' })
    expect(response.status).toBe(404)
    expect(response.body).toEqual({ message: 'No product found' })
  })

  it('should return not enough stock', async () => {
    const response = await request(server)
      .put(`/api/store/products/${product1Id}/stock`)
      .send({ quantity: 4000000 })
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ message: 'Not enough stock. Re-stock!' })
  })

  it('should return invalid id type', async () => {
    const response = await request(server)
      .put('/api/store/products/wrongid/stock')
      .send({ quantity: 100 })
    expect(response.status).toBe(500)
    expect(response.body).toBeDefined()
  })

  it('should return updated product stock', async () => {
    const response = await request(server)
      .put(`/api/store/products/${product1Id}/stock`)
      .send({ quantity: 2 })
    expect(response.status).toBe(200)
    expect(response.body.stock).toBe(8)
  })
})
