/* eslint-disable no-unused-vars,no-await-in-loop */
'use strict'

const fs = require('fs').promises
const path = require('path')
const { errorTypes, errorMessages } = require('../lib/CustomError')

const { UPLOAD_PATH } = process.env

async function removeUploadedFiles(req) {
  try {
    for (const fieldName of Object.keys(req.files)) {
      for (const file of req.files[fieldName]) {
        await fs.unlink(path.join(UPLOAD_PATH, file.filename))
      }
    }
  } catch (error) {
    req.log.error({ error }, 'Error removing uploaded files')
  }
}

module.exports = async(error, req, res, next) => {
  if (req.files) {
    await removeUploadedFiles(req)
  }

  const statusCode = error.code || 500

  const meta = {
    code: statusCode,
    errorMessage: error.message || errorMessages[500],
    errorType: error.type || errorTypes[500],
  }

  res.status(statusCode).json({ meta })
}
