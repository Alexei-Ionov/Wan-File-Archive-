function handleError(err, req, res, next) {
  console.log(err.stack);
  res.status(500).json({error: err.message});
}
module.exports = handleError;
