const mongoose = require('mongoose');

const shootingIncidentSchema = new mongoose.Schema({
  OBJECTID: Number,
  EVENT_UNIQUE_ID: String,
  OCC_DATE: String,
  OCC_YEAR: Number,
  OCC_MONTH: String,
  OCC_DOW: String,
  OCC_DOY: Number,
  OCC_DAY: Number,
  OCC_HOUR: Number,
  OCC_TIME_RANGE: String,
  DIVISION: String,
  DEATH: String,
  INJURIES: String,
  HOOD_158: String,
  NEIGHBOURHOOD_158: String,
  HOOD_140: String,
  NEIGHBOURHOOD_140: String,
  LONG_WGS84: Number,
  LAT_WGS84: Number,
  x: Number,  // Longitude
  y: Number,  // Latitude
});

module.exports = mongoose.model('ShootingIncident', shootingIncidentSchema, 'ShootingIncident');
