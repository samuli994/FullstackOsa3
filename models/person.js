const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const numberValidator = (number) => {
    const parts = number.split('-')
    if (parts.length !== 2) {
      return false
    }
    const [areaCode, mainNumber] = parts;
    if (!/^\d{2,3}$/.test(areaCode) || !/^\d+$/.test(mainNumber)) {
      return false
    }
    return number.replace('-', '').length >= 8
  }

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true
    },
    number: {
      type: String,
      validate: {
        validator: numberValidator,
        message: props => `${props.value} is not a valid phone number! It should be in the format XX-XXXXXXX or XXX-XXXXXXX.`
      },
      required: true
    }
  })
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)