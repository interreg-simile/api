/* eslint-disable newline-per-chained-call */
'use strict'

const { body, query } = require('express-validator')

const register = [
  body('email')
    .not().isEmpty().withMessage('Must have a value')
    .isEmail().withMessage('Must be an email')
    .normalizeEmail(),

  body('password')
    .trim()
    .not().isEmpty().withMessage('Must have a value')
    .isLength({ min: 8, max: 50 }).withMessage('Must be between 8 and 50 characters'),

  body('confirmPassword')
    .trim()
    .not().isEmpty().withMessage('Must have a value')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password')
      }

      return true
    }),

  body('name')
    .trim()
    .not().isEmpty().withMessage('Must have a value')
    .escape(),

  body('surname')
    .trim()
    .not().isEmpty().withMessage('Must have a value')
    .escape(),

  body('city')
    .optional()
    .trim()
    .escape(),

  body('yearOfBirth')
    .optional()
    .isInt({
      min: 1920,
      max: 2020,
      allow_leading_zeroes: false,
    }).withMessage('Must be an integer between 1920 and 2020'),

  body('gender')
    .optional()
    .isIn(['male', 'female', 'other']).withMessage('Must be one of \'male\', \'female\', \'other\''),
]

const confirmEmail = [
  query('email')
    .not().isEmpty()
    .isEmail()
    .normalizeEmail(),

  query('token').not().isEmpty(),
]

const login = [
  body('email')
    .not().isEmpty().withMessage('Must have a value')
    .isEmail().withMessage('Must be an email')
    .normalizeEmail(),

  body('password')
    .trim()
    .not().isEmpty().withMessage('Must have a value'),
]

module.exports = { register, login, confirmEmail }
