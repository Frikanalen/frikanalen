import React from "react";

export const AccordionLinkGroup = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <ul className={"list-none border-t-2 border-t-gray-300 my-4"}>{children}</ul>
);
