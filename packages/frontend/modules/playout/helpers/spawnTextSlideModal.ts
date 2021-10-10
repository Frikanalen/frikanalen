import { Manager } from "modules/state/types";
import React from "react";
import { TextSlideModal } from "../components/TextSlideModal";
import { createTextSlideForm } from "../forms/createTextSlideForm";

export const spawnTextSlideModal = (manager: Manager) => {
  const { modalStore } = manager.stores;
  const form = createTextSlideForm(manager);

  modalStore.spawn({
    key: "textslide",
    render: () => React.createElement(TextSlideModal, { form }),
    clickout: true,
    dismissOnClickout: true,
  });
};
