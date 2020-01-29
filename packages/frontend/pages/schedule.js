import Layout from '../components/Layout';
import * as env from '../components/constants';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import React, { Component } from 'react';

class Schedule extends Component {
    ScheduleItem(item) {
        console.log('hello', item);
        let start_date = new Date(item.starttime); 
        // This cannot possibly be the right way to do this
        let start_time_str = (("0" + start_date.getHours()).slice(-2) + 
            ":" + ("0" + start_date.getMinutes()).slice(-2));
        return (
        <div className="schedule_item">
          <div className="start_time">{start_time_str}</div>
          <div className="category">Samfunn</div>
            <div className="publisher">
            <a href="//github.com/Frikanalen/frikanalen/issues/175">{item.video.organization}</a> 
            </div>
          <div className="title">
            <Link href="/videos/{props.item.video.id}">
                <a>{item.video.name}</a>
            </Link>
          </div>
            <div className="material-icons">expand_more</div>
            <style jsx>{`
            .schedule_item {
                display: grid;
                grid-template-areas: "time category organization expand"
                                    ". title title title";
                grid-template-columns: 100px 200px auto;
            }
            .schedule_item>div {
                display: inline;
            }
            .schedule_item>.start_time { 
                margin-right: 5px;
                grid-area: time;
            }
            .schedule_item>.expand {
                grid-area: expand;
            }
            .schedule_item>.title {
                display: block;
                display: none;
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

    static async getInitialProps(ctx) {
      const res = await fetch(env.API_BASE_URL + 'scheduleitems/');
      const data = await res.json();

      return {
        shows: data.results.map(entry => entry)
      };
    };

    render() {
        return (
        <Layout>
            <div>
                <ul>
                  {
                      this.props.shows.map((schedule_item) => {
                            return (
                                <li key={schedule_item.id.toString()}>
                                { this.ScheduleItem(schedule_item) }
                                </li>
                            )
                        })
                  }
                </ul>
                <style jsx>{`
                li {
                    list-style: none;
                }
                `}</style>
            </div>
        </Layout>
        );
    }
}

export default Schedule;
