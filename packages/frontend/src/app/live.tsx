"use client"
import dynamic from "next/dynamic";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {LiveSchedule} from "@/app/liveSchedule";

const VideoPlayer = dynamic(() => import("@/components/stream/VideoPlayer"), {ssr: false});

export const Live = () => (
    <Card className="bg-green-200 dark:bg-green-900">
        <CardHeader>Direkte</CardHeader>
        <CardBody><VideoPlayer/></CardBody>
        <CardFooter>
            <LiveSchedule/>
        </CardFooter>
    </Card>
)
