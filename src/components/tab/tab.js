//@flow
import Vue from 'vue';
import _ from 'lodash';
import template from './tab.html';


function transfrom_list(house){
	return _.map(house, (el)=>{
		//TODO: should have a more robust api for house list
		let house_id = el.split(' ')[2];
		return {
			id: house_id,
			name: `House ${house_id}`,
			url: `/broadway/mk/${house_id}`
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
			active: null,
		};
	},
	methods:{
		onClick(id){
			this.active = id;
			this.$emit('floorplan-change', id);
		},
		isActive(id){
			return this.active === id;
		}
	},
	watch: {
		houselist(){
			this.active = _.get(this.houses, '[0].id');
		}
	}
});

