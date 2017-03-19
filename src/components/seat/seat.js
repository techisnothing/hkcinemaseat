import Vue from 'vue';
import template from './seat.html';
import './seat.css';

const SEAT_BASE_CLASS = "seat--";
const SEAT_DISABLED_TEXT = "disabled";

Vue.component('seat', {
    template,
    props: {
        seatParam: {
            type: Object,
            required: true
        }
    },
    computed: {
        seatClass: function() {
            if (this.seatParam.seat) {
                if (this.seatParam.seat === SEAT_DISABLED_TEXT)
                    return SEAT_BASE_CLASS + SEAT_DISABLED_TEXT;
                else
                    return SEAT_BASE_CLASS + (this.seatParam.score || 3);       // Default score is 3
            } else {
                return SEAT_BASE_CLASS + 'empty';
            }
        }
    }
});
