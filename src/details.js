import Vue from 'vue';
import vue_http from 'vue-resource';
import _ from 'lodash';
import historyManager from './manager/historyManager';
import './common/clear.css';
import './common/cinemalist.css';
import './components/house-info/house-info';
import './components/seat/seat';

const CINEMA_DETAILS_REGEX = /^\/([a-z]*)\/([a-z]*)/;

const extract_housename = (path) => {
	return _.last(path.split('/'));
};

Vue.use(vue_http);

new Vue({
	el: '#app',
	created(){
		let house = extract_housename(window.location.pathname);
		this.fetch_house_list();
		this.fetch_seat_plan('broadway', 'mk', house)
			.then(()=>{
				historyManager.replaceState({house}, null , house);
			});


		historyManager.on('history_change',(state)=>{
			let {house}  = state;
			this.fetch_seat_plan('broadway', 'mk', house);
		});
	},
	data: {
		header: '揀位王',
		plan: {},
		houselist: [],
		currenthouse: '',
	},
	computed: {
		cinemaName: function() {
			let results = CINEMA_DETAILS_REGEX.exec(location.pathname);
			if (results && results[1]) {
				return results[1];
			} else {
				return '';
			}
		},
		houses(){
			return _.map(this.houselist, (el)=>{
				//TODO: should have a more robust api for house list
				let house_id = el.split(' ')[2];
				return {
					id: house_id,
					name: `House ${house_id}`,
					url: `/broadway/mk/${house_id}`
				};
			});
		}
	},
	methods:{
		fetch_house_list(brand= 'broadway', venue = 'mk'){
			let dist_url = `/api/cinema/${brand}/${venue}`;
			this.$http.get(dist_url).then(({body: list})=>{
				this.houselist = list;
			});
		},
		on_floor_plan_change(brand= 'broadway', venue = 'mk', house = '1'){
			this.fetch_seat_plan(brand, venue, house).then(()=>{
				historyManager.pushState({house}, null, house);
			});
		},
		fetch_seat_plan(brand= 'broadway', venue = 'mk', house = '1'){
			let dist_url = `/api/cinema/${brand}/${venue}/${house}`;
			return this.$http.get(dist_url).then(({body: plan})=>{
				this.plan = plan;
				this.currenthouse = house;
			});
		}
	}
});
