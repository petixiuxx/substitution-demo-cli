// ------------------------------------- UTILITY FUNCTIONS ------------------------------------- //

//Replace a character at a given index in a string
//from http://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
//called in functions: @enCaesar
String.prototype.replaceAt=function(index, character) {
	return this.substr(0, index) + character + this.substr(index+character.length);
}

//get the index of all occurences of substr in string
//from http://stackoverflow.com/questions/16897772/looping-through-string-to-find-multiple-indexes
//called in functions: @orderFrequency
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

//generate a random arrangement of the alphabet
//base code from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
//called in functions: @geneticSubstitutionCrack
function shuffle() {
	var newArr= ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
		var currentIndex = newArr.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = newArr[currentIndex];
		newArr[currentIndex] = newArr[randomIndex];
		newArr[randomIndex] = temporaryValue;
  }
  return newArr;
}

//shift a string's letters by x amount (Caesar Cipher)
//technically a cipher function, but I have it up here because it's not a cipher function for this cipher
//called in functions: @geneticSubstitutionCrack
function enCaesar(str,shift) {
	//str - string to be encrypted
	//shift - number 1 - 25 to shift letters to show encoded message
	for (var i = 0, len = str.length; i < len; i++) { //for each char in string
		for (var j = 0, len2 = shift; j < len2; j++) { //increment one at a time (easier to loop at z)
			if (str[i].match(/^[a-yA-Y]*$/gi) !== null) {
				str = str.replaceAt(i, String.fromCharCode(str[i].charCodeAt(0) + 1));//increment char by 1
			}
			else if (str[i].match(/^[zZ]*$/) !== null) {
				str = str.replaceAt(i, String.fromCharCode(str[i].charCodeAt(0) - 25));//if z circle back to a
			}
		}
	}
	return str;
}

function highestCount(arr) {
	var winnerCount = 0;
	var winner = arr[0];
	for (var i = 0; i < arr.length; i++) {
		var count = 0;
		for (var j = 0; j < arr.length; j++) {
			if (j != i && arr[j] == arr[i]) {
				count++;
			}
		};
		if (count > winnerCount) {
			winner = arr[i];
			winnerCount = count;
		}
	};
	return winner;
}

// ------------------------------------- CIPHER FUNCTIONS ------------------------------------- //

//input str - string - to be encoded
//input key - array - to be encoded by
//return - encoded string 
function enSubstitute(str,key){
	result=str.split('');
	for (var i = 0; i < result.length; i++) {
		if (result[i].match(/^[a-z]*$/g) !== null) {
			result[i]=key[result[i].charCodeAt(0) -97];
		}
		else if (result[i].match(/^[A-Z]*$/g) !== null) {
			result[i]=key[result[i].charCodeAt(0) -65].toUpperCase();
		}
	};
	return result.join('');
}

//input str - string - to be decoded
//input key - array - to be decoded by
//return - decoded string 
function deSubstitute(str,key){
	result=str.split('');
	for (var i = 0; i < result.length; i++) {
		if (result[i].match(/^[a-z]*$/g) !== null) {
			result[i]=String.fromCharCode(key.indexOf(result[i])+97);
		}
		else if (result[i].match(/^[A-Z]*$/g) !== null) {
			result[i]=String.fromCharCode(key.indexOf(result[i].toLowerCase())+65);
		}
	};
	return result.join('');
}

//input str - string - to be analyzed
//return - array - the key to this cipher if letters are perfectly arranged by expected freq analysis
function orderFrequency(str){
	var countObj = [];
	str = str.toLowerCase()
	var baseCharFreq = [{freq:.08,letter:'a'},{freq:.015,letter:'b'},{freq:.025,letter:'c'},{freq:.044,letter:'d'},{freq:.126,letter:'e'},{freq:.024,letter:'f'},{freq:.02,letter:'g'},{freq:.063,letter:'h'},{freq:.07,letter:'i'},{freq:.0014,letter:'j'},{freq:.0074,letter:'k'},{freq:.04,letter:'l'},{freq:.025,letter:'m'},{freq:.07,letter:'n'},{freq:.076,letter:'o'},{freq:.018,letter:'p'},{freq:.001,letter:'q'},{freq:.06,letter:'r'},{freq:.063,letter:'s'},{freq:.08,letter:'t'},{freq:.028,letter:'u'},{freq:.009,letter:'v'},{freq:.02,letter:'w'},{freq:.0017,letter:'x'},{freq:.02,letter:'y'},{freq:.0008,letter:'z'}];
		for (var i = 0; i < 26; i++) {
		countObj.push(
		{
			letter:String.fromCharCode(i+97),
			count:getMatchIndexes(str,String.fromCharCode(i+97)).length,
			guessLetter:0,
			origOrder:i
		}
		);
	}
	baseCharFreq.sort(function(a, b){
		if(a.freq < b.freq) return 1;
		if(a.freq > b.freq) return -1;a
		return 0;
	});
	//console.log(baseCharFreq);
	countObj.sort(function(a, b){
		if(a.count < b.count) return 1;
		if(a.count > b.count) return -1;
		return 0;
	});
	//console.log(baseCharFreq);
	for (var j = 0; j < countObj.length; j++) {
		//countObj[j].guessLetter =String.fromCharCode(i+97);
		countObj[j].guessLetter = baseCharFreq[j].letter;
	};
	countObj.sort(function(a, b){
		if(a.guessLetter > b.guessLetter) return 1;
		if(a.guessLetter < b.guessLetter) return -1;
		return 0;
	});
	var guessKey = [];
	for (var i = 0; i < countObj.length; i++) {
		guessKey.push(countObj[i].letter);
	};
	return guessKey;
}

//modifies our 'perfect universe' order frequency answer by assuming that the most commom 3 letter word in the text is 'the', and the second most common is 'and'
function findThe(str, perfectUniverse) {
	arr = str.split(' ');
	var filtered = arr.filter(function(value){return value.length == 3});
	var the = highestCount(filtered);
	var andfiltered = [];
	for (var i = 0; i < filtered.length; i++) {
		if (filtered[i] != the){
			andfiltered.push(filtered[i]);
		}
	};
	var and = highestCount(andfiltered);
	console.log('I think the is represented by '+the+', and and is represented by '+and);
	var alph = '!!!!!!!!!!!!!!!!!!!!!!!!!!!'.split('');
	//r alph = 'abcdefghijklmnopqrstuvwxyz'
	alph[0] = and.split('')[0];
	alph[3] = and.split('')[2];
	alph[13] = and.split('')[1];
	alph[4] = the.split('')[2];
	alph[7] = the.split('')[1];
	alph[19] = the.split('')[0];
	for (var j = 0; j < alph.length; j++) {
		if (alph[j] != '!'){
			var index = perfectUniverse.indexOf(alph[j].toLowerCase());
			perfectUniverse[index]= perfectUniverse[j];
			perfectUniverse[j] = alph[j];
		}
	};
	return perfectUniverse.map(function(x){return x.toLowerCase()});
}


//some global variables, so as not to define them on every iteration
var mostCommon = ['the','of','to','and','a','in','is','it','you','that','he','was','for','on','are','with','as','I','his','they','be','at','one','have','this','from','or','had','by','hot','word','but','what','some','we','can','out','other','were','all','there','when','up','use','your','how','said','an','each','she','which','do','their','time','if','will','way','about','many','then','them','write','would','like','so','these','her','long','make','thing','see','him','two','has','look','more','day','could','go','come','did','number','sound','no','most','people','my','over','know','water','than','call','first','who','may','down','side','been','now','find','any','new','work','part','take','get','place','made','live','where','after','back','little','only','round','man','year','came','show','every','good','me','give','our','under','name','very','through','just','form','sentence','great','think','say','help','low','line','differ','turn','cause','much','mean','before','move','right','boy','old','too','same','tell','does','set','three','want','air','well','also','play','small','end','put','home','read','hand','port','large','spell','add','even','land','here','must','big','high','such','follow','act','why','ask','men','change','went','light','kind','off','need','house','picture','try','us','again','animal','point','mother','world','near','build','self','earth','father','head','stand','own','page','should','country','found','answer','school','grow','study','still','learn','plant','cover','food','sun','four','between','state','keep','eye','never','last','let','thought','city','tree','cross','farm','hard','start','might','story','saw','far','sea','draw','left','late','run','dont','while','press','close','night','real','life','few','north','open','seem','together','next','white','children','begin','got','walk','example','ease','paper','group','always','music','those','both','mark','often','letter','until','mile','river','car','feet','care','second','book','carry','took','science','eat','room','friend','began','idea','fish','mountain','stop','once','base','hear','horse','cut','sure','watch','color','face','wood','main','enough','plain','girl','usual','young','ready','above','ever','red','list','though','feel','talk','bird','soon','body','dog','family','direct','pose','leave','song','measure','door','product','black','short','numeral','class','wind','question','happen','complete','ship','area','half','rock','order','fire','south','problem','piece','told','knew','pass','since','top','whole','king','space','heard','best','hour','better','true .','during','hundred','five','remember','step','early','hold','west','ground','interest','reach','fast','verb','sing','listen','six','table','travel','less','morning','ten','simple','several','vowel','toward','war','lay','against','pattern','slow','center','love','person','money','serve','appear','road','map','rain','rule','govern','pull','cold','notice','voice','unit','power','town','fine','certain','fly','fall','lead','cry','dark','machine','note','wait','plan','figure','star','box','noun','field','rest','correct','able','pound','done','beauty','drive','stood','contain','front','teach','week','final','gave','green','oh','quick','develop','ocean','warm','free','minute','strong','special','mind','behind','clear','tail','produce','fact','street','inch','multiply','nothing','course','stay','wheel','full','force','blue','object','decide','surface','deep','moon','island','foot','system','busy','test','record','boat','common','gold','possible','plane','stead','dry','wonder','laugh','thousand','ago','ran','check','game','shape','equate','hot','miss','brought','heat','snow','tire','bring','yes','distant','fill','east','paint','language','among','grand','ball','yet','wave','drop','heart','am','present','heavy','dance','engine','position','arm','wide','sail','material','size','vary','settle','speak','weight','general','ice','matter','circle','pair','include','divide','syllable','felt','perhaps','pick','sudden','count','square','reason','length','represent','art','subject','region','energy','hunt','probable','bed','brother','egg','ride','cell','believe','fraction','forest','sit','race','window','store','summer','train','sleep','prove','lone','leg','exercise','wall','catch','mount','wish','sky','board','joy','winter','sat','written','wild','instrument','kept','glass','grass','cow','job','edge','sign','visit','past','soft','fun','bright','gas','weather','month','million','bear','finish','happy','hope','flower','clothe','strange','gone','jump','baby','eight','village','meet','root','buy','raise','solve','metal','whether','push','seven','paragraph','third','shall','held','hair','describe','cook','floor','either','result','burn','hill','safe','cat','century','consider','type','law','bit','coast','copy','phrase','silent','tall','sand','soil','roll','temperature','finger','industry','value','fight','lie','beat','excite','natural','view','sense','ear','else','quite','broke','case','middle','kill','son','lake','moment','scale','loud','spring','observe','child','straight','consonant','nation','dictionary','milk','speed','method','organ','pay','age','section','dress','cloud','surprise','quiet','stone','tiny','climb','cool','design','poor','lot','experiment','bottom','key','iron','single','stick','flat','twenty','skin','smile','crease','hole','trade','melody','trip','office','receive','row','mouth','exact','symbol','die','least','trouble','shout','except','wrote','seed','tone','join','suggest','clean','break','lady','yard','rise','bad','blow','oil','blood','touch','grew','cent','mix','team','wire','cost','lost','brown','wear','garden','equal','sent','choose','fell','fit','flow','fair','bank','collect','save','control','decimal','gentle','woman','captain','practice','separate','difficult','doctor','please','protect','noon','whose','locate','ring','character','insect','caught','period','indicate','radio','spoke','atom','human','history','effect','electric','expect','crop','modern','element','hit','student','corner','party','supply','bone','rail','imagine','provide','agree','thus','capital','wont','chair','danger','fruit','rich','thick','soldier','process','operate','guess','necessary','sharp','wing','create','neighbor','wash','bat','rather','crowd','corn','compare','poem','string','bell','depend','meat','rub','tube','famous','dollar','stream','fear','sight','thin','triangle','planet','hurry','chief','colony','clock','mine','tie','enter','major','fresh','search','send','yellow','gun','allow','print','dead','spot','desert','suit','current','lift','rose','continue','block','chart','hat','sell','success','company','subtract','event','particular','deal','swim','term','opposite','wife','shoe','shoulder','spread','arrange','camp','invent','cotton','born','determine','quart','nine','truck','noise','level','chance','gather','shop','stretch','throw','shine','property','column','molecule','select','wrong','gray','repeat','require','broad','prepare','salt','nose','plural','anger','claim','continent','oxygen','sugar','death','pretty','skill','women','season','solution','magnet','silver','thank','branch','match','suffix','especially','fig','afraid','huge','sister','steel','discuss','forward','similar','guide','experience','score','apple','bought','led','pitch','coat','mass','card','band','rope','slip','win','dream','evening','condition','feed','tool','total','basic','smell','valley','nor','double','seat','arrive','master','track','parent','shore','division','sheet','substance','favor','connect','post','spend','chord','fat','glad','original','share','station','dad','bread','charge','proper','bar','offer','segment','slave','duck','instant','market','degree','populate','chick','dear','enemy','reply','drink','occur','support','speech','nature','range','steam','motion','path','liquid','log','meant','quotient','teeth','shell','neck'];//from https://gist.github.com/deekayen/4148741\
//filtering down to 2+ letter words
mostCommon = mostCommon.filter(function(item) {
    return item.length>1;
});
var diGraphs= ['th','he','in','er','an','re','nd','at','on','nt','ha','es','st','en','ed','to','it','ou'];

//input str - string - to look for words
//input any - returnLog - if anything is passed, it will return an array containing all found words
//return - integer - number of top 1000 words matched in string
function wordMatchr(str,returnLog) {
	str = str.toLowerCase();//clean the string. This makes false positives more common, but allows us to effectively search if the spaces are broken up incorrectly 
	var occurrences = 0;
	var diGraphCount = 0;
	var logger=[];
	for (var i = 0, len = mostCommon.length; i < len; i++) {
		if (str.indexOf(' '+mostCommon[i].toLowerCase()+' ') > -1) {
			occurrences++;
			if (returnLog !== undefined) logger.push(mostCommon[i]);
		}
	}
	for (var j = 0; j < diGraphs.length; j++) {
		diGraphCount+=getMatchIndexes(str,diGraphs[j]).length
	};
	if (returnLog !== undefined) {
		return [parseInt(occurrences + (diGraphCount/10)),logger];
	} 
	return (parseInt(occurrences + (diGraphCount/10)));
}

//input str - string - to be scored
//input keyArr - array - array of keys to be analyzed
//return - array - index of highest scored key, and it's score
var winnerLog = [];
function score(str, keyArr) {
	var winnerIndex = 0,
		winnerScore = 0;
	for (var k = 0; k < keyArr.length; k++) {
		winnerLog = [];
		var ds = deSubstitute(str,keyArr[k]);
		var wm = wordMatchr(ds,1);
		var score= wm[0];
		if (score > winnerScore) {
			winnerScore = score;
			winnerIndex = k;
			winnerLog = wm[1];
		}
	};
	return [keyArr[winnerIndex], winnerScore];
}

//input arr - array - to be mutated
//input amount - integer - amount to mutate by
//return - array - mutated array
function mutate(arr,amount) {
	var newCopy = arr.slice(0);
	for (var i = 0; i < amount; i++) {		
		var pos1=Math.floor(Math.random() * newCopy.length),
			pos2=Math.floor(Math.random() * newCopy.length),
			temp=newCopy[pos2];
		newCopy[pos2]=newCopy[pos1];
		newCopy[pos1]=temp;
	}
	return newCopy
}

function highlight(str) {
	if (winnerLog.length > 0){
		var re = new RegExp(' '+winnerLog.join(' | ')+' ', 'gi');
		console.log(re);
		return str.replace(re, '<span class="highlight">$&</span>');
	}
	return str;
}

//input str - string - to be cracked
//return - array - best guess at the key that will correctly decipher str
function geneticSubstitutionCrack(str,cap) {
	var revolutionCount = 0;
	var revolutionHolder = [];
	var winner = 0;
	var perfectUniverse = orderFrequency(str);
	var theAnd = findThe(str, perfectUniverse);
	var testSolutions = [perfectUniverse, theAnd];
	for (var i = 0; testSolutions.length < 20; i++) {
		testSolutions.push(shuffle());
	};
	var alphabet = 'abcdefghijklmnopqrstuvwxyz';
	for (var z = 0; z < 26; z++) {
		testSolutions.push(enCaesar(alphabet,z).split(''));
	};
	var scored=score(str,testSolutions);
	winner=scored[0];
	var timesSinceChange = 5;
	var breakCounter = 0;

	//looping this way allows you to update the page on each iteration
	var j=0;
	function myLoop(){
		testSolutions = [];
		for (var i = 0; testSolutions.length < 19; i++) {
			testSolutions.push(mutate(winner,parseInt(timesSinceChange/5)));
		};
		testSolutions.push(shuffle());
		testSolutions.push(winner);
		var lastScored = scored[1];
		scored=score(str,testSolutions);
		winner=scored[0];
		if (scored[1] == lastScored && timesSinceChange<(cap/5)) { //cap at 50, we don't want too much mutation, then it becomes too random
			timesSinceChange++;
		}
		// else if (breakCounter > 50) {
		// 	console.log('too long without advancing, breaking');
		// 	j=cap;
		// }
		else{
			timesSinceChange=5;
			breakCounter++;
		}
		var percent = ((j+(revolutionCount*cap/5))/cap)*100;
		$('.progress').css('width',percent+'%');
		var evaluated = highlight(deSubstitute($('.ciphertext').val(), winner));
		console.log(evaluated);
		$('.result').html('<strong>CURRENT PROGRESS:</strong> '+(j+(revolutionCount*cap/5))+' out of ' +cap+' (revolution: '+(revolutionCount+1)+')<br/><strong>CURRENT WINNER IS:</strong> '+winner+'<br/><strong>WITH A SCORE OF: </strong>'+scored[1]+'<br/><strong>WHICH EVALUATES TO:</strong> '+evaluated);
		j++;
		if(j<cap/5){
			setTimeout(myLoop,0);
		}
		else if(revolutionCount < 4) {
			revolutionHolder.push(winner);
			var testSolutions = [perfectUniverse, theAnd];
			for (var i = 0; testSolutions.length < 20; i++) {
				testSolutions.push(shuffle());
			};
			for (var z = 0; z < 26; z++) {
				testSolutions.push(enCaesar(alphabet,z).split(''));
			};
			scored=score(str,testSolutions);
			winner=scored[0];
			revolutionCount++;		
			j = 0;	
			setTimeout(myLoop,0);
		}
		else {
			revolutionHolder.push(winner);
			console.log(revolutionHolder);
			scored = score(str,revolutionHolder);
			winner=scored[0];
			var asdf = score(str,[winner]);
			$('.progress').css('width','100%');
			var evaluated = highlight(deSubstitute($('.ciphertext').val(), winner));
			$('.result').html('<strong>FINAL WINNER IS: </strong>'+winner+'<br/><strong>WITH A SCORE OF: </strong>'+scored[1]+'<br/><strong>WHICH EVALUATES TO: </strong>'+evaluated);
		}
	}
	myLoop();
}

// ------------------------------------- DISPLAY FUNCTIONS ------------------------------------- //
$('.decode').click(function(){
	console.log('running');
	console.log($('.ciphertext').val());
	console.log($('.key').val().split(''));
	if($('.function').find('option:selected').val() == 'encode') {
		$('.result').text(enSubstitute($('.ciphertext').val(), $('.key').val().split('')));
	}
	else if($('.function').find('option:selected').val() == 'decode') {
		$('.result').text(deSubstitute($('.ciphertext').val(), $('.key').val().split('')));
	}
	else if($('.function').find('option:selected').val() == 'crack') {
		geneticSubstitutionCrack($('.ciphertext').val(), $('.turns').val());
	}
	else {
		alert('error no function selected');
	}
	$("html, body").animate({ scrollTop: $(document).height() }, "slow");
});

$('.function').change(function(){
	if($('.function').find('option:selected').val() == 'crack') {
		$('.key').hide();
		$('.keylabel').hide();
		$('.turns').show();
		$('.turnslabel').show();
		$('.sample').attr('style','display:block;');
	}
	else {
		$('.key').attr('style','display:block;');
		$('.keylabel').show();
		$('.turns').hide();
		$('.turnslabel').hide();
		$('.sample').hide();
	}
});

$('.sample1').click(function(){
	//from http://simonsingh.net/cryptography/cipher-challenge/the-ciphertexts/stage-1/
	$('.ciphertext').val('BT JPX RMLX PCUV AMLX ICVJP IBTWXVR CI M LMT’R PMTN, MTN YVCJX CDXV MWMBTRJ JPX AMTNGXRJBAH UQCT JPX QGMRJXV CI JPX YMGG CI JPX HBTW’R QMGMAX; MTN JPX HBTW RMY JPX QMVJ CI JPX PMTN JPMJ YVCJX. JPXT JPX HBTW’R ACUTJXTMTAX YMR APMTWXN, MTN PBR JPCUWPJR JVCUFGXN PBL, RC JPMJ JPX SCBTJR CI PBR GCBTR YXVX GCCRXN, MTN PBR HTXXR RLCJX CTX MWMBTRJ MTCJPXV. JPX HBTW AVBXN MGCUN JC FVBTW BT JPX MRJVCGCWXVR, JPX APMGNXMTR, MTN JPX RCCJPRMEXVR. MTN JPX HBTW RQMHX, MTN RMBN JC JPX YBRX LXT CI FMFEGCT, YPCRCXDXV RPMGG VXMN JPBR YVBJBTW, MTN RPCY LX JPX BTJXVQVXJMJBCT JPXVXCI, RPMGG FX AGCJPXN YBJP RAM')
});
$('.sample2').click(function(){
	//from moby dick at project gutenberg
	$('.ciphertext').val('Peciwsu bvp rkbp olkgwsu spkl ke vp gke btwzwsu kb bvp cdrc gwbv bvp lpeb bvp Zkyprks kqqpnbpo stb bt stbwnp vwr, mdb dskgpo, gpsb ts gwbv vwe uki mksbplwsue. Kip, kip, ri rplli zkoe, wbe k zwfpzi zpky bvwe; vtzo k nksswyws, tsp tq ip, kso zpbe vkfp k bkebp. Mi bvp Ztlo, wbe gtlbv mtbbzwsu! W bpzz ip gvkb, rps, tzo Lkoe wsfpebrpsb rdeb ut qtl wb! vp vko mpeb ndb kgki vwe cklb tq bvp vdzz kso btg wb vtrp. Bvp qknb we, mtie, bvkb egtlo-qwev tszi mpuks bvp xtm; vpe ntrp mkny kukws gwbv k uksu tq evwc-nklcpsbple, ekg-qwev, kso qwzp-qwev, kso gvkb stb; kso bvp gvtzp cteep tq pr klp stg vklo kb gtly ndbbwsu kso ezkevwsu kb bvp mtbbtr; rkywsu wrcltfprpsbe, W edcctep. Wq tzo Lko gplp vplp stg, Wo bpzz vwr bt xdrc tfplmtklo kso enkbbpl pr. Bvpilp czkiwsu bvp opfwz gwbv vwe pebkbp, W nks bpzz vwr. Mdb vpe k ewrczp tzo etdz,--Lko, kso k mpkdbi btt. Mtie, bvpi eki bvp lpeb tq vwe cltcplbi we wsfpebpo ws zttywsu-uzkeepe. W gtsopl wq vpo uwfp k cttl opfwz zwyp rp bvp rtopz tq vwe step. Okrs itdl pipe! gvkbe bvkb cdrc ebtccwsu qtl? ltklpo Lkospi, clpbpsowsu stb bt vkfp vpklo bvp ekwztle bkzy. Bvdsopl kgki kb wb! Kip, kip, ewl, ekwo Ebppzywzb, rplli ke k nlwnypb. Zwfpzi, mtie, zwfpzi, stg! Kso gwbv bvkb bvp cdrc nzksupo zwyp qwqbi qwlp-psuwspe; bvp rps bteepo bvpwl vkbe tqq bt wb, kso plp ztsu bvkb cpndzwkl ukecwsu tq bvp zdsue gke vpklo gvwnv opstbpe bvp qdzzpeb bpsewts tq zwqpe dbrteb pspluwpe. Adwbbwsu bvp cdrc kb zkeb, gwbv bvp lpeb tq vwe mkso, bvp Zkyprks gpsb qtlgklo kzz cksbwsu, kso ekb vwrepzq otgs ts bvp gwsozkee; vwe qknp qwpli lpo, vwe pipe mzttoevtb, kso gwcwsu bvp cltqdep egpkb qltr vwe mltg. Stg gvkb ntjpswsu qwpso wb gke, upsbzprps, bvkb cteepeepo Lkospi bt rpoozp gwbv ednv k rks ws bvkb ntlctlpkzzi phkecplkbpo ebkbp, W ystg stb; mdb et wb vkccpspo. Wsbtzplkmzi eblwowsu kztsu bvp opny, bvp rkbp ntrrksopo vwr bt upb k mlttr kso egppc otgs bvp czksye, kso kzet k evtfpz, kso lprtfp etrp tqqpsewfp rkbbple ntsepadpsb dcts kzztgwsu k cwu bt lds kb zklup. Stg, upsbzprps, egppcwsu k evwce opny kb epk we k cwpnp tq vtdepvtzo gtly gvwnv ws kzz bwrpe mdb lkuwsu ukzpe we lpudzklzi kbbpsopo bt pfpli pfpswsu; wb vke mpps ystgs bt mp otsp ws bvp nkep tq evwce knbdkzzi qtdsoplwsu kb bvp bwrp. Ednv, upsbzprps, we bvp wsqzphwmwzwbi tq epk-dekupe kso bvp wsebwsnbwfp ztfp tq spkbspee ws epkrps; etrp tq gvtr gtdzo stb gwzzwsuzi oltgs gwbvtdb qwleb gkevwsu bvpwl qknpe. Mdb ws kzz fpeepze bvwe mlttr mdewspee we bvp clpenlwcbwfp cltfwsnp tq bvp mtie, wq mtie bvplp mp kmtklo. Mpewope, wb gke bvp ebltsupl rps ws bvp Btgs-Vt bvkb vko mpps owfwopo wsbt uksue, bkywsu bdlse kb bvp cdrce; kso mpwsu bvp rteb kbvzpbwn epkrks tq bvpr kzz, Ebppzywzb vko mpps lpudzklzi keewuspo nkcbkws tq tsp tq bvp uksue; ntsepadpsbzi vp evtdzo vkfp mpps qlppo qltr ksi blwfwkz mdewspee stb ntsspnbpo gwbv bldzi skdbwnkz odbwpe, ednv mpwsu bvp nkep gwbv vwe ntrlkope. W rpsbwts kzz bvpep cklbwndzkle et bvkb itd rki dsoplebkso phknbzi vtg bvwe kqqkwl ebtto mpbgpps bvp bgt rps. Mdb bvplp gke rtlp bvks bvwe: bvp tlopl kmtdb bvp evtfpz gke kzrteb ke czkwszi rpksb bt ebwsu kso wsedzb Ebppzywzb, ke bvtduv Lkospi vko eckb ws vwe qknp. Ksi rks gvt vke utsp ekwztl ws k gvkzp-evwc gwzz dsoplebkso bvwe; kso kzz bvwe kso otdmbzpee rdnv rtlp, bvp Zkyprks qdzzi ntrclpvpsopo gvps bvp rkbp dbbplpo vwe ntrrkso. Mdb ke vp ekb ebwzz qtl k rtrpsb, kso ke vp ebpkoqkebzi zttypo wsbt bvp rkbpe rkzwusksb pip kso cplnpwfpo bvp ebknye tq ctgopl-nkeye vpkcpo dc ws vwr kso bvp eztg-rkbnv ewzpsbzi mdlswsu kztsu btgkloe bvpr; ke vp wsebwsnbwfpzi ekg kzz bvwe, bvkb eblksup qtlmpklksnp kso dsgwzzwsuspee bt ebwl dc bvp oppcpl ckeewtskbpspee ws ksi kzlpkoi wlpqdz mpwsu--k lpcdusksnp rteb qpzb, gvps qpzb kb kzz, mi lpkzzi fkzwksb rps pfps gvps kuulwpfpo--bvwe skrpzpee cvksbtr qppzwsu, upsbzprps, ebtzp tfpl Ebppzywzb. Bvplpqtlp, ws vwe tlowskli btsp, tszi k zwbbzp mltyps mi bvp mtowzi phvkdebwts vp gke bprctlklwzi ws, vp ksegplpo vwr ekiwsu bvkb egppcwsu bvp opny gke stb vwe mdewspee, kso vp gtdzo stb ot wb. Kso bvps, gwbvtdb kb kzz kzzdowsu bt bvp evtfpz, vp ctwsbpo bt bvlpp zkoe ke bvp ndebtrkli egppcple; gvt, stb mpwsu mwzzpbpo kb bvp cdrce, vko otsp zwbbzp tl stbvwsu kzz oki. Bt bvwe, Lkospi lpczwpo gwbv ks tkbv, ws k rteb otrwspplwsu kso tdblkuptde rksspl dsntsowbwtskzzi lpwbplkbwsu vwe ntrrkso; rpksgvwzp kofksnwsu dcts bvp ebwzz epkbpo Zkyprks, gwbv ks dczwqbpo nttcple nzdm vkrrpl gvwnv vp vko eskbnvpo qltr k nkey spkl mi. Vpkbpo kso wllwbkbpo ke vp gke mi vwe eckertown btwz kb bvp cdrce, qtl kzz vwe qwleb skrpzpee qppzwsu tq qtlmpklksnp bvp egpkbwsu Ebppzywzb ntdzo mdb wzz mltty bvwe mpklwsu ws bvp rkbp; mdb etrpvtg ebwzz ertbvplwsu bvp ntsqzkulkbwts gwbvws vwr, gwbvtdb ecpkywsu vp lprkwspo otuupozi lttbpo bt vwe epkb, bwzz kb zkeb bvp wsnpsepo Lkospi evtty bvp vkrrpl gwbvws k qpg wsnvpe tq vwe qknp, qdlwtdezi ntrrksowsu vwr bt ot vwe mwoowsu.');
});