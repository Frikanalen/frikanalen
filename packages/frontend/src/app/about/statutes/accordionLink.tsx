import React from "react";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";
export const AccordionLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href}>
    <li
      className={
        "flex justify-between p-4 border-b-2 border-b-gray-300 items-center "
      }
    >
      <div>{children}</div>
      <GoArrowRight className={"text-2xl"} />
    </li>
  </Link>
);
