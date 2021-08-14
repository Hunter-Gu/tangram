let order = 0;

export function traceExecuteOrder(func: Function) {
  return (...args: any[]) => {
    order++;
    // @ts-ignore
    func.__orderId = order;
    return func(...args);
  };
}

export function getOrder(func: Function) {
  // @ts-ignore
  return func.__orderId;
}
