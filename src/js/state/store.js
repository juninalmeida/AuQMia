export function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  const getState = () => state;

  const setState = (nextState) => {
    state = nextState;
    listeners.forEach((fn) => fn(state));
  };
  const update = (updater) => setState(updater(state));

  const subscribe = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  return { getState, setState, update, subscribe };
}
