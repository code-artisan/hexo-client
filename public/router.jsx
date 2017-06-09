import React from 'react';
import {
  Router,
  Route,
  Link,
  IndexRoute,
  hashHistory
} from 'react-router';

import App from './app.jsx';
import IndexView from './views/index.jsx';
import ArticleView from './views/article.jsx';
import SettingView from './views/setting.jsx';

const routes = (
  <Router history={ hashHistory }>
    <Route path="/" component={ App }>
      <IndexRoute component={ IndexView } />
      <Route path="article/:filepath" component={ ArticleView } />
    </Route>
    <Route path="/setting" component={ SettingView } />
  </Router>
);

export default routes;
