const WORDS_BOX = document.getElementById("words-display-box");
const INPUT_FIELD = document.getElementById("words-input-field");
const TIMER = document.getElementById("timer");
const DEFAULT_SHUFFLE = 3,
  DEFAULT_TIME = 59;

let isPlaying, time, current, WPM, wordsArray, spanWordsArray;
{
  wordsArray =
    "than|find|year|those|made|head|three|life|picture|car|to|what|still|turn|never|year|had|are|plant|together|learn|people|set|America|cut|use|while|river|as|such|where|once|form|almost|than|each|is|open|talk|song|quite|small|what|page|his|because|boy|run|also|get|any|went|came|on|call|work|try|just|while|little|list|country|side|also|the|began|up|stop|write|girl|watch|car|had|must|into|took|but|give|Indian|very|question|with|father|your|which|play|where|it's|world|study|until|was|think|head|soon|children|like|may|away|up|write|were|us|next|then|him|first|out|make|mile|house|earth|often|between|but|set|will|high|put|mean|for|next|walk|because|second|young|help|even|well|how|his|hear|talk|don't|may|our|food|at|tell|not|follow|miss|other|also|so|no|learn|hard|show|for|when|great|this|time|come|part|really|sentence|was|together|once|many|change|do|it|men|water|white|thing|seem|set|answer|from|find|here|world|must|children|to|one|far|with|children|got|until|country|number|carry|get|something|time|end|sentence|small|girl|try|night|call|all|say|America|out|great|take|them|watch|if|them|story|too|move|of|mean|last|carry|could|point|always|letter|off|our|place|turn|under|hand|river|that|most|he|home|by|cut|good|him|if|are|more|light|mile|Indian|being|land|book|now|most|before|well|really|in|start|group|letter|second|new|you|earth|question|this|different|want|she|run|sometimes|begin|below|above|first|has|different|school|near|new|above|who|cut|under|man|took|face|old|and|like|follow|grow|line|air|your|leave|play|white|would|paper|turn|we|leave|page|miss|is|another|has|all|go|she|near|said|part|eye|picture|left|grow|an|their|made|like|around|or|walk|its|idea|animal|great|open|head|idea|kind|own|oil|kind|spell|much|quickly|write|with|tell|would|will|soon|he|begin|about|mother|state|life|change|that|such|example|country|family|your|found|well|for|an|saw|state|don't|being|down|found|large|went|some|sound|does|must|father|her|than|see|four|why|night|until|form|after|should|know".split(
      "|"
    );
}

/* inputs: spanWordsArray, shuffle times
   outputs: shuffledArray which is the same array in inputs */
function shuffleWords(array, shuffle_count = DEFAULT_SHUFFLE) {
  if (!shuffle_count) return;

  array.sort(() => (Math.random() > 0.5 ? 1 : -1));
  shuffleWords(array, shuffle_count - 1);
}

function appendWords(spans) {
  spans.forEach((span) => WORDS_BOX.append(span));
}

/*
function reset, call only when user press reset button and when page loaded
{
	- set time to 1 minute
	- set result(WPM) to 0
	- remove class show result from words-box
	- remove words-box spans(all the words from last game)
	- shuffle span array
	- append all spans to words-box.
	- focusing on input
}
*/
function restartGame() {
  TIMER.textContent = "1:00";
  WPM = current = 0;
  time = DEFAULT_TIME;
  isPlaying = false;

  if (WORDS_BOX.classList.contains("show-WPM")) {
    WORDS_BOX.classList.remove("show-WPM");
    WORDS_BOX.textContent = "";
  }

  spanWordsArray = wordsArray.map((e) => {
    let span = document.createElement("span");
    span.append(e);
    return span;
  });

  shuffleWords(spanWordsArray);
  appendWords(spanWordsArray);

  spanWordsArray[current].classList.add("highlight");

  if (INPUT_FIELD.hasAttribute("disabled"))
    INPUT_FIELD.removeAttribute("disabled");

  INPUT_FIELD.focus();
}

// a function that start/stop timer, note that countdown will be cleared when time equal 0
function startCountDown() {
  let intervalID = setInterval(() => {
    if (time == 0) {
      clearInterval(intervalID);
      endGame();
    }

    TIMER.textContent = `0:${time--}`;
  }, 1000);
}

function endGame() {
  setTimeout(() => {
    isPlaying = false;
  }, 1000);
  WORDS_BOX.setAttribute("wpm", `WPM: ${WPM} - Press R to restart`);
  WORDS_BOX.classList.add("show-WPM");
  INPUT_FIELD.value = "";
  INPUT_FIELD.toggleAttribute("disabled"); // game is finished so this field must be disabled.
}

function isWordCorrect(inputValue) {
  return inputValue == spanWordsArray[current].textContent;
}

function isWordCorrect(inputValue, length) {
  return inputValue == spanWordsArray[current].textContent.substr(0, length);
}

function correctWord(currentSpan) {
  currentSpan.classList.add("correct");
  WPM++;
}

function wrongWord(currentSpan) {
  currentSpan.classList.add("wrong");
}

INPUT_FIELD.addEventListener("keydown", (e) => {
  if (e.code == "Space" && INPUT_FIELD.value == "") return e.preventDefault();

  if (!isPlaying) {
    isPlaying = true;
    startCountDown();
  }

  if (e.code == "Space") {
    e.preventDefault();

    spanWordsArray[current].classList.remove("highlight");
    spanWordsArray[current].classList.remove("highlight-wrong");

    if (isWordCorrect(INPUT_FIELD.value)) correctWord(spanWordsArray[current]);
    else wrongWord(spanWordsArray[current]);

    spanWordsArray[++current].classList.add("highlight");
    INPUT_FIELD.value = "";

    // remove all words that done before current word every 6 words
    if (current % 6 == 0) {
      for (let i = current - 6; i < current; i++) {
        spanWordsArray[i].remove();
      }
    }

    return;
  }
});

INPUT_FIELD.addEventListener("keyup", (e) => {
  if (e.code == "Space") return;

  if (isWordCorrect(INPUT_FIELD.value, INPUT_FIELD.value.length)) {
    spanWordsArray[current].classList.remove("highlight-wrong");
  } else spanWordsArray[current].classList.add("highlight-wrong");
});

document.addEventListener("keyup", (e) => {
  if (!isPlaying && e.code == "KeyR") restartGame();
});

window.onload = () => {
  restartGame(); // Preparing game to be ready to start.
};
