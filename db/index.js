// Require the Client constructor from the pg package
const { Client } = require('pg');
require('dotenv').config();
const { KEY, USER } = process.env;

const DB_NAME = 'linkerator-db';
const DB_URL =
  process.env.DATABASE_URL ||
  `postgres://${USER}:${KEY}@localhost:5432/${DB_NAME}`;

// Create the client
const client = new Client(DB_URL);

// database methods
async function getLinks() {
  try {
    // "Bring all links"
    const { rows } = await client.query(`
      SELECT * from links
      `);
    const linkArr = [];
    for (i = 0; i < rows.length; i++) {
      const {
        rows: [tags],
      } = await client.query(
        `
      SELECT * from tags
      WHERE "linkId" IN ($1)
      `,
        [rows[i].id]
      );
      if (tags) {
        rows[i].tags = [tags];
      }
      console.log('tags', tags);
      linkArr.push(rows[i]);
    }
    //console.log("link Array", linkArr);
    // return links
    return linkArr;
  } catch (error) {
    throw error;
  }
}

async function getLinksByTag(tag) {
  try {
    //first load all tags
    const { rows } = await client.query(
      `
    SELECT * from tags
    WHERE "name" = $1
    `,
      [tag]
    );
    if (rows === null) {
      throw new Error('No links exist for that tag');
    }
    const linkArr = [];
    for (i = 0; i < rows.length; i++) {
      const {
        rows: [links],
      } = await client.query(
        `
        SELECT * FROM links
        WHERE "id" IN ($1)
        
      `,
        [rows[i].linkId]
      );
      //console.log("links", links);
      linkArr.push(links);
    }
    return linkArr;
  } catch (error) {
    throw error;
  }
}

async function createLink({ url, comment, clickCount = 0 }) {
  try {
    const {
      rows: [linkCreated],
    } = await client.query(
      `
    INSERT INTO links(url, comment, "clickCount")
    VALUES ($1, $2, $3)
    RETURNING *
    `,
      [url, comment, clickCount]
    );
    // return new link
    return linkCreated;
  } catch (error) {
    throw error;
  }
}

async function _getLink(linkId) {
  try {
    //console.log("_getLink tryblock");
    const { rows } = await client.query(
      `
      SELECT * FROM links
      WHERE "id" = $1
    `,
      [linkId]
    );
    // console.log("rows", rows);
    if (!rows) {
      return null;
    }
    //console.log("before query");
    const {
      rows: [tags],
    } = await client.query(
      `
      SELECT * FROM tags
      WHERE "linkId" IN ($1)
    `,
      [linkId]
    );
    // console.log("_getLinks tag", tags);
    const link = { ...rows[0], tags };
    //console.log("link", link);
    if (tags) {
      link.tags = [tags];
    } else {
      link.tags = [];
    }
    //console.log("tags", tags);
    if (!rows[0]) {
      return null;
    }
    // console.log("link", link);
    // return link
    return link;
  } catch (error) {
    throw error;
  }
}

async function updateLink(linkId, comment) {
  // console.log("update link fields", linkId, comment);
  try {
    // grab link with id
    const retrieveLink = await _getLink(linkId);
    //console.log("retrieve link", retrieveLink, linkId);
    // if link doesnt exist, throw error
    if (retrieveLink === null) {
      throw new Error('link does not exist with that id');
    }
    // update the link
    const {
      rows: [link],
    } = await client.query(
      `
      UPDATE links 
      SET "comment" = $1
      WHERE "id" = $2
      RETURNING *
    `,
      [comment, linkId]
    );
    // console.log("updated link", link);
    // return link
    return link;
  } catch (error) {
    throw error;
  }
}

async function updateLinkCount(linkId) {
  // console.log("update link fields", linkId, comment);
  try {
    // grab link with id
    const retrieveLink = await _getLink(linkId);
    //console.log("retrieve link", retrieveLink, linkId);
    // if link doesnt exist, throw error
    if (retrieveLink === null) {
      throw new Error('link does not exist with that id');
    }
    // update the link
    const {
      rows: [link],
    } = await client.query(
      `
      UPDATE links 
      SET "clickCount" = $1
      WHERE "id" = $2
      RETURNING *
    `,
      [retrieveLink.clickCount + 1, linkId]
    );
    // console.log("updated link", link);
    // return link
    return link;
  } catch (error) {
    throw error;
  }
}

async function createLinkTag(linkId, name) {
  console.log('tag fields', linkId, name);
  try {
    // console.log("inside try block");
    // grab the link
    const retrieveLink = await _getLink(linkId);
    // console.log("retrieve", retrieveLink);
    // if link not found throw error
    if (!retrieveLink) {
      throw new Error('link does not exist, no tag has been created');
    }
    // insert new tag
    // console.log("before adding tags");
    const { rows } = await client.query(
      `
      INSERT INTO tags("linkId", name) 
      VALUES ($1, $2)
      RETURNING *
    `,
      [linkId, name]
    );
    // console.log("create tag", rows);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function deleteLinkWithTag(linkId) {
  console.log('tag fields', linkId);
  try {
    // insert new tag
    // console.log("before adding tags");
    const {
      rows: [tags],
    } = await client.query(
      `
      DELETE from tags
      WHERE "linkId" = $1
      RETURNING *
    `,
      [linkId]
    );

    const {
      rows: [link],
    } = await client.query(
      `
      DELETE from links
      WHERE "id" = $1
      RETURNING *
    `,
      [linkId]
    );
    console.log('deleted tags and link', { tags, link });
    return { tags, link };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  getLinks,
  createLink,
  updateLink,
  updateLinkCount,
  createLinkTag,
  getLinksByTag,
  deleteLinkWithTag,
};
