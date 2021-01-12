// code to build and initialize DB goes here
const {
  client,
  getLinks,
  createLink,
  updateLink,
  createLinkTag,
  getLinksByTag,
  // other db methods
} = require('./index');

async function dropTables() {
  try {
    console.log('Starting to drop tables');
    client.query(`
    DROP TABLE if EXISTS tags;
    DROP TABLE if EXISTS links;
    `);
    console.log('Finished dropping tables');
  } catch (error) {
    throw error;
  }
}

async function buildTables() {
  try {
    client.connect();

    // drop tables in correct order
    await dropTables();
    // build tables in correct order
    console.log('Starting to build tables');
    await client.query(`
    CREATE TABLE links (
      id SERIAL PRIMARY KEY,
      url varchar (255) NOT NULL UNIQUE,
      "clickCount" INTEGER NOT NULL,
      comment TEXT NOT NULL,
      "dateShared" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      "linkId" INTEGER REFERENCES links(id),
      name TEXT NOT NULL
    )
    `);
    console.log('finished building tables');
  } catch (error) {
    throw error;
  }
}

async function createInitialLinks() {
  try {
    // create links
    console.log('Attempting to create links');
    const linkOne = await createLink({
      url: 'https://www.google.com',
      comment: 'Google search engine',
    });

    const linkTwo = await createLink({
      url: 'https://www.roblox.com',
      comment: 'Roblox game',
    });

    const linkThree = await createLink({
      url: 'https://www.xvideos.com',
      comment: 'Adult website',
    });

    console.log('Successfully created links');
    return [linkOne, linkTwo, linkThree];
  } catch (error) {
    console.error('Error while creating links');
    throw error;
  }
}

async function getUpdatedLinks(initialLinks) {
  const [linkOne, linkTwo, linkThree] = initialLinks;
  console.log('Get updated links One', linkOne);
  try {
    //update links
    console.log('Trying to update links');
    linkOneComment = { comment: 'This is an updated link one comment.' };
    const updatedLinkOne = await updateLink(linkOne.id, linkOneComment.comment);

    linkTwoComment = { comment: 'This is an updated link two comment.' };
    const updatedLinkTwo = await updateLink(linkTwo.id, linkTwoComment.comment);

    linkThreeComment = { comment: 'This is an updated link three comment.' };
    const updatedLinkThree = await updateLink(
      linkThree.id,
      linkThreeComment.comment
    );
    console.log('success updating links');
    return [updatedLinkOne, updatedLinkTwo, updatedLinkThree];
  } catch (error) {
    console.error('error while updating links');
    throw error;
  }
}

async function getTagLinks(tag) {
  try {
    //get links by tag
    console.log('trying to retrieve links by tag');
    const allLinks = await getLinksByTag(tag);
    console.log('success retrieving links by tag');
    return allLinks;
  } catch (error) {
    console.error('error retrieving links by tag');
    throw error;
  }
}

async function createInitialTags(initialLinks) {
  const [linkOne, linkTwo, linkThree] = initialLinks;

  try {
    // create tags
    console.log('trying to create tags');
    const tagOne = await createLinkTag(linkOne.id, '#google');
    console.log('tag1', tagOne);
    const tagTwo = await createLinkTag(linkTwo.id, '#roblox');
    const tagThree = await createLinkTag(linkThree.id, '#xvideos');
    console.log('success creating tags');
    return [tagOne, tagTwo, tagThree];
  } catch (error) {
    console.error('error while creating tags');
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data
    console.log('filling with database with initial data');
    const links = await createInitialLinks();
    await createInitialTags(links);
    console.log('filled database and need to do testing');
    console.log('getting all links: \n', await getLinks());
    console.log('updating all links: \n', await getUpdatedLinks(links));
    console.log('getting all links: \n', await getLinks());

    console.log('grabbing all links by tag: \n', await getTagLinks('#google'));

    console.log('finished filling database');
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
