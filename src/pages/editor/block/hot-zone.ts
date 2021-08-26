import { Operation, Position, Size } from "./types";

export class HotZone {
  private gap = 5;

  private get endPosition() {
    return {
      x: this.position.x + this.size.width,
      y: this.position.y + this.size.height,
    };
  }

  private get hotZonePosition() {
    return {
      startX: this.position.x + this.gap,
      startY: this.position.y + this.gap,
      endX: this.endPosition.x - this.gap,
      endY: this.endPosition.y - this.gap,
    };
  }

  constructor(private position: Position, private size: Size) {}

  update(position: Position, size: Size) {
    this.position = position;
    this.size = size;
  }

  calc(position: Position) {
    if (this.isInTop(position)) return Operation.Top;
    if (this.isInRight(position)) return Operation.Right;
    if (this.isInBottom(position)) return Operation.Bottom;
    if (this.isInLeft(position)) return Operation.Left;
    return Operation.Inside;
  }

  private isInTop(position: Position) {
    return (
      this.containXOrY(
        position.x,
        this.hotZonePosition.startX,
        this.hotZonePosition.endX
      ) &&
      this.containXOrY(position.y, this.position.y, this.hotZonePosition.startY)
    );
  }

  private isInRight(position: Position) {
    return (
      this.containXOrY(
        position.x,
        this.hotZonePosition.endX,
        this.endPosition.x
      ) && this.containXOrY(position.y, this.position.y, this.endPosition.y)
    );
  }

  private isInBottom(position: Position) {
    return (
      this.containXOrY(
        position.x,
        this.hotZonePosition.startX,
        this.hotZonePosition.endX
      ) &&
      this.containXOrY(
        position.y,
        this.hotZonePosition.endY,
        this.endPosition.y
      )
    );
  }

  private isInLeft(position: Position) {
    return (
      this.containXOrY(
        position.x,
        this.position.x,
        this.hotZonePosition.startX
      ) && this.containXOrY(position.y, this.position.y, this.endPosition.y)
    );
  }

  // TODO: gap maybe too large, so we have to fix it
  private containXOrY(value: number, startValue: number, endValue: number) {
    return value >= startValue && value <= endValue;
  }
}
