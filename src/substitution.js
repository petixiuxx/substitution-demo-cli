const utils = require('./utils');

class Substitution {
  constructor() {
    this.encrypt = (plaintext, key) => {
      const keyMap = utils.getSubstitutionMapFromKey(key);
      return plaintext
        .replace(/\ +/g, ' ')
        .split(' ')
        .map((s) => utils.stringToNumArray(s))
        .map((na) => na.map((n) => keyMap[n]))
        .map((na) => na.join(''))
        .join(' ');
    };
    this.decrypt = (ciphertext, key) => {
      const keyMap = utils.getSubstitutionMapFromKey(key);
      return ciphertext
        .replace(/\ +/g, ' ')
        .split(' ')
        .map((s) => s.split(''))
        .map((s) => s.map((c) => keyMap.indexOf(c)))
        .map((na) => na.map((n) => utils.ALPHABET[n]))
        .map((na) => na.join(''))
        .join(' ');
    };
  }
}

module.exports = Substitution;

