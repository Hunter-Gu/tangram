import { Mutations, State } from "../../../plugins/store";
import { Store, useStore } from "vuex";
import { AddParams } from "../block/types";
import { PartialKeys } from "./types";

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

export const handleDragover = (evt: Event) => {
  evt.preventDefault();
};

export function useDrop(dropElm: HTMLElement) {
  const store: Store<State> = useStore();
  dropElm.addEventListener("dragover", handleDragover);

  dropElm.addEventListener("drop", (evt: DragEvent) =>
    handleDrop(store, { evt })
  );
}

export function handleDrop(
  store: Store<State>,
  params: PartialKeys<AddParams, "path" | "type">
) {
  const { evt, path = "", type } = params;
  const name = evt.dataTransfer?.getData("text");

  store.commit(Mutations.CLEAR_SELECTS);
  store.commit(Mutations.ADD_ELEMENT, { componentName: name, path, type });
}
