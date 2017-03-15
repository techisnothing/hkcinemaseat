import Vue from 'vue';
import template from './seat.html';
import './seat.css';

Vue.component('seat', {
    template,
    props: {
        seatParam: {
            type: Object,
            required: true
        }
    }
});
