import { reactive, readonly } from "vue";

const store = reactive({
  allFileHandles: [],
  files: [],
  isLoadingFiles: false,
});

export default function useStore() {
  function set(cb) {
    cb(store);
  }

  function reset() {
    store.allFileHandles = [];
    store.files = [];
  }

  return { store: store, set, reset };
}
