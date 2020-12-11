const router = require('express').Router();
const clothesUrl = 'https://therapy-box.co.uk/hackathon/clothing-api.php?username=swapnil';
const axios = require('axios').default;

// Auth
const auth = require('../config/auth');

/**
 * GET
 * Clothes data
 */
router.get('/', auth, async (req, res) => {
  // get clothes data
  try {
    const response = await axios.get(clothesUrl);
    const json = response.data.payload;
    res.send(json);
  } catch (err) {
    console.log(err.message);
  }
})

// Export
module.exports = router;