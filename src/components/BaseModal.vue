<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { watch, ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(["update:modelValue"]);

const dialog = ref();

function openDialog() {
  dialog.value.showModal();
  emits("update:modelValue", dialog.value.open);
}
function closeDialog() {
  dialog.value.close();
  emits("update:modelValue", dialog.value.open);
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      openDialog();
    } else {
      closeDialog();
    }
  }
);

const onClickOutside = (e) => {
  if (e.target.tagName === "DIALOG") {
    closeDialog();
  }
};

onMounted(() => {
  window.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("click", onClickOutside);
});
</script>

<template>
  <Teleport to="body">
    <dialog v-bind="$attrs" ref="dialog">
      <slot></slot>
    </dialog>
  </Teleport>
</template>

<style scoped>
dialog {
  background-color: var(--color-white);
  position: fixed;
  z-index: 10;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}

dialog::backdrop {
  /* position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 8; */
  background: rgba(0, 0, 0, 0.5);
}
</style>
