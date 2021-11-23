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
    save: { method: 'PUT' },
    delete: { method: 'DELETE' }
}
let reservationRes = Vue.resource(`${uri}/reservations`, {}, reservationMethods)

let timesMethods = {
    get: { method: 'GET' }
}
let timesRes = Vue.resource(`${uri}/times`, {}, timesMethods)

let tablesMethods = {
    get: { method: 'GET'}
}
let tablesRes = Vue.resource(`${uri}/tables/available`, {}, tablesMethods)

let trafficMethods = {
    get: { method: 'GET' }
}

let trafficRes = Vue.resource(`${uri}/traffic`, {}, trafficMethods)

let userMethods = {
    get: { method: 'GET' },
    save: { method: 'PUT' },
    delete: { method: 'DELETE' }
}
let userRes = Vue.resource(`${uri}/user`, {}, userMethods)

Vue.use({
    install: () => {
        Object.defineProperty(Vue.prototype, '$reservation', {
            get () { return reservationRes }
        }),
        Object.defineProperty(Vue.prototype, '$times', {
            get () { return timesRes }
        }),
        Object.defineProperty(Vue.prototype, '$tables', {
            get () {return tablesRes}
        }),
        Object.defineProperty(Vue.prototype, '$traffic', {
            get () { return trafficRes }
        }),
        Object.defineProperty(Vue.prototype, '$user', {
            get () { return userRes }
        })

    }
})