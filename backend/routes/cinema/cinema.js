/* global __dirname*/
const express = require('express');
const route = express.Router();
const fs = require('fs');
const _ = require('lodash');
const Promise = require('bluebird');
const path = require('path');
const data_path = path.resolve(__dirname, '../../', 'data');
const cinema_data = require(path.resolve(data_path, 'cinema.json'));

Promise.promisifyAll(fs);


/**
 * @api {get} /api/cinema Request avaliable cinema brand
 * @apiName GetCinemaBrand
 * @apiGroup Cinema
 *
 * @apiSuccess {Array} list of avaliable cinema brand.
 */
route.get('/', (req, res)=>{
	res.json(cinema_data);
});


/**
 * @api {get} /api/cinema/:brandname Request avaliable cinema brand's venue
 * @apiName GetCinemaBrandVenue
 * @apiGroup Cinema
 *
 * @apiSuccess {Array} list of avaliable Venue under specific cinema Brand
 * @apiError NotFound {String} Cinema Brand Not Found
 */
route.get('/:brandname', (req,res)=>{
	//TODO: sanitization
	let {brandname} = req.params;
	brandname = _.toLower(brandname);
	let brand = _.find(cinema_data, {id: brandname});
	if(brand)
		res.json(brand);
	else
		res.status(404).end('Not Found');
});

/**
 * @api {get} /api/cinema/:brandname/:venue Request avaliable cinema brand's venue's house
 * @apiName GetCinemaBrandVenue
 * @apiGroup Cinema
 *
 * @apiSuccess {Array} list of avaliable houses under specific cinema Brand venue
 * @apiError NotFound {String}
 */
route.get('/:brandname/:venue',(req, res) => {
	// //TODO: sanitization
	let {brandname, venue} = req.params;
	[brandname, venue] = _.map([brandname, venue], _.toLower);

	let brand = _.find(cinema_data, {id: brandname});
	let cinema = _.find(_.get(brand, 'cinemaList'), {id: venue});

	if(cinema){
		res.json(cinema);
	}else{
		res.status(404).end('Not Found');
	}

});


/**
 * @api {get} /api/cinema/:brandname/:venue/:house Request avaliable house data
 * @apiName GetCinemaBrandVenue
 * @apiGroup Cinema
 *
 * @apiSuccess {Array} list of avaliable house data
 * @apiError NotFound {String}
 */
route.get('/:brandname/:venue/:house',(req, res) => {
	//TODO: sanitization
	let {brandname, venue, house} = req.params;
	[brandname, venue, house] = _.map([brandname, venue, house], _.toLower);

	let brand = _.find(cinema_data, {id: brandname});
	let cinema = _.find(_.get(brand, 'cinemaList'), {id: venue});
	let filename = [
		_.get(brand, 'alias'),
		_.get(cinema, 'alias'),
		house.toString(),
	].join('_') + '.json';

	fs.readFileAsync(path.join(data_path, brandname, venue, filename))
		.then((data)=>{
			res.json(JSON.parse(data));
		})
		.catch(()=>{
			res.status(404).end('Not Found');
		});
});




module.exports = route;
