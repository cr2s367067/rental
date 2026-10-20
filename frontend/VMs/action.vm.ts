import { useSyncExternalStore } from 'react';
import { errorMessage } from '../Services/client';
export class ActionVM {
  private state = { pending: false, error: '' };
  private listeners = new Set<() => void>();
  constructor(private invalidate: () => Promise<unknown>) {}
  get pending() {
    return this.state.pending;
  }
  get error() {
    return this.state.error;
  }
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private publish(state: typeof this.state) {
    this.state = state;
    this.listeners.forEach((listener) => listener());
  }
  protected async run<T>(operation: () => Promise<T>, refresh = true): Promise<T | undefined> {
    if (this.pending) return undefined;
    this.publish({ pending: true, error: '' });
    try {
      const value = await operation();
      if (refresh) await this.invalidate();
      return value;
    } catch (error) {
      this.publish({ pending: true, error: errorMessage(error) });
      return undefined;
    } finally {
      this.publish({ ...this.state, pending: false });
    }
  }
}
export function useActionVM<T extends ActionVM>(vm: T) {
  useSyncExternalStore(vm.subscribe, vm.getSnapshot);
  return vm;
}
