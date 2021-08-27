import React from "react";
import { useObserver } from "mobx-react-lite";
import { ModalRenderer } from "./ModalRenderer";
import { useStores } from "modules/state/manager";

export function ModalOverlay() {
  const { modalStore } = useStores();

  const items = useObserver(() => modalStore.items);

  return (
    <div>
      {items.map((item) => (
        <ModalRenderer key={item.key} item={item} />
      ))}
    </div>
  );
}
