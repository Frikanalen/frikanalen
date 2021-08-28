import { Manager } from "modules/state/types";
import React from "react";
import { RegisterModal } from "../components/RegisterModal";
import { createRegisterForm } from "../forms/createRegisterForm";

export const spawnRegisterModal = (manager: Manager) => {
  const { modalStore } = manager.stores;
  const form = createRegisterForm(manager);

  modalStore.spawn({
    key: "register",
    render: () => React.createElement(RegisterModal, { form }),
    clickout: true,
    dismissOnClickout: true,
  });
};
