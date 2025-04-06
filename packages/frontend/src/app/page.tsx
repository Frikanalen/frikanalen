import {ScheduleitemRead, scheduleitemsList} from "@/generated/django-api";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {addHours, format,  subHours} from "date-fns";

export default function Home() {
    return (
        <main>
            <Card className="bg-green-200 dark:bg-green-900">
                <CardHeader>Direkte</CardHeader>
                <CardBody>[ video goes here ]</CardBody>
                <CardFooter>
                    <ComingUpSoon/>
                </CardFooter>
            </Card>
        </main>
    );
}

const ScheduleItem = ({item}: { item: ScheduleitemRead }) =>
    <div className={"flex gap-2"}>
        <div className={"basis-10 text-left"}>
            {format(new Date(item.starttime), "HH:mm")}
        </div>
        <div>{item.video.name}</div>
    </div>

const ComingUpSoon = async () => {
    const now = new Date();
    const {data} = await scheduleitemsList({
        starttime_Lt: addHours(now, 5).toISOString(),
        starttime_Gt: subHours(now, 5).toISOString()
    });
    const currentProgram = data.results.findIndex((result) => now > new Date(result.starttime) && now < new Date(result.endtime))

    return (
        <div>
            <ScheduleItem item={data.results[currentProgram]}/>
            <ScheduleItem item={data.results[currentProgram+1]}/>
            <ScheduleItem item={data.results[currentProgram+2]}/>



        </div>
    );
};
