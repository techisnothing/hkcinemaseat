import Vue from 'vue';
import vue_http from 'vue-resource';
import _ from 'lodash';
import VueRouter from 'vue-router';
// import historyManager from './manager/historyManager';
import './common/clear.css';
import './common/cinemalist.css';
import HouseInfo from './components/house-info/house-info';
import './components/seat/seat';

Vue.use(vue_http);
Vue.use(VueRouter);

const routes = [
	{
		path: '/:brand/:venue/:house',
		name: 'house_detail',
		component: HouseInfo
	},
];

const router = new VueRouter({
	mode: 'history',
	base: '/',
	routes,
});

new Vue({
	router,
	created(){
		let [ , brand, venue, house] = window.location.pathname.split('/');
		this.$router.replace({name: 'house_detail' ,params: {brand, venue, house}});

	},
	data: {
		header: '揀位王',
	}
}).$mount('#app');
