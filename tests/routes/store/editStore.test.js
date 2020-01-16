const request = require('supertest')
const server = require('../../../server')
const Store = require('../../../models/store')

let token
let token3

async function clearDb () {
  await Store.deleteMany({})
}

beforeEach(() => {
  jest.setTimeout(10000)
})

beforeAll(async () => {
  jest.setTimeout(10000)
  try {
    clearDb()
    const response1 = await request(server)
      .post('/api/auth/register')
      .send({
        phone: '2347031900036',
        password: 'password12345'
      })
    const response2 = await request(server)
      .post('/api/auth/register')
      .send({ phone: '2347031900037', password: 'password12345' })
    const response3 = await request(server)
      .post('/api/auth/register')
      .send({ phone: '2348124120379', password: 'password12345' })
    token3 = response3.body.token
    token = response1.body.token

    //   Create a store
    const newStore = new Store({
      storeName: 'Book&Sticks',
      ownerName: 'Jane Doe',
      currency: 'dollars',
      imageUrl: 'some image',
      seller: response1.body.user.id
    })

    newStore
      .save()
      .then(store => {})
      .catch(err => console.log(err))

    // Create a store for second seller

    const newStore2 = new Store({
      storeName: 'Harry&Jane',
      ownerName: 'Naira Marley',
      currency: 'Naira',
      imageUrl: 'some image',
      seller: response2.body.user.id
    })

    newStore2
      .save()
      .then(store => {})
      .catch(err => console.log(err))
  } catch (error) {
    console.error(error.name, error.message)
  }
})

describe('edit store', () => {
  it('should work', async () => {
    expect(1).toBe(1)
  })

  it('should return no credentials provided', async () => {
    const response = await request(server).put('/api/store')
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ message: 'No credentials provided' })
  })

  it('should return all fields required', async () => {
    const response = await request(server)
      .put('/api/store')
      .send({})
      .set('Authorization', token)
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    expect(response.body).toEqual({
      ownerName: 'Name of store owner is required',
      currency: 'Store currency is required',
      storeName: 'Store name is required'
    })
  })

  it('should return currency, imageUrl & storename required', async () => {
    const response = await request(server)
      .put('/api/store')
      .send({ ownerName: 'John Doe' })
      .set('Authorization', token)
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    expect(response.body).toEqual({
      currency: 'Store currency is required',
      storeName: 'Store name is required'
    })
  })

  it('should return imageUrl & storename required', async () => {
    const response = await request(server)
      .put('/api/store')
      .send({ ownerName: 'John Doe', currency: 'cedi' })
      .set('Authorization', token)
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    expect(response.body).toEqual({
      // imageUrl: 'Store imageURL is required',
      storeName: 'Store name is required'
    })
  })

  it('should return storename required', async () => {
    const response = await request(server)
      .put('/api/store')
      .send({
        ownerName: 'John Doe',
        currency: 'cedi',
        imageUrl: 'https://someimage.com'
      })
      .set('Authorization', token)
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    expect(response.body).toEqual({
      storeName: 'Store name is required'
    })
  })

  it('should return edited store info', async () => {
    const response = await request(server)
      .put('/api/store')
      .send({
        ownerName: 'John Doe',
        currency: 'shillings',
        imageUrl: 'https://someimage.com',
        storeName: 'sticks & bones'
      })
      .set('Authorization', token)
    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
  })
  it('should return store not found', async () => {
    const response = await request(server)
      .put('/api/store')
      .send({
        ownerName: 'John Doe',
        currency: 'cedi',
        imageUrl: 'https://someimage.com',
        storeName: 'sticks & bones'
      })
      .set('Authorization', token3)
    expect(response.status).toBe(404)
    expect(response.body).toEqual({ message: 'No store was found' })
  })

  it('Store Name has been taken already', async () => {
    const response = await request(server)
      .put('/api/store')
      .send({
        storeName: 'Harry&Jane',
        ownerName: 'Naira Marley',
        currency: 'Naira',
        imageUrl: 'some image'
      })
      .set('Authorization', token)
    expect(response.body).toEqual({
      message: 'Store Name has been taken already'
    })
    expect(response.status).toBe(400)
  })
})
