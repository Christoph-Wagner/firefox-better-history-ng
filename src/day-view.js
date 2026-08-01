import React from 'react';
import { History } from './history-item';
import getMessage from './i18n';

const NoHistory = () => <div className="history-item">{getMessage('emptyHistory')}</div>;

const DayView = ({ visits }) => (
  <div className="history-day-container">
    {!visits || !visits.length || !visits[0].length ? <NoHistory /> : <History visits={visits[0]} day={true} />}
  </div>
);

export default DayView;
