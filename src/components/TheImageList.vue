<script setup>
import * as data from "@/api/db.json";
import useStore from "@/composables/store.js";
import TheImageCard from "@/components/TheImageCard.vue";
import { watch, ref } from "vue";
import BaseModal from "@/components/BaseModal.vue";
const { store } = useStore();

const groups = ref({});

// const groupedFiles = computed(() => {
//   // eslint-disable-next-line vue/no-side-effects-in-computed-properties
//   const grouped = store.files
//     .sort((a, b) => a.file.name - b.file.name)
//     .reduce((result, file) => {
//       result[file.data.barcode] = result[file.data?.barcode] || [];
//       result[file.data?.barcode].push(file);
//       return result;
//     }, {});
//   return grouped;
// });

const createNewGroup = (e) => {
  if (e.target[0]?.value) {
    groups.value[e.target[0]?.value] = {};
    isModalOpen.value = false;
  }
};

const isModalOpen = ref(false);

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

watch(store.files, (value) => {
  groups.value = value
    .sort((a, b) => a.file.name - b.file.name)
    .reduce((result, file) => {
      result[file.data.barcode] = result[file.data?.barcode] || [];
      result[file.data?.barcode].push(file);
      return result;
    }, {});
});
</script>

<template>
  <div class="container">
    <BaseModal v-model="isModalOpen">
      <form action="" method="dialog" @submit.prevent="createNewGroup">
        <p class="text-md" style="font-weight: 700; margin-bottom: 1rem">
          Neue Gruppe erstellen
        </p>
        <label for="new-group">Gruppenname</label>
        <input type="text" id="new-group" name="new-group" />
        <button style="margin-top: 1rem" type="submit">Gruppe erstellen</button>
      </form>
    </BaseModal>
    <aside class="sidebar">
      <ul class="sidebar__list">
        <li v-for="(files, group) in groups" :key="group">
          <ul class="sidebar__group__list" :data-group="group">
            <li class="sidebar__group__list__title">{{ group }}</li>
            <li
              v-for="file in files"
              :key="file.id"
              class="sidebar__group__list__item"
              :data-id="file.id"
              draggable="true"
            >
              {{ file.file.name }}
            </li>
          </ul>
        </li>
        <li>
          <button
            style="width: calc(100% + 2px); margin: -1px"
            @click="isModalOpen = !isModalOpen"
          >
            + Neue Gruppe erstellen
          </button>
        </li>
      </ul>
    </aside>
    <div class="image-list">
      <div
        v-for="(files, group) in groups"
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
    </div>
    <!-- <div class="grid" v-if="store.files.length">
      <TheImageCard v-for="file of store.files" :key="file.id" :data="file" />
    </div> -->
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 1rem;
  min-height: 100%;
}
.sidebar {
  position: relative;
  flex: 1 1 min-content;
}

@media (min-width: 100px) {
  .sidebar {
    flex: 1 1 350px;
  }
}

.sidebar__list {
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  position: sticky;
  top: 1rem;
}

.sidebar__group__list__item {
  padding-left: 0.5rem;
  list-style-position: inside;
  padding-block: 0.2rem;
  font-size: var(--text-sm);
}

.sidebar__group__list__item:not(:last-child) {
  border-bottom: 1px solid var(--color-gray-200);
}

.sidebar__group__list__item:nth-child(odd) {
  background-color: var(--color-gray-50);
}

.sidebar__group__list__item:hover {
  background-color: var(--color-gray-200);
  cursor: grab;
}

.sidebar__group__list__item:active {
  cursor: grabbing;
}

.sidebar__group__list__title {
  background-color: var(--color-gray-100);
  color: var(--color-body);
  font-weight: 700;
  padding-block: 0.5rem;
  padding-inline: 0.2rem 1rem;
  border-block: 1px solid black;
  margin-top: -1px;
}

.image-list {
  flex: 1 1 100%;
}
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

form {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
</style>
