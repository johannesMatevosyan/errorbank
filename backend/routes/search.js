const express = require('express');
const searchController = require('../controllers/search');
const router = express.Router();

router.post('', searchController.searchKey);

//router.post('/tag-name', searchController.searchByTag);

module.exports = router;
