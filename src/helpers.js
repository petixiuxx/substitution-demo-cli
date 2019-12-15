const mostCommon = require("./dictionary")

function deSubstitute(str, key) {
    return str.split("").map(letter => {
        if (letter.match(/^[a-z]*$/g)) {
            return String.fromCharCode(key.indexOf(letter)+97);
        }
        else if (letter.match(/^[A-Z]*$/g)) {
            return String.fromCharCode(key.indexOf(letter.toLowerCase())+65);
        }
        return letter;
    }).join("");
}

function score(str, keyArr) {
    var winnerIndex = 0;
    var winnerScore = 0;
    str = str.toLowerCase();
    for (var k = 0; k < keyArr.length; k++) {
        var ds = deSubstitute(str,keyArr[k]);
        var score = 0;
        for (var i = 0, len = mostCommon.length; i < len; i++) {
            if (ds.indexOf(' '+mostCommon[i].toLowerCase()+' ') > -1) {
                score++;
            }
        }
        if (score > winnerScore) {
            winnerScore = score;
            winnerIndex = k;
        }
    }
    return [keyArr[winnerIndex], winnerScore];
}
function mutate(arr,amount) {
    var newCopy = arr.slice(0);
    for (var i = 0; i < amount; i++) {		
        var pos1=Math.floor(Math.random() * newCopy.length),
            pos2=Math.floor(Math.random() * newCopy.length),
            temp=newCopy[pos2];
        newCopy[pos2]=newCopy[pos1];
        newCopy[pos1]=temp;
    }
    return newCopy;
}

function getMatchIndexes(str, toMatch) {
    var toMatchLength = toMatch.length,
        indexMatches = [], match,
        i = 0;
    while ((match = str.indexOf(toMatch, i)) > -1) {
        indexMatches.push(match);
        i = match + toMatchLength;
    }
    return indexMatches;
}

function orderFrequency(str){
    var countObj = [];
    str = str.toLowerCase();
    var baseCharFreq = [{freq:0.08,letter:'a'},{freq:0.015,letter:'b'},{freq:0.025,letter:'c'},{freq:0.044,letter:'d'},{freq:0.126,letter:'e'},{freq:0.024,letter:'f'},{freq:0.02,letter:'g'},{freq:0.063,letter:'h'},{freq:0.07,letter:'i'},{freq:0.0014,letter:'j'},{freq:0.0074,letter:'k'},{freq:0.04,letter:'l'},{freq:0.025,letter:'m'},{freq:0.07,letter:'n'},{freq:0.076,letter:'o'},{freq:0.018,letter:'p'},{freq:0.001,letter:'q'},{freq:0.06,letter:'r'},{freq:0.063,letter:'s'},{freq:0.08,letter:'t'},{freq:0.028,letter:'u'},{freq:0.009,letter:'v'},{freq:0.02,letter:'w'},{freq:0.0017,letter:'x'},{freq:0.02,letter:'y'},{freq:0.0008,letter:'z'}];
    for (var i = 0; i < 26; i++) {
        countObj.push({
            letter:String.fromCharCode(i+97),
            count:getMatchIndexes(str,String.fromCharCode(i+97)).length,
            guessLetter:0,
            origOrder:i
        });
    }
    baseCharFreq.sort(function(a, b){
        if(a.freq < b.freq) return 1;
        if(a.freq > b.freq) return -1;
        return 0;
    });
    countObj.sort(function(a, b){
        if(a.count < b.count) return 1;
        if(a.count > b.count) return -1;
        return 0;
    });
    for (var j = 0; j < countObj.length; j++) {
        countObj[j].guessLetter = baseCharFreq[j].letter;
    }
    countObj.sort(function(a, b){
        if(a.guessLetter > b.guessLetter) return 1;
        if(a.guessLetter < b.guessLetter) return -1;
        return 0;
    });
    var guessKey = [];
    for (var i = 0; i < countObj.length; i++) {
        guessKey.push(countObj[i].letter);
    }
    return guessKey;
}
module.exports = { orderFrequency, deSubstitute, score, mutate}