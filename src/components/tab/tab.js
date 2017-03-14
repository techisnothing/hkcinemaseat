import Vue from 'vue';
import template from './tab.html';


Vue.component('tab', {
	template,
	data() {
		return {
			houselist:[
				{
					name: 'House 1',
					url: '/1',
					isActive: true,
				},
				{
					name: 'House 2',
					url: '/2',
				},
				{
					name: 'House 3',
					url: '/3',
				}
			],
		};
	}
});


