import Vue from "vue";
import VueResource from "vue-resource";
// import config from './config';
// import firebase from 'firebase/app';


Vue.use(VueResource);
Vue.prototype.$isDevEnv = process.env.NODE_ENV === "development";
let uri = (
    process.env.NODE_ENV === "development" ?
    "http://localhost:5001/webapp-f22de/us-central1/api" :
    "https://us-central1-webapp-f22de.cloudfunctions.net/api"
);

let reservationMethods = {
    get: { method: 'GET' },
    save: { method: 'PUT' }
}
let reservationRes = Vue.resource(`${uri}/reservations`, {}, reservationMethods)

let timesMethods = {
    get: { method: 'GET' }
}
let timesRes = Vue.resource(`${uri}/reservations`, {}, timesMethods)

Vue.use({
    install: () => {
        Object.defineProperty(Vue.prototype, '$reservation', {
            get () { return reservationRes }
        }),

        Object.defineProperty(Vue.prototype, '$times', {
            get () { return timesRes }
        })
    }
})