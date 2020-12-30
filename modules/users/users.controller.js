'use strict'

const service = require('./users.service')
const { CustomError } = require('../../lib/CustomError')

async function getById(req, res, next) {
  const { id } = req.params

  const projection = {
    password: 0,
    isConfirmed: 0,
  }

  try {
    const user = await service.getById(id, {}, projection, {})
    res.status(200).json({ meta: { code: 200 }, data: user })
  } catch (error) {
    req.log.error({ error, id }, 'Error retrieving user')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

async function changeEmail(req, res, next) {
  const { id } = req.params
  const { email } = req.body

  try {
    await service.changeEmail(id, email)
    res.status(204).json({ meta: { code: 204 } })
  } catch (error) {
    req.log.error({ error, id, email }, 'Error changing user email')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

async function changePassword(req, res, next) {
  const { id } = req.params
  const { oldPassword, password: newPassword } = req.body

  try {
    await service.changePassword(id, oldPassword, newPassword)
    res.status(204).json({ meta: { code: 204 } })
  } catch (error) {
    req.log.error({ error, id }, 'Error changing user password')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

async function changeInfo(req, res, next) {
  const { id } = req.params
  const { body } = req

  try {
    await service.changeInfo(id, body)
    res.status(204).json({ meta: { code: 204 } })
  } catch (error) {
    req.log.error({ error, id, body }, 'Error changing user info')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

async function deleteById(req, res, next) {
  const { id } = req.params

  try {
    await service.deleteById(id)
    res.status(204).json({ meta: { code: 204 } })
  } catch (error) {
    req.log.error({ error, id }, 'Error deleting user')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

module.exports = { getById, changeEmail, changePassword, changeInfo, deleteById }
