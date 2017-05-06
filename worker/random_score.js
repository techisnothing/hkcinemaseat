/* global __dirname, process*/
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');

Promise.promisifyAll(fs);


const cinema_dirs = ['fanling'];
const data_path = path.resolve(__dirname, '../', 'backend/data','mcl');


const filename_in_dir = (dirname)=>{
	return fs.readdirAsync(dirname)
		.then((list)=>{
			return _.map(list, (file)=> path.join(dirname, file));
		})
		.catch(()=>{
			console.log(`Unknown FileDir : ${dirname}`);
			return [];
		});
};

const displacement = (x1, y1, x2, y2) => {
	return Math.sqrt((x2-x1)*(x2-x1)*1.6 + (y2-y1)*(y2-y1) * 0.5 );
};

// sear Mean Square Error
const seat_mse = (screenpos, max_row, max_col, row, col) => {
	let offset = screenpos === 'bottom' ? - max_row * 0.16 : max_row * 0.16;
	//default range 0 to 1
	let mid_row = max_row /2 + offset;
	let mid_col = max_col /2;
	let sqrt_diff = displacement(row,col, mid_row, mid_col);
	let max_diff = Math.sqrt((mid_col * mid_col) + (mid_row) * (mid_row)) || 1;

	return sqrt_diff / max_diff;
};

/**
 * Here we do the transform of the mean square error to our score
 */
const transforn_score_domain = (mse) =>{
	if(mse < 0.2){
		return 5;
	}else if(mse < 0.4){
		return 4;
	}else if(mse < 0.5){
		return 3;
	}else if(mse < 0.65){
		return 2;
	}else{
		return 1;
	}
};


const add_cinema_score_data = (cinema_data)=>{
	let max_row = cinema_data.rows.length;
	let max_col = _.max(_.map( _.range(max_row), (num)=> _.get(cinema_data, `rows.${num}.columns.length`)) );

	let screenpos = _.get(cinema_data, 'screenPos');
	let unique_seat_mse = _.curry(seat_mse)(screenpos, max_row, max_col);

	let new_cinema_data = _.clone(cinema_data);
	new_cinema_data.rows = _.map(cinema_data.rows, (row, row_id)=>{
		if(row.columns.length === 0 ){
			return row;
		}else{
			let new_row = _.clone(row);
			new_row.columns = _.map(row.columns, (col, col_id)=>{
				if(col.seat === null || col.seat === 'disabled'){
					return col;
				}else{
					col.score = transforn_score_domain(unique_seat_mse(row_id, col_id));
					return col;
				}
			});
			return new_row;
		}
	});
	return new_cinema_data;
};


Promise.map(cinema_dirs, (dirs)=>{
	let dest_dir = path.join(data_path, dirs);
	return filename_in_dir(dest_dir);
})
.map((list)=>{
	return Promise.map(list, (file, idx)=>{
		return Promise.join(list[idx], fs.readFileAsync(file, 'utf8'),(filename, json_file)=>{
			return {filename, json_file};
		});
	});
})
.then(_.flatten)
.filter(({json_file})=>{
	return json_file.length !== 0;
})
.filter(({filename})=>{
	return path.extname(filename) === '.json';
})
.map(({filename, json_file})=>{
	let cinema_data;
	try{
		cinema_data = JSON.parse(json_file);

	}catch(e){
		console.log(filename);
		throw new Error(filename + 'pares error');
	}
	return {filename, cinema_data};
})
.map(({filename, cinema_data})=>{
	return {filename, data: add_cinema_score_data(cinema_data)};
})
.each(({filename, data})=>{
	return fs.writeFileAsync(filename, JSON.stringify(data, null, 4), 'utf8');
})
.catch((err)=>{
	console.log(err);
})
.finally(()=>{
	process.exit();
});




