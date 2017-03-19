import Vue from 'vue';
import './floor-plan.css';

// <seat v-for='col in row.columns'></seat>
Vue.component('floor-plan', {
  template: `
              <div class="floor-plan">
                <div class="floor-plan__color-description">
                    <span class="floor-plan__color-description-text"> 最好 </span>
                    <seat :seat-param="{seat: n, score:n}" v-for="n in [5,4,3,2,1]"></seat>
                    <span class="floor-plan__color-description-text"> 最差 </span>
                </div>
                <div class="screen screen--top" v-if="plan.screenPos === 'top'"><span>Screen</span></div>
                <template v-for="row in plan.rows">
                  <span class="row-name">{{row.name}}</span>
                  <div class="floor-plan__row">
                    <div class="floor-plan__seat-row">
                      <span v-for="col in row.columns">
                        <seat :seat-param="col"></seat>
                      </span>
                    </div>
                  </div>
                </template>
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
