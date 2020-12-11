const router = require('express').Router();

// Auth
const auth = require('../config/auth');

/**
 * POST
 * Photos data
 */
router.post('/', auth, (req, res) => {
    if (req.files === null) {
        return res.status(400).json({mgs: 'No files uploaded'});
    }

    const file = req.files.file;
    
    file.mv(`${__dirname}/../client/public/uploads/${file.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send();
        }
        res.json({fileName: file.name, filePath: `/uploads/${file.name}`});
    })
})

/**
 * GET
 * User Photos Data
 */
  

// Export
module.exports = router;