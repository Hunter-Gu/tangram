import { DefineComponent, ref, Ref } from "vue";

// store all refs
const refs: Record<number, Ref<DefineComponent | undefined>> = {};

function setRef(name: number, ref: Ref<any>) {
  refs[name] = ref;
}

export function getRef(name: number) {
  return refs[name];
}

function checkUnique(name: number) {
  return !(name in refs);
}

export function initRef(name: number) {
  const idRef = ref(null);

  if (checkUnique(name)) {
    setRef(name, idRef);
  } else {
    // TODO it will rerender all when state change trigger reactive
    // console.error('Conflict uuid:', name);
  }
  return idRef;
}
