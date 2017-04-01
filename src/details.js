import Vue from 'vue';
import vue_http from 'vue-resource';
import _ from 'lodash';
import historyManager from './manager/historyManager';
import './common/clear.css';
import './common/cinemalist.css';
import './components/house-info/house-info';
import './components/seat/seat';

Vue.use(vue_http);

new Vue({
	el: '#app',
	created(){
		let [ , brand, venue, house] = window.location.pathname.split('/');
		this.brand = brand;
		this.venue = venue;
		this.fetch_house_list(brand, venue);

		this.fetch_seat_plan(brand, venue, house)
			.then(()=>{
				historyManager.replaceState({house}, null , house);
			});
		historyManager.on('history_change',(state)=>{
			let {house}  = state;
			this.fetch_seat_plan(this.brand, this.venue, house);
		});
	},
	data: {
		header: '揀位王',
		plan: {},
		cinemainfo: {},
		houselist: [],
		currenthouse: '',
	},
	computed: {
		houses(){
			return _.map(this.cinemainfo.house, (el)=>{
				//TODO: should have a more robust api for house list
				let house_id = el;
				return {
					id: house_id,
					name: `House ${house_id}`,
					url: `/${this.brand}/${this.venue}/${_.toLower(house_id)}`
				};
			});
		}
	},
	methods:{
		fetch_house_list(brand, venue){
			let dist_url = `/api/cinema/${brand}/${venue}`;
			this.$http.get(dist_url).then(({body: info})=>{
				this.cinemainfo = info;
			});
		},
		on_floor_plan_change(house){
			this.fetch_seat_plan(this.brand, this.venue, house).then(()=>{
				historyManager.pushState({house}, null, house);
			});
		},
		fetch_seat_plan(brand, venue, house){
			let dist_url = `/api/cinema/${brand}/${venue}/${house}`;
			return this.$http.get(dist_url).then(({body: plan})=>{
				this.plan = plan;
				this.currenthouse = house;
			});
		}
	}
});
