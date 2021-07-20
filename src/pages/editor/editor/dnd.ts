import { Mutations, State } from "../../../plugins/store";
import { Store, useStore } from "vuex";

export function useDrag(dragElm: HTMLElement) {
  dragElm.draggable = true;

  dragElm.addEventListener("dragstart", (evt: DragEvent) => {
    const name = (evt.target as HTMLElement).dataset.name!;

    evt.dataTransfer?.setData("text", name);
  });
}

export function useDrop(dropElm: HTMLElement) {
  const store: Store<State> = useStore();

  dropElm.addEventListener("dragover", (evt: Event) => {
    evt.preventDefault();
  });

  dropElm.addEventListener("drop", (evt: DragEvent) => {
    const name = evt.dataTransfer?.getData("text");

    store.commit(Mutations.ADD_ELEMENT, name);
  });
}
