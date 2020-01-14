function idGenerator(startId = 1, step = 1) {
  let currentId = startId - step;

  return function generate() {
    currentId += step;
    return currentId;
  };
}

export default idGenerator(1, 1);
