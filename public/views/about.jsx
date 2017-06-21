import $ from 'jquery';
import React from 'react';
import pkg from '../../package.json';

class AboutView extends React.Component {

  constructor(props) {
    super( props );

    $(document).on('selectstart', () => false);
  }

  render() {
    return (
      <div className="about-view">
        <img src="../assets/icons/icon.png" width="72" />
        <h4 className="app-name">{ pkg.name }</h4>
        <span className="app-version">版本 { pkg.version }</span>
      </div>
    );
  }
}

export default AboutView;
