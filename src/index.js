import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';
import 'moment/locale/ru';

import './index.scss';
import App from './app';
import getMessage from './i18n';

async function main() {
  const settingRegion = (await browser.storage.sync.get('region')).region;
  // There is probably a better way. But I don’t want to learn about context just for this or keep passing props
  const language = settingRegion || browser.i18n.getUILanguage();
  window.ihatereactngbetterhistoryregion = language;
  Moment.locale(language);

  const titleMsg = getMessage('extName');
  if (titleMsg && titleMsg !== 'extName') {
    document.title = titleMsg;
  }

  const data = await browser.storage.local.get();
  ReactDOM.render(
    <App defaultView={data.last_visited} repeatedVisits={data.repeatedVisits} />,
    document.getElementById('root')
  );
}

main();
