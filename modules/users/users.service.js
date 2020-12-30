'use strict'

const bcrypt = require('bcryptjs')

const { model: usersModel } = require('./users.model')
const { CustomError } = require('../../lib/CustomError')

async function getById(id, filter, projection, options) {
  const user = await usersModel.findOne({ _id: id, ...filter }, projection, { lean: true, ...options })

  if (!user) {
    throw new CustomError(404)
  }

  return user
}

async function changeEmail(id, newEmail) {
  const user = await usersModel.findOne({ _id: id })

  if (!user) {
    throw new CustomError(404)
  }

  if (await usersModel.exists({ email: newEmail })) {
    throw new CustomError(409, 'Email already in use', 'ConflictException')
  }

  user.email = newEmail
  return user.save()
}

async function changePassword(id, oldPassword, newPassword) {
  const user = await usersModel.findOne({ _id: id })

  if (!user) {
    throw new CustomError(404)
  }

  const passwordMatch = await bcrypt.compare(oldPassword, user.password)
  if (!passwordMatch) {
    throw new CustomError(401, 'Invalid credentials')
  }

  user.password = await bcrypt.hash(newPassword, 12)
  return user.save()
}

async function changeInfo(id, newInfo) {
  const user = await usersModel.findOne({ _id: id })

  if (!user) {
    throw new CustomError(404)
  }

  user.name = newInfo.name || user.name
  user.surname = newInfo.surname || user.surname
  user.city = newInfo.city
  user.yearOfBirth = newInfo.yearOfBirth
  user.gender = newInfo.gender

  return user.save()
}

async function deleteById(id) {
  const user = await usersModel.findOne({ _id: id })

  if (!user) {
    throw new CustomError(404)
  }

  return usersModel.deleteOne({ _id: id })
}

module.exports = { getById, changeEmail, changePassword, changeInfo, deleteById }
