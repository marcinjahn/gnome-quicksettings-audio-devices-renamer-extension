export class ObservableMap extends Map<unknown, unknown> {
  static fromNativeMap(map: Map<unknown, unknown>) {
    const observableMap = new ObservableMap();
    for (const [id, item] of map) {
      observableMap.set(id, item);
    }

    return observableMap;
  }

  private observers: Map<number, () => void> = new Map<number, () => void>();
  private _lastId = -1;

  public subscribe(handler: () => void): number {
    this.observers.set(++this._lastId, handler);

    return this._lastId;
  }

  public unsubscribe(id: number) {
    this.observers.delete(id);
  }

  public override set(key: unknown, value: unknown): this {
    super.set(key, value);

    for (const [_, handler] of this.observers) {
      handler();
    }

    return this;
  }

  public toNativeMap(): Map<unknown, unknown> {
    return new Map(this);
  }
}
