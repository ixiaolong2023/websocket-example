import { ref } from 'vue';

export function useRef (initial) {
  const state = ref(initial);

  const setState = (newValue) => {
    if (typeof newValue === 'function') {
      state.value = newValue(state.value);
    } else {
      state.value = newValue;
    }
  };

  return [
    state,
    setState,
  ]
}