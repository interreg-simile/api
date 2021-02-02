/* eslint-disable semi,global-require */
'use strict';

require('dotenv').config();

const fs = require('fs').promises;
const path = require('path');
const pino = require('pino');
const mongoose = require('mongoose');

const { connectDb, disconnectDb } = require('../setup/db');
const roisModel = require('../modules/rois/rois.model');
const alertsModel = require('../modules/alerts/alerts.model');
const alertsData = require('./data/alerts.mock')
const eventsModel = require('../modules/events/events.model');
const eventsData = require('./data/events.mock')
const observationsModel = require('../modules/observations/observations.model');
const observationsData = require('./data/observations.mock')
const usersModel = require('../modules/users/users.model');
const linksModel = require('../modules/misc/models/links.model');
const linksData = require('./data/links.mock')
const authorityContactsModel = require('../modules/misc/models/authorityContacts.model');
const authorityContactsData = require('./data/authorityContacts.mock')
const createUsersData = require('./data/users.mock');

(async() => {
  const { LOG_LEVEL } = process.env;
  const logger = pino({ level: LOG_LEVEL });

  await connectDb(logger);
  const currentCollections = await mongoose.connection.db
    .listCollections()
    .toArray();

  const roisFiles = await fs.readdir(path.resolve(__dirname, 'data/rois'));
  const roisData = roisFiles.map(file => require(`./data/rois/${file}`));
  await seedCollection(logger, currentCollections, roisModel, roisData)

  await seedCollection(logger, currentCollections, usersModel, await createUsersData())
  await seedCollection(logger, currentCollections, alertsModel, alertsData)
  await seedCollection(logger, currentCollections, eventsModel, eventsData)
  await seedCollection(logger, currentCollections, observationsModel, observationsData)
  await seedCollection(logger, currentCollections, linksModel, linksData)
  await seedCollection(logger, currentCollections, authorityContactsModel, authorityContactsData)

  await disconnectDb(logger);
})()

async function seedCollection(logger, collections, collectionModel, data) {
  const { collectionName, model } = collectionModel
  logger.debug(`Seeding collection ${collectionName}`)

  try {
    if (collections.some(collection => collection.name === collectionName)) {
      logger.debug(`Collection ${collectionName} found in db. Dropping...`)
      await model.collection.drop()
    }

    await model.create(data);
    logger.info(`Seeded collection ${collectionName}`);
  } catch (error) {
    logger.error({ error }, `Error seeding collection ${collectionName}`);
  }
}
