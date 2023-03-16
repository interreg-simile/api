/* eslint-disable */
'use strict';

require('dotenv').config();

const fs = require('fs').promises;
const path = require('path');
const pino = require('pino');
const mongoose = require('mongoose');

const { connectDb, disconnectDb } = require('../setup/db');
const { model, collectionName } = require('../modules/rois/rois.model');

(async() => {
  const { LOG_LEVEL } = process.env;
  const logger = pino({ level: LOG_LEVEL });

  try {
    await connectDb(logger);

    const roisCollection = await mongoose.connection.db
      .listCollections({ name: collectionName })
      .toArray();

    if (roisCollection.length > 0) {
      await model.collection.drop();
      logger.info('Current rois collection dropped');
    }

    const dataFiles = await fs.readdir(path.resolve(__dirname, 'data/rois'));
    const rois = dataFiles.map(file => require(`./data/rois/${file}`));

    await model.create(rois);
    logger.info('Rois data seeded');

    await disconnectDb(logger);
  } catch (error) {
    logger.error({ err: error }, 'Errors seeding rois data');
  }
})()
