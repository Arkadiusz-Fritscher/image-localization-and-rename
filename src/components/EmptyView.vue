<script setup>
import useFileSystem from "@/composables/fileSystem";
import useStore from "@/composables/store";
const { openFiles } = useFileSystem();
const { reset } = useStore();

const handleClick = async () => {
  reset();
  await openFiles();
};
</script>

<template>
  <div class="empty">
    <div class="content">
      <h2 class="h3 heading">
        Füge Bilder hinzu die automatisch sortiert werden sollen.
      </h2>
      <button @click="handleClick">Neue Bilder hinzufügen</button>
    </div>
  </div>
</template>

<style scoped>
.empty {
  min-height: calc(100vh - 57px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.heading {
  max-width: 30ch;
  text-align: center;
}

button {
  background-color: var(--color-body);
  color: var(--color-white);
}
</style>
