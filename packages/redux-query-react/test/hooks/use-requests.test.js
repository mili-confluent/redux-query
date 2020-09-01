import * as React from 'react';
import { render, waitForElement, getByTestId, fireEvent } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';

import useRequests from '../../src/hooks/use-requests';
import ReduxQueryProvider from '../../src/components/Provider';

export const getQueries = state => state.queries;
export const getEntities = state => state.entities;

const reducer = combineReducers({
  entities: entitiesReducer,
  queries: queriesReducer,
});

const artificialApiNetworkDelay = 100;
const apiMessage = 'hello, world!';

const artificialTestNetworkDelay = 200;
const testRouteMessage = 'test message';

const mockNetworkInterface = url => {
  let timeoutId = null;

  return {
    abort() {
      clearTimeout(timeoutId);
    },
    execute(callback) {
      if (url === '/api') {
        timeoutId = setTimeout(() => {
          const status = 200;
          const body = {
            apiMessage: apiMessage,
          };
          const text = JSON.stringify(body);
          const headers = {};

          callback(null, status, body, text, headers);
        }, artificialApiNetworkDelay);
      }
      if (url === '/test') {
        timeoutId = setTimeout(() => {
          const status = 200;
          const body = {
            testMessage: testRouteMessage,
          };
          const text = JSON.stringify(body);
          const headers = {};

          callback(null, status, body, text, headers);
        }, artificialTestNetworkDelay);
      } else {
        timeoutId = setTimeout(() => {
          callback(null, 404, {}, '{}', {});
        }, artificialApiNetworkDelay);
      }
    },
  };
};

let store;

const App = props => {
  return (
    <Provider store={store}>
      <ReduxQueryProvider queriesSelector={getQueries}>{props.children}</ReduxQueryProvider>
    </Provider>
  );
};

describe('useRequests', () => {
  beforeEach(() => {
    store = createStore(
      reducer,
      applyMiddleware(queryMiddleware(mockNetworkInterface, getQueries, getEntities)),
    );
  });

  it('loads data initially and supports refresh', async () => {
    const Content = () => {
      const [{ isPending }, refresh] = useRequests([
        {
          url: '/api',
          update: {
            apiMessage: (prevValue, newValue) => newValue,
          },
        },
        {
          url: '/test',
          update: {
            testMessage: (prevValue, newValue) => newValue,
          },
        },
      ]);
      const apiMessage = useSelector(state => state.entities.apiMessage);
      const testMessage = useSelector(state => state.entities.testMessage);

      if (isPending) {
        return <div data-testid="loading-content">loading</div>;
      }

      return (
        <div>
          <div data-testid="loaded-api-content">{apiMessage}</div>
          <div data-testid="loaded-test-content">{testMessage}</div>
          <button data-testid="refresh-button" onClick={refresh}>
            refresh
          </button>
        </div>
      );
    };

    const { container } = render(
      <App>
        <Content />
      </App>,
    );

    // Initial loading

    let loadingContentNode = getByTestId(container, 'loading-content');
    expect(loadingContentNode.textContent).toBe('loading');

    // Loaded

    let loadedApiContentNode = await waitForElement(() =>
      getByTestId(container, 'loaded-api-content'),
    );
    expect(loadedApiContentNode.textContent).toBe(apiMessage);

    let loadedTestContentNode = await waitForElement(() =>
      getByTestId(container, 'loaded-test-content'),
    );
    expect(loadedTestContentNode.textContent).toBe(testRouteMessage);

    // Click refresh button

    let buttonNode = getByTestId(container, 'refresh-button');
    fireEvent.click(buttonNode);

    // We're in a loading state again

    loadingContentNode = await waitForElement(() => getByTestId(container, 'loading-content'));
    expect(loadingContentNode.textContent).toBe('loading');

    // Loaded again

    loadedApiContentNode = await waitForElement(() => getByTestId(container, 'loaded-api-content'));
    expect(loadedApiContentNode.textContent).toBe(apiMessage);

    loadedTestContentNode = await waitForElement(() =>
      getByTestId(container, 'loaded-test-content'),
    );
    expect(loadedTestContentNode.textContent).toBe(testRouteMessage);
  });

  it('only reports isFinished when all requests have finished', async () => {
    const Content = () => {
      const [{ isFinished }] = useRequests([
        {
          url: '/api',
          update: {
            apiMessage: (prevValue, newValue) => newValue,
          },
        },
        {
          url: '/test',
          update: {
            testMessage: (prevValue, newValue) => newValue,
          },
        },
      ]);
      const apiMessage = useSelector(state => state.entities.apiMessage);
      const testMessage = useSelector(state => state.entities.testMessage);

      if (!isFinished) {
        return <div data-testid="loading-content">loading</div>;
      }

      return (
        <div>
          <div data-testid="loaded-api-content">{apiMessage}</div>
          <div data-testid="loaded-test-content">{testMessage}</div>
        </div>
      );
    };

    const { container } = render(
      <App>
        <Content />
      </App>,
    );

    // Initial loading

    let loadingContentNode = getByTestId(container, 'loading-content');
    expect(loadingContentNode.textContent).toBe('loading');

    // Loaded

    let loadedApiContentNode = await waitForElement(() =>
      getByTestId(container, 'loaded-api-content'),
    );
    expect(loadedApiContentNode.textContent).toBe(apiMessage);

    let loadedTestContentNode = await waitForElement(() =>
      getByTestId(container, 'loaded-test-content'),
    );
    expect(loadedTestContentNode.textContent).toBe(testRouteMessage);
  });

  it('cancels pending requests as part of cleanup', async () => {
    const Content = () => {
      const [{ isPending }, refresh] = useRequests([
        {
          url: '/api',
          update: {
            apiMessage: (prevValue, newValue) => newValue,
          },
        },
        {
          url: '/test',
          update: {
            testMessage: (prevValue, newValue) => newValue,
          },
        },
      ]);
      const apiMessage = useSelector(state => state.entities.apiMessage);
      const testMessage = useSelector(state => state.entities.testMessage);

      if (isPending) {
        return <div data-testid="loading-content">loading</div>;
      }

      return (
        <div>
          <div data-testid="loaded-api-content">{apiMessage}</div>
          <div data-testid="loaded-test-content">{testMessage}</div>
          <button data-testid="refresh-button" onClick={refresh}>
            refresh
          </button>
        </div>
      );
    };

    const Router = () => {
      const [path, setPath] = React.useState('/');

      return (
        <div>
          {path === '/' ? <Content /> : <div data-testid="404">404</div>}
          <a
            data-testid="broken-link"
            href="/broken-link"
            onClick={e => {
              e.preventDefault();
              setPath('broken-link');
            }}
          >
            broken link
          </a>
          <a
            data-testid="home-link"
            href="/"
            onClick={e => {
              e.preventDefault();
              setPath('/');
            }}
          >
            home link
          </a>
        </div>
      );
    };

    const { container } = render(
      <App>
        <Router />
      </App>,
    );

    // Initial loading of the component that has the useRequests hook

    let loadingContentNode = getByTestId(container, 'loading-content');
    expect(loadingContentNode.textContent).toBe('loading');

    // Click broken link before component has finished loading. By clicking the link, we are
    // unmounting the component that has the useRequests hook, triggering the network request to be
    // canceled.

    let brokenLinkNode = await waitForElement(() => getByTestId(container, 'broken-link'));
    fireEvent.click(brokenLinkNode);

    // 404 page loaded - check that query was actually canceled in Redux

    let notFoundNode = await waitForElement(() => getByTestId(container, '404'));
    expect(notFoundNode.textContent).toBe('404');
    expect(store.getState().queries['{"url":"/api"}'].isPending).toBe(false);
    expect(store.getState().entities.message).toBeUndefined();

    // Go back home

    let homeLinkNode = await waitForElement(() => getByTestId(container, 'home-link'));
    fireEvent.click(homeLinkNode);

    // Check that query begins again

    loadingContentNode = await waitForElement(() => getByTestId(container, 'loading-content'));
    expect(loadingContentNode.textContent).toBe('loading');

    // Loaded now

    let loadedApiContentNode = await waitForElement(() =>
      getByTestId(container, 'loaded-api-content'),
    );
    expect(loadedApiContentNode.textContent).toBe(apiMessage);

    let loadedTestContentNode = await waitForElement(() =>
      getByTestId(container, 'loaded-test-content'),
    );
    expect(loadedTestContentNode.textContent).toBe(testRouteMessage);
  });

  it('does nothing if query config is null', async () => {
    const Content = () => {
      const [{ isPending }] = useRequests(null);
      const message = useSelector(state => state.entities.message);

      if (isPending) {
        return <div data-testid="loading-content">loading</div>;
      }

      return (
        <div>
          <div data-testid="loaded-content">{message}</div>
        </div>
      );
    };

    const { container } = render(
      <App>
        <Content />
      </App>,
    );

    // It never loads

    let loadedContentNode = getByTestId(container, 'loaded-content');
    expect(loadedContentNode.textContent).toBe('');
  });
});
