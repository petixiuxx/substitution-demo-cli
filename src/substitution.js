const utils = require('./utils');
const { score, mutate, deSubstitute, orderFrequency } = require("./helpers")

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
    this.decrypt = (str, attempts) => {
      var runningKeys = [],
			runningWinner,
			runningWinnerScore; 
      runningKeys.push(orderFrequency(str));
      var scoreVar = score(str,runningKeys);
      runningWinner = scoreVar[0];
      runningWinnerScore = scoreVar[1];
      runningKeys = [runningWinner];
      for (var attempt = 1; attempt < attempts; attempt++) {
        while(runningKeys.length < 20) {
          runningKeys.push(mutate(runningWinner,runningKeys.length));
        } 
        scoreVar = score(str,runningKeys);
        if (scoreVar[1] > runningWinnerScore) {
          runningWinner = scoreVar[0];
          runningWinnerScore = scoreVar[1];
        }
        runningKeys = [runningWinner];
        if (attempt%100===0) console.log('attempt: '+attempt + ' current winner has a score of: ' + runningWinnerScore);
      }
      const plaintext = {
        key:runningWinner,
        decoded: deSubstitute(str, runningWinner)
      };
      return plaintext.decoded;
    };
  }
}

module.exports = Substitution;

