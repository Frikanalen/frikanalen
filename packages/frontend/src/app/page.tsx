import { scheduleitemsList } from "@/generated/django-api";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";

export default function Home() {
  return (
    <main>
      <Card className="bg-green-200 dark:bg-green-900">
        <CardHeader>Direkte</CardHeader>
        <CardBody>[ video goes here ]</CardBody>
        <CardFooter>
          <ComingUpSoon />
        </CardFooter>
      </Card>
    </main>
  );
}

const ComingUpSoon = () => {
  const items = scheduleitemsList();
  return (
    <div>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
};
