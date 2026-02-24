const express = require('express');
const {register, login, logout} = require('../controllers/auth.controller')
const router = express.Router();
const protect = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login)
router.get('/protected',protect, (req,res)=>{
    return res.status(200).json({message:"You can access"})
} );

module.exports = router;