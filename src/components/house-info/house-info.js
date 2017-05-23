import Vue from 'vue';
import 'vue-resource';
import _ from 'lodash';
import '../floor-plan/floor-plan.js';
import '../tab/tab.js';
import template from './house-info.html';
import './house-info.css';

const HouseInfo = Vue.extend({
	template,
	created(){
		let {brand, venue, house} = this.$route.params;
		this.currenthouse = house;
		this.brand = brand;
		this.venue = venue;

		this.fetch_house_list(brand, venue);
		this.fetch_seat_plan(brand, venue, house);
	},
	data(){
		return {
			plan: {},
			cinemainfo: {},
		};
	},
	watch:{
		'$route': function(){
			let {brand, venue, house} = this.$route.params;
			this.fetch_house_list(brand, venue);
			this.fetch_seat_plan(brand, venue, house);
		}
	},
	computed: {
		houses(){
			return _.map(_.get(this.cinemainfo,'house'), (el)=>{
				//TODO: should have a more robust api for house list
				let house_id = el;
				return {
					id: house_id,
					name: `House ${house_id}`,
					url: `/${this.brand}/${this.venue}/${house_id}`
				};
			});
		},
		seatplan(){
			return this.plan || {};
		}
	},
	methods:{
		fetch_house_list(brand, venue){
			let dist_url = `/api/cinema/${brand}/${venue}`;
			this.$http.get(dist_url).then(({body: info})=>{
				this.cinemainfo = info;
			});
		},
		onHouseChange(house_id){

			this.$router.push({name: 'house_detail', params:{brand: this.brand, venue: this.venue, house: house_id}});
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

export default HouseInfo;
