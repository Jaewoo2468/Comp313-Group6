const mongoose = require('mongoose');

const pedestrianKSISchema = new mongoose.Schema({
  OBJECTID: Number,
  DATE: String,
  STREET1: String,
  STREET2: String,
  LATITUDE: Number,
  LONGITUDE: Number,
  VISIBILITY: String,
  LIGHT: String,
  IMPACTYPE: String,
  PEDESTRIAN: String,
  INJURY: String,
  DIVISION: String,
  NEIGHBOURHOOD_158: String,
  HOOD_158: Number,
  x: Number,
  y: Number,
});

const PedestrianKSI = mongoose.model('PedestrianKSI', pedestrianKSISchema, 'pedestrianKSI');

module.exports = PedestrianKSI;
