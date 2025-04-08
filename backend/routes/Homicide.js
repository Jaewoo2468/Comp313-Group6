const express = require('express');
const router = express.Router();
const Homicide = require('../models/Homicide');

// GET /api/homicide?division=14
router.get('/', async (req, res) => {
  try {
    const division = req.query.division;
    let query = {};

    if (division) {
      query.DIVISION = division; // match schema field name
    }

    const homicides = await Homicide.find(query);
    res.json(homicides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
