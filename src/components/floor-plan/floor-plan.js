import Vue from 'vue';
import './floor-plan.css';
import template from './floor-plan.html';

// <seat v-for='col in row.columns'></seat>
Vue.component('floor-plan', {
	template,
		props: {
		plan: {
			type: Object,
			required: true
		}
	}
});
