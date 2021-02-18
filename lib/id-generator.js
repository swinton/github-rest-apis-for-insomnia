function idGenerator (kind, initial = 1, increment = 1) {
  let current = initial;
  return function generateId () {
    const id = `__${kind}_${current}__`;
    current += increment;
    return id;
  };
}
module.exports.idGenerator = idGenerator;
