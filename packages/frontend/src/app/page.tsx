import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { scheduleitemsList } from "@/generated/django-api";

export default function Home() {
  return (
    <main>
      <Card className="bg-green-200 dark:bg-green-900">
        <CardHeader>
          <CardTitle>Direkte</CardTitle>
          <CardDescription>Direkte</CardDescription>
        </CardHeader>
        <CardContent>[ video goes here ]</CardContent>
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
