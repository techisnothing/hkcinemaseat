import Vue from 'vue';
import 'vue-resource';
import '../floor-plan/floor-plan.js';
import '../tab/tab.js';
import template from './house-info.html';

Vue.component('house-info',{
	template,

	props:{
		plan: {
			type: Object
		},
		houselist:{
			type: Array,
		}
	},
	methods:{
		onHouseChange(house_id){
			this.$emit('floorplan-change', 'broadway', 'mk', house_id);
		},
	}
});
