
export default class Storage {
  constructor(data) {
    this.data = data || [];
  }

  getData() {
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

  removeObject(obj) {
    const index = this.data
      .findIndex((element) => JSON.stringify(element) === JSON.stringify(obj));
    this.data.splice(index, 1);
    return this.data;
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
    if (localStorage.getItem(key) !== null) {
      this.data = JSON.parse(localStorage.getItem(key));
      return true;
    }
    return false;
  }
}
