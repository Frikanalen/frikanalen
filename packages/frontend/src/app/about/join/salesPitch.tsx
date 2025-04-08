"use client";
import { Button } from "@heroui/react";

export const SalesPitch = () => (
  <div className="max-w-lg">
    <p>Ved å melde din organisasjon inn i Frikanalen, får du:</p>
    <ul>
      <li>Lagre videoinnhold i et reklamefritt arkiv tilgjengelig for alle</li>
      <li>Muligheten til å sende ditt innhold på Frikanalen</li>
      <li>Stemmerett ved Foreningen Frikanalens møter</li>
    </ul>
    <div className={"ml-auto w-fit"}>
      <Button className={"bg-green-200 "}>Bli med!</Button>
    </div>
  </div>
);
