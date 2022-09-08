import { createStore } from "vuex";

export default createStore({
  state: {
    notes: [],
    foundNote: null,
    noteHistory: [],
    forwardHistory: [],
  },
  getters: {
    GET_NOTES: (state) => {
      return state.notes;
    },
    GET_FOUNDNOTE: (state) => {
      return state.foundNote;
    },
    GET_HISTORY: (state) => {
      return state.noteHistory;
    },
    GET_FORWARDHISTORY: (state) => {
      return state.forwardHistory;
    },
  },
  mutations: {
    SET_NOTES (state, payload) {
      state.notes = payload
    },
    ADD_NOTE (state, payload) {
      state.notes = [...state.notes, payload]
    },
    SET_FOUNDNOTE (state, payload) {
      state.foundNote = payload
    },
    ADD_HISTORY (state, payload) {
      state.noteHistory = [...state.noteHistory, payload]
    },
    CLEAR_HISTORY (state) {
      state.forwardHistory = []
    },
    ADD_FORWARDHISTORY (state, payload) {
      state.forwardHistory = [...state.forwardHistory, payload]
    }
  },
  actions: {
    async searchNote ({ commit, getters }, value) {
      commit("SET_NOTES", await JSON.parse(localStorage.getItem("notes")))
      commit("SET_FOUNDNOTE", getters.GET_NOTES.find(item => item.id === Number(value)))
    },
  },
  modules: {},
});
