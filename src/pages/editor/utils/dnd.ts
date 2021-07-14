let idx = 0;

export function useDrag(dragElm: HTMLElement) {
  dragElm.draggable = true;
  dragElm.dataset.dragId = String(++idx);

  dragElm.addEventListener("dragstart", (evt: DragEvent) => {
    const dragId = (evt.target as HTMLElement).dataset.dragId!;

    evt.dataTransfer?.setData("text", dragId);
  });
}

export function useDrop(dropElm: HTMLElement) {
  dropElm.addEventListener("dragover", (evt: Event) => {
    evt.preventDefault();
  });

  dropElm.addEventListener("drop", (evt: DragEvent) => {
    const dragId = evt.dataTransfer?.getData("text");
    const elm = Array.from(
      document.querySelectorAll<HTMLElement>("[data-drag-id]")
    ).find((elm) => elm.dataset.dragId === dragId);

    elm && dropElm.appendChild(elm);
  });
}
