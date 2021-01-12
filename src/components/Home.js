import React, { useState, useEffect } from 'react';
import CreateLinks from './CreateLinks';
import { Card, Input } from 'semantic-ui-react';
import { getLinks, addClick, deleteLink } from '../api';

const Home = (props) => {
  console.log(props);
  const [links, setLinks] = useState();
  const [copyLinks, setCopyLinks] = useState();
  const [search, setSearch] = useState('');

  const handleChanges = (event) => {
    console.log(event.target.value);
    setSearch(event.target.value);
    console.log(search);
    searchLinks(event.target.value);
  };
  console.log(search);

  useEffect(() => {
    getLinks()
      .then((response) => {
        console.log(response.allLinks);
        setLinks(response.allLinks);
        setCopyLinks(response.allLinks);
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
  }, []);

  const searchLinks = (searchTerm) => {
    console.log('search term', searchTerm);
    const filteredLinks = copyLinks.filter((link) => {
      return (
        link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.tags[0].name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setLinks(filteredLinks);
    console.log('filtered links', filteredLinks);
  };

  const searchTag = (searchTerm) => {
    setSearch(searchTerm);
    console.log('search term2', searchTerm);
    const filteredLinks = copyLinks.filter((link) => {
      return link.tags[0].name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setLinks(filteredLinks);
    console.log('filtered links2', filteredLinks);
  };

  const filterPopular = () => {
    const filteredLinks = copyLinks.sort((a, b) => {
      return b.clickCount - a.clickCount;
    });
    setLinks([...filteredLinks]);
  };

  const addCount = (id) => {
    console.log(id);
    addClick(id)
      .then((response) => {
        console.log(response);
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
  };

  const removeLink = (id) => {
    deleteLink(id);
    window.location.reload(false);
  };

  console.log('links', links);

  return (
    <>
      <div className='home-top'>
        <h1 class='nes-icon trophy is-large'></h1>
        <h1 class='nes-icon trophy is-large'></h1>
        <h1 class='nes-icon trophy is-large'></h1>
        <h1 className='myTitle'>Favorites Keeper</h1>
      </div>

      <CreateLinks />
      <div className='flexbox-search'>
        <div className='nes-input'>
          <Input placeholder='Search' value={search} onChange={handleChanges} />
        </div>
        <div>
          <button
            type='button'
            className='nes-btn is-success'
            onClick={filterPopular}
          >
            Most Popular
          </button>
        </div>
      </div>
      <div className='home'>
        <div className='flexbox-column'>
          <div className='link-listings'>
            {links
              ? links.map((link) => {
                  const date = new Date(link.dateShared);
                  return (
                    <div key={link.id} className='link-card'>
                      <Card>
                        <Card.Content style={{ border: 'none' }}>
                          <Card.Header className='trash-can'>
                            <a
                              href={
                                !link.url.indexOf('http')
                                  ? `${link.url}`
                                  : `https://${link.url}`
                              }
                              target='_blank'
                              rel='noopener noreferrer'
                              onClick={() => addCount(link.id)}
                            >
                              {link.url}
                            </a>
                            <i
                              className='nes-icon close is-small'
                              onClick={() => removeLink(link.id)}
                            ></i>
                          </Card.Header>
                          <div>
                            <b>Date:</b>&nbsp;
                            {date.toDateString()}
                          </div>
                          <div>
                            <b>Hits:</b> &nbsp;
                            {link.clickCount}
                          </div>
                          <div className='flexbox-wrap'>
                            <b>Tags:</b> &nbsp;
                            {link.tags.map((tag) => {
                              return tag.name.split(',').map((name) => {
                                console.log('tagname', name);
                                return (
                                  <span
                                    className='tag'
                                    onClick={() => searchTag(name)}
                                  >
                                    {name}
                                  </span>
                                );
                              });
                            })}
                          </div>
                        </Card.Content>
                        <Card.Description>
                          <b>Comments</b> {link.comment}
                        </Card.Description>
                      </Card>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
