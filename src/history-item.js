import Moment from 'moment/moment';
import Icon from './icon';
import React from 'react';

const getLastVisit = (visit) => 'Last visit: ' + Moment(visit.lastVisitTime).format('MMMM Do YYYY, h:mm:ss a');
const getTitle = (visit) => (visit.title != null && visit.title != '' ? visit.title : visit.url);

export const History = ({ visits }) => (
  <div>
    {visits.map((visit) => (
      <div className="history-item">
        <span className="history-item-date">{Moment(visit.lastVisitTime).format('h:mm:ss A')}</span>

        <div className="history-item-icon">
          <Icon className="img-icon" default="globe" faviconUrl={visit.url} />
        </div>

        <span className="history-item-url ellipsis-text">
          <abbr title={getLastVisit(visit) + '; ' + getTitle(visit)}>{getTitle(visit)}</abbr>
        </span>

        <div className="history-item-link">
          <a href={visit.url} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        </div>
      </div>
    ))}
  </div>
);