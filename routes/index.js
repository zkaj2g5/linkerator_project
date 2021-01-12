const apiRouter = require("express").Router();

const {
  getLinks,
  updateLink,
  updateLinkCount,
  createLink,
  createLinkTag,
  getLinksByTag,
  deleteLinkWithTag,
} = require("../db");

//get request
apiRouter.get("/", (req, res, next) => {
  //console.log("get params", req.params);
  res.send({
    message: "API is under construction!",
  });
});

apiRouter.get("/links", async (req, res, next) => {
  try {
    const allLinks = await getLinks();
    res.send({ allLinks });
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/tags/:tagName/links", async (req, res, next) => {
  const { tagName } = req.params;
  console.log("params", req.params.tagName);

  try {
    console.log("params", req.params.tagName);
    const allLinks = await getLinksByTag(`#${tagName}`);
    res.send({ allLinks });
  } catch (error) {
    next(error);
  }
});

// Post request
apiRouter.post("/links", async (req, res, next) => {
  const { url, comment, name } = req.body;

  try {
    const link = await createLink({ url, comment });
    const tag = await createLinkTag(link.id, name);
    if (link) {
      console.log("created link and tag", link, tag);
      res.send({ link, tag });
    }
  } catch (error) {
    next(error);
  }
});

// Patch request
apiRouter.patch("/links/:id", async (req, res, next) => {
  const { comment } = req.body;
  const { id } = req.params;
  console.log("patch params", req.params.id);
  try {
    console.log("patch params", req.params.id);
    const link = await updateLink(id, comment);
    if (link) {
      console.log("updated link", link);
      res.send({ link });
    }
  } catch (error) {
    next(error);
  }
});

apiRouter.patch("/links/:id/add", async (req, res, next) => {
  const { id } = req.params;
  console.log("patch params", req.params.id);
  try {
    console.log("patch params", req.params.id);
    const link = await updateLinkCount(id);
    if (link) {
      console.log("updated link with new count", link);
      res.send({ link });
    }
  } catch (error) {
    next(error);
  }
});

apiRouter.delete("/links/:linkId", async (req, res, next) => {
  const { linkId } = req.params;
  console.log("linkId", req.params.linkId);

  try {
    console.log("linkId", req.params.linkId);
    const deletedLinks = await deleteLinkWithTag(linkId);
    res.send({ deletedLinks });
  } catch (error) {
    next(error);
  }
});

module.exports = apiRouter;
