const express = require('express');
const route = express.Router();
const cinema_route  = require('./cinema/cinema');

route.use('/cinema', cinema_route);

route.all('/*',(req, res)=>{
	res.status(404).send('Page Not Found');
});

module.exports = route;
