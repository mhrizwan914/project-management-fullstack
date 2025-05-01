export default function async_handler(cb) {
  return function (req, res, next) {
    Promise.resolve(cb(req, res, next)).catch((error) => next(error));
  };
}
