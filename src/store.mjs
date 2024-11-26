import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state() {
    return {
      selectedItem: null,
    }
  },
  mutations: {
    selectItem(state, item) {
      state.selectedItem = item
    },
  },
})

export default store
