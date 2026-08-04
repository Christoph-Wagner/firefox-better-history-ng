import React from 'react';
import { History } from './history-item';
import HistoryApi from 'history-api';
import getMessage from './i18n';

import Icon from 'icon';

const NoHistory = () => <div></div>;

const Column = ({ date, visits, viewDay }) => (
  <div className="history-week-day">
    <div className="history-day-header">
      <div className="history-item" onClick={() => viewDay(date)}>
        <p>{HistoryApi.formatHistoryItem(date)}</p>
      </div>
    </div>
    <div className="history-week-day-items">{visits.length == 0 ? <NoHistory /> : <History visits={visits} />}</div>
  </div>
);

const WeekView = ({ visits, date, viewDay }) => {
  if (!visits || !date) {
    return <div>{getMessage('somethingWentWrong')}</div>;
  }

  let columns = [];
  for (let i = 0; i < 7; i++) {
    columns.push(<Column date={date.clone().weekday(0).add(i, 'days')} visits={visits[i]} viewDay={viewDay} />);
  }

  return <div className="history-week-container">{columns}</div>;
};

export default WeekView;
