import Vue from 'vue';
import 'vue-resource';
import '../floor-plan/floor-plan.js';
import '../tab/tab.js';
import template from './house-info.html';
import './house-info.css';

Vue.component('house-info',{
	template,

	props:{
		plan: {
			type: Object
		},
		houses:{
			type: Array,
		},
		currenthouse:{
			type: String,
		}
	},
	methods:{
		onHouseChange(house_id){
			this.$emit('floorplan-change', house_id);
		},
	}
});
