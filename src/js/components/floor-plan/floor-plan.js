import Vue from 'vue';

// <seat v-for="col in row.columns" :seat="col.seat" :score="col.score"></seat>
Vue.component('floor-plan', {
  template: `
              <div class="floor-plan">
                <div class="screen" v-if="plan.screenPos === 'top'"><span>Screen</span></div>
                <div class="floor-plan__row" v-for="row in plan.rows">
                  <span class="row-name">{{row.name}}</span>
                  <span v-for="col in row.columns">
                    <seat :seat="col"></seat>
                  </span>
                </div>
                <div class="screen" v-if="plan.screenPos === 'bottom'"><span>Screen</span></div>
              </div>
            `,
  props: {
    plan: {
      type: Object,
      required: true
    }
  }
});
