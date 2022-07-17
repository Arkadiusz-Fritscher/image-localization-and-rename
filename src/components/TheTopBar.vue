<script setup>
import useFileSystem from "@/composables/fileSystem";
import useStore from "@/composables/store";

const { openFiles, saveFiles } = useFileSystem();
const { reset, store } = useStore();

const handleClick = async () => {
  reset();
  await openFiles();
};
</script>

<template>
  <nav class="bar">
    <button @click="handleClick">Neue Bilder hinzufügen</button>

    <button @click="saveFiles" :disabled="!store.files.length">Download</button>
  </nav>
</template>

<style scoped>
.bar {
  padding-block: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background-color: red; */
  width: 100%;
}
button {
  display: block;
}
</style>
