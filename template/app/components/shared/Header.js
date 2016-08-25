import React, { PropTypes } from 'react';

const Header = ({ title }) => (
  <header>
    <h1>{title}</h1>
  </header>
);

Header.PropTypes = {
  title: PropTypes.string
};

export default Header;
