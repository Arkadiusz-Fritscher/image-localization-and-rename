<script setup>
import { onMounted, onUnmounted, ref } from "vue";

defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// const card = ref();

// const handleDragStart = (e) => {
//   e.target.style.opacity = "0.4";
//   console.log("drag Start", e.target.dataset);
// };

// const handleDragEnd = (e) => {
//   e.target.style.opacity = "1";
//   console.log("drag End", e.target.dataset);
// };

// const handleDragOver = (e) => {
//   e.preventDefault();
//   return false;
// };

// onMounted(() => {
//   card.value.addEventListener("dragstart", handleDragStart);
//   card.value.addEventListener("dragend", handleDragEnd);
//   card.value.addEventListener("dragover", handleDragOver);
// });

// onUnmounted(() => {
//   card.value.removeEventListener("dragstart", handleDragStart);
//   card.value.removeEventListener("dragend", handleDragEnd);
//   card.value.removeEventListener("dragover", handleDragOver);
// });
</script>

<template>
  <figure class="card" ref="card" :data-id="data.id">
    <img :src="data.url" :alt="data.data?.barcode || ''" draggable="false" />
    <figcaption class="text-xs">
      <span>Datum: </span>{{ data.date?.replace("-", ".") }}
    </figcaption>
  </figure>
</template>

<style scoped>
.card {
  cursor: move;
  padding: 2px;
  border: 1px solid var(--color-body);
  height: max-content;
}

figcaption {
  padding: 0.4rem 0.2rem;
  background-color: var(--color-gray-50);
}

.card img {
  max-inline-size: 100%;
  block-size: auto;
  /* aspect-ratio: 4/3; */
  object-fit: contain;
  object-position: center center;
  inline-size: 100%;
  cursor: pointer;
}
</style>
