const isEmpty = require('is-empty')
// const Validator = require('validator')
function validateCartInput (data) {
  const errors = {}
  // Convert empty fields to an empty string so we can use validator functions
  let { agreedPrice, total } = data

  agreedPrice = agreedPrice || ''
  total = total || ''
  // email = email || ''

  // agreedPrice checks
  if (!agreedPrice) {
    errors.agreedPrice = 'agreedPrice field is required'
  } else if (isNaN(agreedPrice)) {
    errors.agreedPrice = 'agreedPrice must be a number'
  } else if (Number(agreedPrice) < 0) {
    errors.agreedPrice = 'agreedPrice cant be less than 1'
  }

  // total checks
  if (!total) {
    errors.total = 'total field is required'
  } else if (isNaN(total)) {
    errors.total = 'total must be a number'
  } else if (Number(total) < 0) {
    errors.total = 'total cant be less than 1'
  }

  // email checks
  // if (!email) {
  //   errors.email = 'email field is required'
  // } else if (!Validator.isEmail(email)) {
  //   errors.email = 'Email Address must be valid'
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateCartInput
