import Vue from 'vue';
import 'vue-resource';
import _ from 'lodash';
import './floor-plan.css';
import template from './floor-plan.html';

const FloorPlan = Vue.extend({
	template,
	created(){
		let {brand, venue, house} = this.$route.params;
		this.currenthouse = house;
		this.brand = brand;
		this.venue = venue;

		this.fetch_seat_plan(brand, venue, house);
	},
	data(){
		return {
			plan: {}
		};
	},
	watch:{
		'$route': function(){
			let {brand, venue, house} = this.$route.params;
			this.fetch_seat_plan(brand, venue, house);
		}
	},
	computed: {
		screenWidth() {
			if (!this.plan || !this.plan.rows) {
				return 0;
			}

			return 32 * (_.maxBy(this.plan.rows, (row) => row.columns.length).columns.length + 1);
		}
	},
	methods:{
		fetch_seat_plan(brand, venue, house){
			let dist_url = `/api/cinema/${brand}/${venue}/${house}`;
			return this.$http.get(dist_url).then(({body: plan})=>{
				this.plan = plan;
			});
		}
	}
});

export default FloorPlan;
