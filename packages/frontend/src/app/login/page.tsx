"use client";
import { PageLayout } from "@/app/about/pageLayout";
import { Button, Form, Input } from "@heroui/react";
import { userLoginCreate } from "@/generated/user/user";
import Link from "next/link";

export default function Login() {
  return (
    <PageLayout>
      <div className={"grid-cols-2 grid gap-4"}>
        <div className={"space-y-4"}>
          <h2 className={"text-lg font-bold"}>Logg inn</h2>
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget));

              console.log(data);
            }}
          >
            <Input
              name={"email"}
              label="Epost"
              type="email"
              autoComplete={"username"}
            />
            <Input
              name="password"
              label="Passord"
              type="password"
              autoComplete={"password"}
            />
            <Button className={"ml-auto"} type="submit">
              Logg inn
            </Button>
          </Form>
        </div>
        <div className={"space-y-4 flex flex-col justify-between"}>
          <div className={"text-lg"}>...eller registrer deg</div>
          <div className={""}>
            En profil kan brukes til å personalisere din brukeropplevelse. En
            bruker er også nødvendig for å administrere medlemskap.
          </div>{" "}
          <Link href={"/register"}>
            <Button className={"ml-auto"} href={"/register"}>
              Registerer bruker
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
