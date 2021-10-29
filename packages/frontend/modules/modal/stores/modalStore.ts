import { createStoreFactory, Store } from "modules/state/classes/Store";
import { observable, computed, makeObservable, action } from "mobx";

export type ModalItem = {
  key: string;
  visible?: boolean;
  render: () => JSX.Element;
  clickout?: boolean;
  dismissOnClickout?: boolean;
};

export class ModalStore extends Store {
  public items: ModalItem[] = [];

  public make() {
    makeObservable(this, {
      items: observable,
      spawn: action,
      dismiss: action,
      hasItems: computed,
    });
  }

  public spawn(item: ModalItem) {
    const existingItem = this.getByKey(item.key);

    if (existingItem) {
      existingItem.visible = true;
      return;
    }

    const safeItem = {
      visible: true,
      ...item,
    };

    this.items = [...this.items, safeItem];
  }

  public dismiss(key: string, destroy = false) {
    if (destroy) {
      this.items = this.items.filter((x) => x.key !== key);
      return;
    }

    const item = this.getByKey(key);

    if (item) {
      item.visible = false;
    }
  }

  private getByKey(key: string) {
    return this.items.find((x) => x.key === key);
  }

  public get hasItems() {
    return this.items.filter((x) => x.visible).length > 0;
  }
}

export const modalStore = createStoreFactory(ModalStore);
