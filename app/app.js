import Vue from 'nativescript-vue'
import Login from './components/Login.vue'
import { registerElement } from "nativescript-vue";
registerElement('DropDown', () => require('nativescript-drop-down').DropDown);

// Si usas Vuex para MVVM
import store from './store/index.js'

new Vue({
  store, // <- Descomenta si usas Vuex
  render: h => h('frame', [h(Login)])  // La idea es inicializar con un <Frame> y dentro tu pantalla Login
  
}).$start()
