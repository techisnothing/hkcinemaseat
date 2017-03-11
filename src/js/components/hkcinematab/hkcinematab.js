import Vue from 'vue';
import template from './hkcinematab.html';

Vue.component('hkcinematab', {
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
					isActive: false,
				},
				{
					name: 'House 3',
					url: '/3',
					isActive: false,
				}
			],
		};
	}
});

// export default hkcinematab;
