export default class Storage {
  constructor(data) {
    this.data = data || [];
  }

  getData(filterCallback) {
    if (filterCallback) {
      return this.data.filter(filterCallback);
    }

    return this.data;
  }

  setData(data) {
    this.data = data;
    return this.data;
  }

  getObject(filterCallback) {
    const index = this.data.findIndex(filterCallback);
    return this.data[index];
  }

  addObject(obj) {
    this.data.push(obj);
  }

  removeObject(filterCallback) {
    const index = this.data.findIndex(filterCallback);
    const objectToReturn = this.data[index];
    this.data.splice(index, 1);
    return objectToReturn;
  }

  updateObject(filterCallback, newData) {
    const index = this.data.findIndex(filterCallback);
    const obj = this.data[index];

    Object.keys(newData).forEach((property) => {
      obj[property] = newData[property];
    });
    return this.data;
  }

  saveToLocalStorage(key) {
    localStorage.setItem(key, JSON.stringify(this.data));
  }

  initFromLocalStorage(key) {
    if (localStorage.getItem(key) !== null && JSON.parse(localStorage.getItem(key)).length > 0) {
      this.data = JSON.parse(localStorage.getItem(key));
      return true;
    }
    return false;
  }

  getItemsCount() {
    return this.data.length;
  }

  checkEvery(callback) {
    return this.data.every(callback);
  }

  changeAllData(callback) {
    this.data = this.data.map(callback);
  }
}
