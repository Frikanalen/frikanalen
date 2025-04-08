import { ScheduleitemVideo } from "@/generated/frikanalenDjangoAPI.schemas";
import Markdown from "markdown-to-jsx";

export const VideoBlurb = ({ video }: { video: ScheduleitemVideo }) => {
  const organization = video?.organization;
  return (
    <>
      <div className="prose dark:prose-invert">
        <h3 className="!mb-0">Presentert av {organization.name}</h3>
        <p>
          <em>Medlemmer er selv ansvarlig for innholdet i sine sendinger.</em>
        </p>
        <Markdown>
          {organization.description ||
            "*organisasjonen har ikke oppgitt noen beskrivelse av seg selv.*"}
        </Markdown>
        <h4 className="mb-0">{video.name}</h4>
        {video.description}
        <Markdown>{video.header || ""}</Markdown>
      </div>
    </>
  );
};
