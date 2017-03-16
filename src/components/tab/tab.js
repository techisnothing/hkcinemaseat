import Vue from 'vue';
import _ from 'lodash';
import template from './tab.html';


function transfrom_list(house){
	return _.map(house, (el)=>{
		//TODO: should have a more robust api for house list
		let num = el.split(' ')[2];
		return {
			id: parseInt(num),
			name: `House ${num}`,
			url: `/broadway/mk/${num}`
		};
	});
}

Vue.component('tab', {
	template,
	props:{
		houselist: {
			type: Array
		}
	},
	computed:{
		houses(){
			return transfrom_list(this.houselist);
		}
	},
	data(){
		return {
			active: 1,
		};
	},
	methods:{
		onClick(id){
			this.active = id;
		},
		isActive(id){
			return this.active === id;
		}
	}
});

