import Vue from 'vue';
import vue_http from 'vue-resource';
import './common/clear.css';
import './common/cinemalist.css';
import './components/house-info/house-info';
import './components/seat/seat';

import settingPlan from '../backend/data/broadway/mk/bwx_mkx_1.json';
import cinemaList from '../backend/data/cinema.json';

Vue.use(vue_http);

new Vue({
	el: '#app',
	created(){
		this.fetch_house_list();
	},
	data: {
		message: 'Hello world!',
		header: 'Cinema WTF',
		plan: settingPlan,
		cinemaList: cinemaList,
		houselist: [],
	},
	methods:{
		fetch_house_list(brand= 'broadway', venue = 'mk'){
			let dist_url = `/api/cinema/${brand}/${venue}`;
			this.$http.get(dist_url).then(({body: list})=>{
				this.houselist = list;
			});
		}
	}
});
