import { action, makeObservable, observable } from "mobx";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { Popover } from "../types/Popover";

export class PopoverStore extends Store {
  public popovers: Popover[] = [];

  public make() {
    makeObservable(this, {
      popovers: observable,
      spawn: action,
      update: action,
      dismiss: action,
    });
  }

  public spawn(popover: Popover) {
    this.popovers.push(popover);

    return () => {
      this.dismiss(popover.name);
    };
  }

  public update(name: string, popover: Partial<Popover>) {
    const index = this.popovers.findIndex((p) => p.name === name);

    if (index !== -1) {
      this.popovers[index] = { ...this.popovers[index], ...popover };
    }
  }

  public dismiss(name: string) {
    const popover = this.popovers.find((popover) => popover.name === name);

    if (!popover) return;
    if (popover.onDismiss) popover.onDismiss();

    this.popovers = this.popovers.filter((p) => p !== popover);
  }
}

export const popoverStore = createStoreFactory(PopoverStore);
