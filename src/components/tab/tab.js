//@flow
import Vue from 'vue';
import template from './tab.html';

Vue.component('tab', {
	template,
	props:{
		houses: {
			type: Array
		},
		currenthouse:{
			type: String
		}
	},
	methods:{
		onClick(id){
			this.$emit('floorplan-change', id);
		},
		isActive(id){
			return this.currenthouse === id;
		}
	}
});

