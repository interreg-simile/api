'use strict'

const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')
const Handlebars = require('handlebars')

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env

const emailsFolderPath = path.resolve('./emails')

let mailTransporter
let confirmationEmailTemplates
let resetPasswordTemplates

async function initTransporter(logger) {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  })

  return new Promise((resolve, reject) => {
    transporter.verify(error => {
      if (error) {
        logger.error(error, '[setup] Error loading mail transporter')
        reject(error)
      } else {
        mailTransporter = transporter
        logger.info('[setup] Mail transporter loaded')
        resolve()
      }
    })
  })
}

function loadEmailTemplates() {
  const confirmationHtml = fs.readFileSync(path.resolve(emailsFolderPath, 'confirmation.html'), { encoding: 'utf8' })
  const confirmationText = fs.readFileSync(path.resolve(emailsFolderPath, 'confirmation.txt'), { encoding: 'utf8' })

  const resetPwsHtml = fs.readFileSync(path.resolve(emailsFolderPath, 'reset-pws.html'), { encoding: 'utf8' })
  const resetPwsText = fs.readFileSync(path.resolve(emailsFolderPath, 'reset-pws.txt'), { encoding: 'utf8' })

  confirmationEmailTemplates = {
    html: Handlebars.compile(confirmationHtml),
    text: Handlebars.compile(confirmationText),
  }

  resetPasswordTemplates = {
    html: Handlebars.compile(resetPwsHtml),
    text: Handlebars.compile(resetPwsText),
  }
}

module.exports = {
  initTransporter,
  mailTransporter,
  loadEmailTemplates,
  confirmationEmailTemplates,
  resetPasswordTemplates,
}
