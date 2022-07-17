<script setup>
import * as data from "@/api/db.json";
import useStore from "@/composables/store.js";
import TheImageCard from "@/components/TheImageCard.vue";
import { computed } from "vue";
const { store } = useStore();

const groupedFiles = computed(() => {
  const grouped = store.files.reduce((result, file) => {
    result[file.data.barcode] = result[file.data?.barcode] || [];
    result[file.data?.barcode].push(file);
    return result;
  }, {});
  return grouped;
});

const handleDrop = (e) => {
  e.preventDefault();

  const dropGroup = e.path.find((element) =>
    element.classList.contains("group")
  ).dataset.group;

  const draggedId = e.dataTransfer.getData("text");

  setNewBarcode(draggedId, dropGroup);
};

const setNewBarcode = (id, barcode) => {
  const file = store.files.find((file) => file.id === id);

  if (file.data.barcode !== barcode) {
    file.data.barcode = barcode;
  }
};

const handleDragStart = (e) => {
  e.dataTransfer.setData("text", e.target.dataset.id);
  e.dataTransfer.effectAllowed = "move";
  console.log("drap start", e);
};

const findAddress = (barcode) => {
  const address = data.default.find((entry) => entry.barcode === barcode);
  return address ? address.location : "Unbekannt";
};
</script>

<template>
  <div>
    <div
      v-for="(files, group) in groupedFiles"
      :key="group"
      class="group-container"
    >
      <div class="group-header">
        <h3>{{ group }}</h3>
        <div class="group-title">
          <span class="group-address">{{ findAddress(group) }}</span>
          <div class="group-count">{{ `Bilder: ${files.length}` }}</div>
        </div>
      </div>
      <div
        class="grid group"
        :data-group="group"
        @drop="handleDrop"
        @dragover.prevent="false"
      >
        <TheImageCard
          v-for="file of files"
          :key="file.id"
          :data="file"
          draggable="true"
          @dragstart="handleDragStart"
        />
      </div>
    </div>

    <!-- <div class="grid" v-if="store.files.length">
      <TheImageCard v-for="file of store.files" :key="file.id" :data="file" />
    </div> -->
  </div>
</template>

<style scoped>
.group-container {
  /* padding: 1rem; */
  /* background-color: var(--color-gray-50); */
  border: 1px solid var(--color-body);
  border-radius: 2px;
}
.group-container:not(:last-child) {
  margin-bottom: 2rem;
}

.group-header {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--color-body);
  padding-inline: 1rem;
  padding-block: 0.5rem 0.2rem;
  background-color: var(--color-gray-100);
}

.group-title {
  display: flex;
  width: 100%;
  align-items: baseline;
  justify-content: space-between;
}

.group-address {
  font-size: var(--text-sm);
  color: var(--color-gray-300);
}

.group-count {
  font-size: var(--text-sm);
  color: var(--color-gray-300);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 0.5fr));
  gap: 1rem;
  padding: 1rem;
}
</style>
