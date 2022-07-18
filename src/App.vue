<script setup>
import TheTopBar from "@/components/TheTopBar.vue";
import EmptyView from "@/components/EmptyView.vue";
import TheImageList from "@/components/TheImageList.vue";
import useStore from "@/composables/store";

const { store } = useStore();
</script>

<template>
  <TheTopBar />
  <main class="main">
    <EmptyView v-if="!store.allFileHandles.length" />
    <TheImageList v-else />
  </main>
  <footer class="text-xs">
    <div>v. 0.1 MVP</div>
    <div>
      <a href="mailto:fritscher.dev@gmail.com">Fritscher</a>
    </div>
  </footer>
</template>

<style scoped>
.main {
  /* background-color: var(--color-gray-100); */

  min-height: calc(100vh - 56px);
  position: relative;
}

footer {
  padding-block: 1rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: var(--color-gray-200);
}
</style>
