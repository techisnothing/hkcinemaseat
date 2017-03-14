import Vue from 'vue';
import './floor-plan.css';

// <seat v-for='col in row.columns'></seat>
Vue.component('floor-plan', {
  template: `
              <div class='floor-plan'>
                <div class='screen' v-if='plan.screenPos === 'top''></div>
                <div class='row' v-for='row in plan.rows'>
                  <span class='row-name'>{{row.name}}</span>
                </div>
                <div class='screen' v-if='plan.screenPos === 'bottom''></div>
              </div>
            `,
  props: {
    plan: {
      type: Object,
      required: true
    }
  }
});
