import { createStore } from 'vuex';

// Create a new store instance.
const store = createStore({
  state() {
    return {
      selectedItem: null,
      clipboard: null,
    };
  },
  mutations: {
    selectItem(state, item) {
      state.selectedItem = item;
    },
    copyItem(state, item) {
      state.clipboard = item;
    },
  },
});

export default store;
