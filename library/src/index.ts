export type StackAction = "pushstart" | "pushend" | "popstart" | "popend";
export type Status = "pushing" | "popping" | "settled" | "popped";

export type StackEvent<T = any> = {
  state: StackState<T>;
  event: {
    action: StackAction;
    key: string;
  };
};

export type StackItem<T = any> = {
  key: string;
  status: Status;
  promise: Promise<StackItem<T>>;
  onPushEnd: () => void;
  onPopEnd: () => void;
  data?: T;
};

export type StackState<T = any> = {
  items: StackItem<T>[];
  lookup: Record<string, StackItem<T>>;
  getItemByKey: (key: string) => StackItem<T> | null;
};

export type Stack<T> = {
  push: (data?: T | undefined) => StackItem<T>;
  pop: (amount?: number, startIndex?: number) => StackItem<any>[];
  subscribe: (listener: (state: StackEvent<T>) => void) => () => void;
  getState: () => StackState;
};

function createAsyncStack<T = any>() {
  let keys: string[] = [];
  let lookup: Record<string, StackItem<T>> = {};
  let count = 0;

  const pushResolvers: Record<string, any> = {};
  const popResolvers: Record<string, Function> = {};

  let listeners: any[] = [];

  function push(data?: T) {
    count += 1;
    const key = "" + count;

    keys.push(key);

    const promise = new Promise<StackItem<T>>((resolve) => {
      pushResolvers[key] = resolve;
    });

    const item: StackItem<T> = {
      key,
      promise,
      status: "pushing" as Status,
      onPushEnd: () => onPushEnd(key),
      onPopEnd: () => onPopEnd(key),
    };

    if (data) {
      item.data = data;
    }

    lookup[key] = item;

    emit("pushstart", key);

    return item;
  }

  function onPushEnd(key: string) {
    const item = lookup[key];

    item.status = "settled";

    const resolver = pushResolvers[key];

    if (resolver) {
      resolver(getItemByKey(key));
      emit("pushend", key);
      delete pushResolvers[key];
    }

    return item;
  }

  function pop(amount = 1, startIndex = 0) {
    let items: StackItem[] = [];

    if (amount === -1) {
      // pop them all
      amount = keys.length;
    }

    for (let i = 1; i <= amount; i++) {
      const key = keys[keys.length - startIndex - i];
      const item = lookup[key];

      if (item) {
        if (item.status === "pushing") {
          onPushEnd(key);
        }

        item.status = "popping";

        const promise = new Promise<StackItem<T>>((resolve) => {
          popResolvers[key] = resolve;
        });

        item.promise = promise;

        emit("popstart", key);
        items.push(item);
      }
    }

    return items;
  }

  function onPopEnd(key: string) {
    const item = lookup[key];

    keys = keys.filter((k) => k !== key);

    const resolver = popResolvers[key];

    if (resolver) {
      item.status = "popped"
      resolver(getItemByKey(key));
      emit("popend", key);
      delete popResolvers[key];
    }

    return item;
  }

  function subscribe(listener: (state: StackEvent<T>) => void) {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function emit(action: StackAction, key: string) {
    listeners.forEach((listener) => {
      const state = getState();
      const event = { key, action };
      listener({ state, event });
    });
  }

  function getItemByKey(key: string) {
    return lookup[key];
  }

  function getState(): StackState {
    const items = keys.map((key) => lookup[key]);

    return {
      items,
      lookup,
      getItemByKey,
    };
  }

  return {
    push,
    pop,
    subscribe,
    getState,
  };
}

export { createAsyncStack };
