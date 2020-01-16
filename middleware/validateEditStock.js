const Validator = require('validator')
const isEmpty = require('is-empty')

function validateStock({ quantity }) {
  const errors = {}
  quantity = quantity || ''

  //   check if its a number
  if (!Number.isInteger(Number(quantity))) {
    errors.quantity = 'Quantity must be an integer'
  }

  //   check if quantity is greater than zero
  if (Number(quantity) <= 0) {
    errors.quantity = 'Quantity must be greater than zero'
  }

  // check if quantity is existent
  if (isEmpty(quantity)) {
    errors.quantity = 'Quantity is required'
  }

  //   if (Number.isInteger(quantity)) {
  //     errors.quantity = 'Quantity must be a positive number'
  //   }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateStock
