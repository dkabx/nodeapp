var loginCtrl = require('../controller/logincontroller');
var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
  loginCtrl.functionA(req,res);

});


module.exports = router;
