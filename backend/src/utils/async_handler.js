export default function async_handler(cb) {
  return (req, res, next) => Promise.resolve(cb(req, res, next)).catch(next);
}
