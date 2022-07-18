import { reactive, readonly, watch } from "vue";

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
    store.isLoadingFiles = false;
  }

  // watch(store.files, () =>
  //   store.files.sort((a, b) => a.file.name - b.file.name)
  // );

  return { store, set, reset };
}
