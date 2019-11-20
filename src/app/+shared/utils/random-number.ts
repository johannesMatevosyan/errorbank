
export class RandomNumber {
  random;
  getRandomNumber() {
    this.random = Math.floor(Math.random() * 100) + 2 + "" + new Date().getTime() +
      Math.floor(Math.random() * 100) + 2 +
      (Math.random().toString(36).replace(/[^a-zA-Z]+/g, '').substr(0, 7));
    return this.random;
  }
}
