const WORDS_BOX = document.getElementById("words-display-box");
const INPUT_FIELD = document.getElementById("words-input-field");
const TIMER = document.getElementById("timer");
const DEFAULT_SHUFFLE = 3;

let current,
  WPM = 0,
  wordsArray;
{
  wordsArray =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam similique non quod numquam, adipisci ut perferendis suscipit beatae laborum dignissimos repudiandae debitis esse inventore hic molestias repellendus dolore assumenda blanditiis. Quia reprehenderit aspernatur, dignissimos aut, eos illo minus aliquid deserunt fugiat similique quae. Consequuntur distinctio reprehenderit. Consequuntur, fugit eveniet."
      .toLowerCase()
      .replaceAll(",", "")
      .replaceAll(".", "")
      .split(" ");
}

let spanWordsArray = wordsArray.map((e) => {
  let span = document.createElement("span");
  span.append(e);
  return span;
});

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

  if (WORDS_BOX.classList.contains("show-WPM")) {
    WORDS_BOX.classList.remove("show-WPM");
    WORDS_BOX.textContent = "";
  }

  shuffleWords(spanWordsArray);
  appendWords(spanWordsArray);

  spanWordsArray[current].classList.add("highlight");
  INPUT_FIELD.focus();
}
restartGame();
