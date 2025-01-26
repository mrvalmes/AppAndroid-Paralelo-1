import Vue from 'nativescript-vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,               // Almacenar info de usuario logueado
        smartphones: [],          // Lista de smartphones recuperados
        selectedSmartphone: null, // Smartphone seleccionado
        // Añade más estados según tu necesidad
    },
    mutations: {
        SET_USER(state, userData) {
            state.user = userData;
        },
        SET_SMARTPHONES(state, list) {
            state.smartphones = list;
        },
        SET_SELECTED_SMARTPHONE(state, smartphone) {
            state.selectedSmartphone = smartphone;
        },
    },
    actions: {
        // Aquí irán las acciones asíncronas, por ejemplo, login, fetch de smartphones, etc.
    }
});
