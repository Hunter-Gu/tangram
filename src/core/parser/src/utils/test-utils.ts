let order = 0;

export function traceExecuteOrder(func: (...args: unknown[]) => unknown) {
  return (...args: unknown[]) => {
    order++;
    // @ts-ignore
    func.__orderId = order;
    return func(...args);
  };
}

export function getOrder(func: (...args: unknown[]) => unknown) {
  // @ts-ignore
  return func.__orderId;
}
