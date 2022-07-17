export default function useEvents() {
  function dragstart(e) {
    console.log("dragstart", e);
  }

  return { dragstart };
}
