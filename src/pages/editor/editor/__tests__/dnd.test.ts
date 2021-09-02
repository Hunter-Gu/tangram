import { Mutations, State } from "../../../../plugins/store";
import { Store } from "vuex";
import {
  dragHandler,
  handleDragover,
  handleDrop,
  useDrag,
  useDrop,
} from "../dnd";

describe("DnD", () => {
  describe("useDrag", () => {
    it("it will set elm draggable and listen dragstart event", () => {
      const divElm = document.createElement("div");

      jest.spyOn(divElm, "addEventListener");

      useDrag(divElm);

      expect(divElm.draggable).toBeTruthy();
      expect(divElm.addEventListener).toBeCalledWith("dragstart", dragHandler);
    });

    it("it will get dataset.name from elm when dragstart trigger", () => {
      const divElm = document.createElement("div");
      divElm.dataset.name = "a";

      const evt = {
        target: divElm,
        dataTransfer: {
          setData: jest.fn(),
        },
      } as unknown as DragEvent;

      dragHandler(evt);

      expect(evt.dataTransfer?.setData).toBeCalledWith("text", "a");
    });
  });

  describe("useDrop", () => {
    it("it will listen dragover event and call preventDefaut when trigger, and listen drop event set handleDrop as handler", () => {
      const divElm = document.createElement("div");

      jest.spyOn(divElm, "addEventListener");

      useDrop(divElm);

      expect(divElm.addEventListener).toBeCalledTimes(2);
      expect(divElm.addEventListener).toHaveBeenNthCalledWith(
        1,
        "dragover",
        handleDragover
      );
    });

    it("it will commit CLEAR_SELECTS and ADD_ELEMENT when handle drop event", () => {
      const store = {
        commit: jest.fn(),
      } as unknown as Store<State>;
      const evt = {
        dataTransfer: {
          getData: jest.fn().mockImplementation(() => "a"),
        },
      } as unknown as DragEvent;

      handleDrop(store, evt, "path");

      expect(store.commit).toBeCalledTimes(2);
      expect(store.commit).toHaveBeenNthCalledWith(1, Mutations.CLEAR_SELECTS);
      expect(store.commit).toHaveBeenNthCalledWith(2, Mutations.ADD_ELEMENT, {
        componentName: "a",
        path: "path",
      });
    });
  });
});
