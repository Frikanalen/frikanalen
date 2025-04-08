import { Metadata } from "next";
import { PageLayout } from "@/app/about/pageLayout";
import { SalesPitch } from "@/app/about/join/salesPitch";

export const metadata: Metadata = {
  title: "Bli medlem",
  description: "Bli medlem i Frikanalen",
};

const Join = () => (
  <PageLayout>
    <div className={"prose prose-lg dark:prose-invert max-w-xl"}>
      <h2>Bli medlem</h2>
      <SalesPitch />
      <h4>Medlemskontingent</h4>
      <p>Kontingent settes etter organisasjonens omsetning.</p>
      <table className={"max-w-lg"}>
        <thead>
          <tr>
            <th>Omsetning</th>
            <th>Årlig kontingent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Under kr 500 000</td>
            <td>kr 1000</td>
          </tr>
          <tr>
            <td>Mellom kr 0,5 og 2 millioner</td>
            <td>kr 4000</td>
          </tr>
          <tr>
            <td>Mellom kr 2 og 10 millioner</td>
            <td>kr 8000</td>
          </tr>
          <tr>
            <td>Over kr 10 millioner</td>
            <td>kr 12000</td>
          </tr>
        </tbody>
      </table>
      <h4>Enkeltpersonmedlemskap</h4>
      <p>
        Enkeltpersoner kan tegne årlig medlemskap for kr 1000.
        Enkeltpersonmedlemskap medfører ikke medlemsrettigheter.
      </p>
    </div>
  </PageLayout>
);

export default Join;
