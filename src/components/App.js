import React, { useState, useEffect } from 'react';
import Routes from './utils/Routes';
import './styles.css';

import { getLinks } from '../api';

const App = () => {
  const [links, setLinks] = useState({});

  useEffect(() => {
    getLinks().then((response) => {
      console.log(response.allLinks);
      setLinks(response.allLinks);
    });
  }, []);

  console.log('links', links);

  return (
    <>
      <Routes />
    </>
  );
};

export default App;
