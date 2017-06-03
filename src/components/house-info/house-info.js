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

		this.fetch_house_list(brand, venue)
			.then(()=>{
				this.$router.replace({name: 'house_plan', params:{brand: this.brand, venue: this.venue, house: this.houses[0].id}});
				this.currenthouse = _.find(this.houses, {id: this.currenthouse}) ? this.currenthouse : this.houses[0].id;
			});
	},
	data(){
		return {
			plan: {},
			cinemainfo: {},
		};
	},
	watch:{
		'$route': function(){
			let {house} = this.$route.params;
			this.currenthouse = house;
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
		}
	},
	methods:{
		fetch_house_list(brand, venue){
			let dist_url = `/api/cinema/${brand}/${venue}`;
			return this.$http.get(dist_url).then(({body: info})=>{
				this.cinemainfo = info;
			});
		}
	}
});

export default HouseInfo;
