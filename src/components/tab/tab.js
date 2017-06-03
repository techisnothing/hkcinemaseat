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
		isActive(id){
			return this.currenthouse === id;
		}
	}
});

