import React from 'react';
import Moment from 'moment';
import HistoryApi from 'history-api';

import DayView from 'day-view';
import WeekView from 'week-view';
import MonthView from 'month-view';
import Icon from 'icon';
import getMessage from './i18n';

const VIEWS = {
  DAY: 0,
  WEEK: 1,
  MONTH: 2,
};

const VIEW_UNITS = ['days', 'weeks', 'months'];

class App extends React.Component {
  constructor(props) {
    super(props);

    let currentView = props.defaultView;
    if (currentView === null || currentView === undefined) {
      currentView = VIEWS.WEEK;
    }

    let repeatedVisits = props.repeatedVisits;
    if (repeatedVisits === null || repeatedVisits === undefined) {
      repeatedVisits = false;
    }

    this.state = {
      currentView,
      date: Moment(),
      loading: true,
      search: null,
      visits: [],
      repeatedVisits,
    };
  }

  toggleRepeatedVisits() {
    browser.storage.local.set({ repeatedVisits: !this.state.repeatedVisits });
    this.setState({ repeatedVisits: !this.state.repeatedVisits, loading: true });
  }

  setView(newView) {
    browser.storage.local.set({ last_visited: newView });
    this.setState({ currentView: newView, date: Moment(), loading: true });
  }

  previous() {
    const { currentView, date } = this.state;
    date.subtract(1, VIEW_UNITS[currentView]);
    this.setState({ date, loading: true });
  }

  next() {
    const { currentView, date } = this.state;
    date.add(1, VIEW_UNITS[currentView]);
    this.setState({ date, loading: true });
  }

  viewDay(targetDate) {
    this.setView(VIEWS.DAY);
    this.setState({ date: targetDate, loading: true });
  }

  getFilteredVisits() {
    const { search, visits } = this.state;

    if (!search) {
      return visits;
    }

    let hostname_filters = [];

    // split search by spaces, but allow quotes to escape that feature,
    // or to escape from the escape by escaping the quotes
    let terms = search.match(/\\?.|^$/g).reduce((acc, currentChar) => {
      // if the current character is a double quote, toggle the quote flag
      if (currentChar === '"') {
        acc.isInsideQuotes ^= 1;
      } else if (!acc.isInsideQuotes && currentChar === ' ') {
        // if not inside quotes and the current character is a space, add a new empty string to the array
        acc.words.push('');
      } else {
        // otherwise, append the current character to the last string in the array,
        // replacing escaped characters with their unescaped versions
        acc.words[acc.words.length - 1] += currentChar.replace(/\\(.)/, '$1');
      }
      return acc;
    }, { words: [''], isInsideQuotes: 0 }).words;
    // if any of the terms start with site: take those as host filters for the search
    // and remove them from the terms array
    const siteFilterTerms = terms.filter(t => t.startsWith('site:'));
    for (const siteFilterTerm of siteFilterTerms) {
      hostname_filters.push(siteFilterTerm.substring(5));
      terms = terms.filter(t => t !== siteFilterTerm);
    }

    const filteredVisits = [];

    for (const visitsArray of visits) {
      filteredVisits.push(
        visitsArray.filter((visit) => {
          // check if the title or url contains all the search terms
            for (const search_item of terms) {
              const needle = search_item.toUpperCase();
              const success = visit.url.toUpperCase().includes(needle) ||
                (visit.title != null && visit.title.toUpperCase().includes(needle));
              if (!success) {
                return false;
              }
            }
            // success if no hostname filters set
            if (hostname_filters.length === 0) {
              return true;
            }
            // otherwise require a suffix match of the host name
            const url = new URL(visit.url);
            for (const hostname of hostname_filters) {
              if (url.hostname.toUpperCase().endsWith(hostname.toUpperCase()))
                return true;
            }
            return false;
          },
        ));
    }

    return filteredVisits;
  }

  onInputChange(event) {
    const search = event.target.value;
    this.setState({ search });
  }

  render() {
    const { currentView, date, loading, search, repeatedVisits } = this.state;

    let filteredVisits = [];
    if (loading) {
      if (currentView === VIEWS.DAY) {
        HistoryApi.getDayVisits(date, repeatedVisits).then((newVisits) => {
          this.setState({ loading: false, visits: newVisits, filteredVisits: newVisits });
        });
      } else if (currentView === VIEWS.WEEK) {
        HistoryApi.getWeekVisits(date, repeatedVisits).then((newVisits) => {
          this.setState({ loading: false, visits: newVisits, filteredVisits: newVisits });
        });
      } else if (currentView === VIEWS.MONTH) {
        HistoryApi.getMonthVisits(date, repeatedVisits).then((newVisits) => {
          this.setState({ loading: false, visits: newVisits, filteredVisits: newVisits });
        });
      }
    } else {
      filteredVisits = this.getFilteredVisits();
    }

    let selectedDate =
      currentView === VIEWS.DAY
        ? HistoryApi.formatDayHeader(date)
        : currentView === VIEWS.WEEK
        ? HistoryApi.formatWeekHeader(date)
        : HistoryApi.formatMonthHeader(date);

    let clearButtonClasses = 'search-button search-button--cancel';
    if (!search) {
      clearButtonClasses += ' hidden';
    }

    return (
      <div className="container">
        <div className="toolbar">
          <h1>{selectedDate}</h1>

          <div className="search-wrapper">
            <input
              className="default-input search-input"
              type="text"
              value={search}
              onChange={this.onInputChange.bind(this)}
              placeholder={getMessage('searchPlaceholder')}
            />
            <button className={clearButtonClasses} onClick={() => this.setState({ search: '' })} title={getMessage('clearSearch')} />
          </div>

          <button className="toolbar-item-right ghost-button align-right" onClick={() => this.previous()}>
            <Icon default="back" />
          </button>
          <button className="toolbar-item-right ghost-button" onClick={() => this.next()}>
            <Icon default="forward" />
          </button>
          {repeatedVisits ? (
            <button
              className="toolbar-item-right ghost-button"
              title={getMessage('hideRepeatedVisits')}
              onClick={() => this.toggleRepeatedVisits()}
            >
              <Icon default="multiple" />
            </button>
          ) : (
            <button
              className="toolbar-item-right ghost-button"
              title={getMessage('showRepeatedVisits')}
              onClick={() => this.toggleRepeatedVisits()}
            >
              <Icon default="multiple-disabled" />
            </button>
          )}
          <button className="toolbar-item-right default-button" onClick={() => this.setView(VIEWS.DAY)}>
            {getMessage('viewDay')}
          </button>
          <button className="toolbar-item-right default-button" onClick={() => this.setView(VIEWS.WEEK)}>
            {getMessage('viewWeek')}
          </button>
          <button className="toolbar-item-right default-button" onClick={() => this.setView(VIEWS.MONTH)}>
            {getMessage('viewMonth')}
          </button>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : currentView === VIEWS.DAY ? (
          <DayView visits={filteredVisits} />
        ) : currentView === VIEWS.WEEK ? (
          <WeekView date={date} visits={filteredVisits} viewDay={this.viewDay.bind(this)} />
        ) : (
          <MonthView date={date} visits={filteredVisits} viewDay={this.viewDay.bind(this)} />
        )}
      </div>
    );
  }
}

export default App;
