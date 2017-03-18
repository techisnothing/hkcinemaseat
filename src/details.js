import Vue from 'vue';
import vue_http from 'vue-resource';
import './common/clear.css';
import './common/cinemalist.css';
import './components/house-info/house-info';
import './components/seat/seat';

import cinemaList from '../backend/data/cinema.json';

const CINEMA_DETAILS_REGEX = /^\/([a-z]*)\/([a-z]*)/;

Vue.use(vue_http);

new Vue({
	el: '#app',
	created(){
		this.fetch_house_list();
		this.fetch_seat_plan();
	},
	data: {
		message: 'Hello world!',
		header: 'Cinema WTF',
		plan: {},
		houselist: [],
	},
	computed: {
		cinemaName: function() {
			let results = CINEMA_DETAILS_REGEX.exec(location.pathname);
			if (results && results[1]) {
				return results[1];
			} else {
				return '';
			}
		}
	},
	methods:{
		fetch_house_list(brand= 'broadway', venue = 'mk'){
			let dist_url = `/api/cinema/${brand}/${venue}`;
			this.$http.get(dist_url).then(({body: list})=>{
				this.houselist = list;
			});
		},
		fetch_seat_plan(brand= 'broadway', venue = 'mk', house = '1'){

			let dist_url = `/api/cinema/${brand}/${venue}/${house}`;
			this.$http.get(dist_url).then(({body: plan})=>{
				this.plan = plan;
			});
		}
	}
});
