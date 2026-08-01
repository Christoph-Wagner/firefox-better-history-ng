import Icon from './icon';
import React from 'react';
import getMessage from './i18n';

const getLastVisit = (visit) =>
  getMessage('lastVisit', new Date(visit.lastVisitTime).toLocaleString(window.ihatereactngbetterhistoryregion));
const getTitle = (visit) => (visit.title != null && visit.title !== '' ? visit.title : visit.url);

function openTabs(urls) {
  if (urls.length > 5 && !confirm(getMessage('openTabsConfirm', String(urls.length))))
    return;
  urls.forEach(url => {
    browser.tabs.create({ url: url });
  });
}

const OpenAllLink = ({visits}) => (
  <a className="openNewTab" title={getMessage('openAllLinksTitle', String(visits.length))} href="#" onClick={e => {
    e.stopPropagation();
    openTabs(visits.map((visit) => visit.url));
  }}>{getMessage('linksCount', String(visits.length))}</a>
)
export const History = ({ visits, day = false }) => (
  <div>
    <OpenAllLink visits={visits} />
    <div>
      {visits.map((visit) => (
        <div className="history-item">
          {day ? (
            <span className="history-item-date">
            {new Date(visit.lastVisitTime).toLocaleTimeString(window.ihatereactngbetterhistoryregion)}
          </span>
          ) : (
            ''
          )}

          <div className="history-item-icon">
            <Icon className="img-icon" default="globe" faviconUrl={visit.url} />
          </div>

          <span className="history-item-url ellipsis-text">
          <abbr title={getLastVisit(visit) + '; ' + getTitle(visit)}>{getTitle(visit)}</abbr>
        </span>
          <div className="history-item-link">
            <a href={visit.url} title={visit.url} target="_blank" rel="noopener noreferrer">
              {day ? getMessage('linkAction') : ''}
            </a>
          </div>
        </div>
      ))}
    </div>
    </div>
    );
