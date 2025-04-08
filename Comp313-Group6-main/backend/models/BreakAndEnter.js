const mongoose = require('mongoose');

const breakAndEnterIncidentSchema = new mongoose.Schema({
  OBJECTID: Number,
  EVENT_UNIQUE_ID: String,
  REPORT_DATE: String,
  OCC_DATE: String,
  OCC_YEAR: Number,
  OCC_MONTH: String,
  OCC_DAY: Number,
  OCC_DOW: String,
  OCC_HOUR: Number,
  DIVISION: String,
  LOCATION_TYPE: String,
  PREMISES_TYPE: String,
  UCR_CODE: Number,
  UCR_EXT: Number,
  OFFENCE: String,
  MCI_CATEGORY: String,
  HOOD_158: Number,
  NEIGHBOURHOOD_158: String,
  HOOD_140: Number,
  NEIGHBOURHOOD_140: String,
  LONG_WGS84: Number,
  LAT_WGS84: Number,
  x: Number,
  y: Number,
});

const BreakAndEnterIncident = mongoose.model('BreakAndEnterIncident', breakAndEnterIncidentSchema, 'breakAndEnterIncidents');

module.exports = BreakAndEnterIncident;
