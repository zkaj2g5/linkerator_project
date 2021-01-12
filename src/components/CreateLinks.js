import React, { useState } from 'react';
import { Input } from 'semantic-ui-react';
import { createLinksWithTags } from '../api';

const CreateLinks = () => {
  const [linkData, setLinkData] = useState({
    url: '',
    comment: '',
    name: '',
  });

  const sendLink = (event) => {
    event.preventDefault();
    createLinksWithTags(linkData.url, linkData.comment, linkData.name)
      .then((result) => {
        console.log('created links with tag', result);
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
  };
  const handleChanges = (event) => {
    setLinkData({ ...linkData, [event.target.name]: event.target.value });
  };
  console.log('linkData', linkData);
  return (
    <div className='form-box create-link form-container flexbox-column'>
      <div className='nes-field'>
        <Input
          className='nes-input is-success'
          name='url'
          value={linkData.url}
          onChange={handleChanges}
          placeholder='Links go here...'
        />
        <Input
          className='nes-input is-warning'
          name='comment'
          value={linkData.comment}
          onChange={handleChanges}
          placeholder='Comments go here...'
        />
        <Input
          className='nes-input is-error'
          name='name'
          value={linkData.name}
          onChange={handleChanges}
          placeholder='#Tag'
        />
      </div>
      <button
        className='nes-btn'
        onClick={sendLink}
        disabled={linkData.url.length < 1}
      >
        {' '}
        Equip
      </button>
    </div>
  );
};

export default CreateLinks;
