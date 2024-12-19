const express = require('express');
const { createRequest, searchDonors } = require('../controllers/requestController');
const router = express.Router();

router.post('/', createRequest);
router.get('/donors', searchDonors);

module.exports = router;