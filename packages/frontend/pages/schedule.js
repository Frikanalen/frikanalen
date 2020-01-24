import Layout from '../components/Layout';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

const Schedule = props => (
    <Layout>
        <div>
            <ul>
              {
                  props.shows.map(
                    (schedule_item) => {
                        return (
                            <li key={schedule_item.id.toString()}>
                            <ScheduleItem item={schedule_item} />
                            </li>
                        )
                    }
                  )
              }
            </ul>
            <style jsx>{`
            li {
                list-style: none;
            }
            `}</style>
        </div>
    </Layout>
)
Schedule.getInitialProps = async function() {
  const res = await fetch('https://frikanalen.no/api/scheduleitems/');
  const data = await res.json();

  return {
    shows: data.results.map(entry => entry)
  };
};
function ScheduleItem (props) {
    let start_date = new Date(props.item.starttime); 
    // This cannot possibly be the right way to do this
    let start_time_str = (("0" + start_date.getHours()).slice(-2) + 
        ":" + ("0" + start_date.getMinutes()).slice(-2));
    return (
    <div className="schedule_item">
      <div className="start_time">{start_time_str}</div>
      <div className="category">Samfunn</div>
        <div className="publisher">
        <a href="//github.com/Frikanalen/frikanalen/issues/175">{props.item.video.organization}</a> 
        </div>
      <div className="title">
        <Link href="/videos/{props.item.video.id}">
            <a>{props.item.video.name}</a>
        </Link>
      </div>
        <style jsx>{`
        .schedule_item {
            display: grid;
            grid-template-areas: "time category organization"
                                ". title title";
            grid-template-columns: 100px 200px auto;
        }
        .schedule_item>div {
            display: inline;
        }
        .schedule_item>.start_time { 
            margin-right: 5px;
            grid-area: time;
        }
        .schedule_item>.title {
            display: block;
            grid-area: title;
        }
        .schedule_item>.category {
            text-transform: lowercase;
            margin-right: 5px;
            grid-area: category;
            border: 1px solid black;
            text-align: center;
        }
        `}</style>
    </div>
);
}

export default Schedule;
