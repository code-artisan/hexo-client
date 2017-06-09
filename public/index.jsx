import React from 'react';
import ReactDOM from 'react-dom';
import routes from './router.jsx';

import 'element-theme-default';
import './styles/app.scss';

ReactDOM.render(routes, document.getElementById('hexo-app-container'));
