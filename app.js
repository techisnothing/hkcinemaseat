/*global process, __dirname*/
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const webpack_compile = webpack(webpackConfig);

// route part
const api_route = require('./backend/routes/api');

const server_port = process.env.PORT || 8080;
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const app = express();

app.use(webpackDevMiddleware(webpack_compile,{
	publicPath: '/',
	noInfo: true,
}));
app.use(webpackHot(webpack_compile, {
	noInfo: true,
}));


app.use(compression());
// app.use('/js', express.static('dist/js'));
// app.use('/css', express.static('dist/css'));
app.use('/img', express.static('public/img'));

app.use(bodyParser.json({limit: 1024 * 1024 * 20})); // for parsing application/json 20MB
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.use(bodyParser.json());

app.use('/api', api_route);

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'backend/index.html'));
});

app.get('/:brandname/:venue/:house', function (req, res) {
	//TODO: Handle unknown brandname / venue / house
	res.sendFile(path.join(__dirname, 'backend/details.html'));
});

app.get('/robots.txt', function (req, res) {
	res.sendFile(path.join(__dirname, 'backend/robots.txt'));
});

app.get('/sitemap.xml', function (req, res) {
	res.sendFile(path.join(__dirname, 'backend/sitemap.xml'));
});

app.listen(server_port, server_ip_address, function () {
	console.log( 'Listening on ' + server_ip_address + ', server_port ' + server_port );
});
