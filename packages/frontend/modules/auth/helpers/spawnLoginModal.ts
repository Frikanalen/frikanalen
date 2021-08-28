import { Manager } from "modules/state/types";
import React from "react";
import { LoginModal } from "../components/LoginModal";
import { createLoginForm } from "../forms/createLoginForm";

export const spawnLoginModal = (manager: Manager) => {
  const { modalStore } = manager.stores;
  const form = createLoginForm(manager);

  modalStore.spawn({
    key: "login",
    render: () => React.createElement(LoginModal, { form }),
    clickout: true,
    dismissOnClickout: true,
  });
};
