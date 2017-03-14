import Vue from 'vue';
import template from './seat.html';

Vue.component('seat', {
    template,
    props: {
        seat: {
            type: Object,
            required: true
        }
    }
});