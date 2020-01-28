const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Userdata = require('../config/user');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async(req, res) =>{
   try {
   		let data = await new Userdata(req).getAll();
   	
        res.render('dashboard', {
    		user: req.user,
    		data : data
  		})
    } catch(err) {
        return res.send({
            code:400,
            status: "error",
            message: err.message
        })
    }

});


module.exports = router;
