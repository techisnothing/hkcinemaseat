/* global __dirname*/
const express = require('express');
const route = express.Router();
const fs = require('fs');
const _ = require('lodash');
const Promise = require('bluebird');
const path = require('path');
const data_path = path.resolve(__dirname, '../../', 'data');

Promise.promisifyAll(fs);


let cache = {};
//private read file helper
const read_data_path = (path) => {
	let promise;
	if(_.get(cache, path, null) === null){
		promise =
		fs.readdirAsync(path)
			.then((list)=>{
				cache = _.map(list, _.lowerCase);
				return cache;
			})
			.catch((e)=>{
				throw e;
			});
	}else{
		promise = new Promise((resolve)=> resolve(cache[path]));
	}
	return promise;
};



const brandname_dic = {
	'broadway': 'bwx',
};
const venue_dic = {
	'mk': 'mkx',
};
const toFileName = (brandname, venue, house)=>{
	return [
		_.get(brandname_dic, brandname),
		_.get(venue_dic, venue),
		house.toString(),
	].join('_') + '.json';
};

/**
 * @api {get} /api/cinema Request avaliable cinema brand
 * @apiName GetCinemaBrand
 * @apiGroup Cinema
 *
 * @apiSuccess {Array} list of avaliable cinema brand.
 */
route.get('/', (req, res)=>{
	read_data_path(data_path).then((list)=>{
		res.send(list);
	});
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
	brandname = _.lowerCase(brandname);
	read_data_path(path.join(data_path, brandname))
		.then((list)=>{
			res.send(list);
		})
		.catch(()=>{
			res.status(404).end();
		});
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
	//TODO: sanitization
	let {brandname, venue} = req.params;
	[brandname, venue] = _.map([brandname, venue], _.lowerCase);
	read_data_path(path.join(data_path, brandname, venue))
		.then((list)=>{
			res.send(list);
		})
		.catch(()=>{
			res.status(404).end();
		});
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
	[brandname, venue] = _.map([brandname, venue], _.lowerCase);
	let filename = toFileName(brandname, venue, house);

	fs.readFileAsync(path.join(data_path, brandname, venue, filename))
		.then((data)=>{
			res.json(JSON.parse(data));
		})
		.catch(()=>{
			res.status(404).end();
		});
});




module.exports = route;
