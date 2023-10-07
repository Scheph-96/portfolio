const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('portfolio-index');
});

router.get('/admin-dashboard', (req, res) => {
    res.render('dashboard-index');
});


module.exports = router;