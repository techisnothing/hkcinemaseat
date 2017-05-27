import Vue from 'vue';
import _ from 'lodash';
import './floor-plan.css';
import template from './floor-plan.html';

Vue.component('floor-plan', {
	template,
	props: {
		plan: {
			type: Object,
			required: true
		}
	},
	computed: {
		screenWidth() {
			if (!this.plan || !this.plan.rows) {
				return 0;
			}

			return 32 * (_.maxBy(this.plan.rows, (row) => row.columns.length).columns.length + 1);
		}
	}
});
