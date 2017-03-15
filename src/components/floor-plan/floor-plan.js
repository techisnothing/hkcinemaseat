import Vue from 'vue';
import './floor-plan.css';

// <seat v-for='col in row.columns'></seat>
Vue.component('floor-plan', {
  template: `
              <div class="floor-plan">
                <div class="screen screen--top" v-if="plan.screenPos === 'top'"><span>Screen</span></div>
                <div class="floor-plan__row" v-for="row in plan.rows">
                  <span class="row-name">{{row.name}}</span>
                  <div class="floor-plan__seat-row">
                    <span v-for="col in row.columns">
                      <seat :seat-param="col"></seat>
                    </span>
                  </div>
                </div>
                <div class="screen screen--bottom" v-if="plan.screenPos === 'bottom'"><span>Screen</span></div>
              </div>
            `,
  props: {
    plan: {
      type: Object,
      required: true
    }
  }
});
