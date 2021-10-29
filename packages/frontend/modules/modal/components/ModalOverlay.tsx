import React from "react";
import { observer } from "mobx-react-lite";
import { ModalRenderer } from "./ModalRenderer";
import { useStores } from "modules/state/manager";
import { Transition, TransitionGroup } from "react-transition-group";

export const ModalOverlay = observer(() => {
  const { modalStore } = useStores();
  const items = modalStore.items.filter((item) => item.visible);

  return (
    <TransitionGroup>
      {items.map((item) => (
        <Transition timeout={200} key={item.key}>
          {(status) => <ModalRenderer transitionStatus={status} key={item.key} item={item} />}
        </Transition>
      ))}
    </TransitionGroup>
  );
});
