module.exports = {
  returnResponse: (res, status, error, msg, data) =>
    res.status(status).json({ error, status, msg, data }),
  // **********************************************************************
};
