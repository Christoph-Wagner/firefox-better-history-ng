import React from 'react';
import { History } from './history-item';
import HistoryApi from 'history-api';
import getMessage from './i18n';

import Icon from 'icon';

const NoHistory = () => <div></div>;

const GridItem = ({ date, visits, sameMonth, viewDay }) => {
  let classes = 'history-month-day';
  if (!sameMonth) {
    classes += ' disabled';
  }

  return (
    <div className={classes}>
      <div className="history-day-header">
        <div className="history-item" onClick={() => viewDay(date)}>
          <p>{HistoryApi.formatHistoryItem(date)}</p>
        </div>
      </div>
      <div className="history-month-day-items">{visits.length == 0 ? <NoHistory /> : <History visits={visits} />}</div>
    </div>
  );
};

const MonthView = ({ visits, date, viewDay }) => {
  if (!visits || !date) {
    return <div>{getMessage('somethingWentWrong')}</div>;
  }

  const firstDayOfMonth = date.clone().startOf('month');
  const firstDayOfWeekBeforeMonth = firstDayOfMonth.startOf('week');
  // dont use firstDayOfMonth anymore
  let days = [];
  for (let i = 0; i < 35; i++) {
    const day = firstDayOfWeekBeforeMonth.clone().add(i, 'days');
    days.push(<GridItem date={day} visits={visits[i]} sameMonth={day.isSame(date, 'month')} viewDay={viewDay} />);
  }

  return <div className="history-month-container">{days}</div>;
};

export default MonthView;
