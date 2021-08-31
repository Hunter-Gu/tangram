import { Mutations, State } from "../../../plugins/store";
import { Store, useStore } from "vuex";

export const dragHandler = (evt: DragEvent) => {
  const name = (evt.target as HTMLElement).dataset.name;

  if (!name) {
    return;
  }

  evt.dataTransfer?.setData("text", name);
};

export function useDrag(dragElm: HTMLElement) {
  dragElm.draggable = true;

  dragElm.addEventListener("dragstart", dragHandler);
}

export function useDrop(dropElm: HTMLElement) {
  const store: Store<State> = useStore();
  dropElm.addEventListener("dragover", (evt: Event) => {
    evt.preventDefault();
  });

  dropElm.addEventListener("drop", (evt) => handleDrop(store, evt));
}

export function handleDrop(store: Store<State>, evt: DragEvent, path = "") {
  const name = evt.dataTransfer?.getData("text");

  store.commit(Mutations.CLEAR_SELECTS);
  store.commit(Mutations.ADD_ELEMENT, { componentName: name, path });
}
