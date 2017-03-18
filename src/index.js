import Vue from 'vue';
import vue_http from 'vue-resource';
import './common/clear.css';
import './common/cinemalist.css';

import cinemaList from '../backend/data/cinema.json';

Vue.use(vue_http);

new Vue({
	el: '#app',
	data: {
		message: 'Hello world!',
		header: 'Cinema WTF',
		plan: {},
		cinemaList: cinemaList,
	}
});
