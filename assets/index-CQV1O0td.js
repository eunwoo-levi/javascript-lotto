(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const createElement = (tag, props = {}) => {
  if (!tag || typeof tag !== "string") {
    throw new Error("태그는 문자열이어야 합니다.");
  }
  const element = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === "style" && typeof value === "object") {
      Object.entries(value).forEach(([styleKey, styleValue]) => {
        element.style.setProperty(styleKey, styleValue);
      });
    } else if (key === "class") {
      value.split(" ").forEach((cls) => element.classList.add(cls));
    } else {
      element[key] = value;
    }
  });
  return element;
};
function Header() {
  const header = createElement("header");
  const title = createElement("h1", { textContent: "🎱행운의 로또" });
  header.appendChild(title);
  return header;
}
const LOTTO = Object.freeze({
  MIN_PURCHASE_PRICE: 1e3,
  MAX_RANDOM_NUMBER: 45,
  MIN_RANDOM_NUMBER: 1,
  MAX_LENGTH: 6,
  FIVE_WITH_BONUS_MATCH_IDX: 7,
  SIX_MATCH: 6,
  FIVE_WITH_BONUS_MATCH: 5.5,
  FIVE_MATCH: 5,
  FOUR_MATCH: 4,
  THREE_MATCH: 3,
  PRIZE_OF_SIX_MATCH: 2e9,
  PRIZE_OF_FIVE_WITH_BONUS_MATCH: 3e7,
  PRIZE_OF_FIVE_MATCH: 15e5,
  PRIZE_OF_FOUR_MATCH: 5e4,
  PRIZE_OF_THREE_MATCH: 5e3
});
const getRandomNumber = () => {
  return Math.floor(Math.random() * LOTTO.MAX_RANDOM_NUMBER) + LOTTO.MIN_RANDOM_NUMBER;
};
const getRandomLottos = (quantity) => {
  const lottos = [];
  Array.from({ length: quantity }, () => {
    const lotto = getUnduplicatedRandomLottos();
    lottos.push(lotto);
  });
  return lottos;
};
const getUnduplicatedRandomLottos = () => {
  const randomNumberSet = /* @__PURE__ */ new Set();
  while (randomNumberSet.size !== LOTTO.MAX_LENGTH) {
    randomNumberSet.clear();
    Array.from({ length: LOTTO.MAX_LENGTH }, () => randomNumberSet.add(getRandomNumber()));
  }
  return [...randomNumberSet].sort((a, b) => a - b);
};
const getArrayOfStrings = (arrays) => {
  return arrays.map((arr) => `${arr.join(", ")}`);
};
function randomLottos(playLotto, randomLottosArray) {
  const purchasedLottoQuantity = createElement("span", {
    class: "purchaesd-quantity",
    textContent: `총 ${randomLottosArray.length}개를 구매하였습니다.`
  });
  playLotto.appendChild(purchasedLottoQuantity);
  const randomLottos2 = createElement("div", { class: "random-lottos" });
  CreateOneLotto(randomLottos2, randomLottosArray);
  playLotto.appendChild(randomLottos2);
}
function CreateOneLotto(randomLottos2, randomLottosArray) {
  randomLottosArray.forEach((randomLotto) => {
    const oneLotto = createElement("div", { class: "one-lotto" });
    const lottoImage = createElement("img", { src: "./lotto.png" });
    const randomLottoNumbers = createElement("span", { textContent: randomLotto });
    oneLotto.appendChild(lottoImage);
    oneLotto.appendChild(randomLottoNumbers);
    randomLottos2.appendChild(oneLotto);
  });
}
function WinningNumberHeaders(winningNumberContainer) {
  const winningNumberHeaders = createElement("div", { class: "winning-number-headers" });
  const winningNumberHeader = createElement("span", { class: "header", textContent: "당첨 번호" });
  const bonusNumberHeader = createElement("span", { class: "header", textContent: "보너스 번호" });
  winningNumberHeaders.appendChild(winningNumberHeader);
  winningNumberHeaders.appendChild(bonusNumberHeader);
  winningNumberContainer.appendChild(winningNumberHeaders);
}
function WinningNumberInputs(winningNumberContainer) {
  const winningAndBonusInputContainer = createElement("div", { class: "winning-and-bonus-input-container" });
  const winningNumbersArray = new Array(6).fill(0);
  const bonusNumber = { value: 0 };
  const winningInputs = createElement("div", { class: "winning-inputs" });
  CreateSixWinningInputs(winningAndBonusInputContainer, winningInputs, winningNumbersArray);
  CreateBonusInput(winningAndBonusInputContainer, bonusNumber);
  winningNumberContainer.appendChild(winningAndBonusInputContainer);
  return { winningNumbersArray, bonusNumber };
}
function CreateSixWinningInputs(winningAndBonusInputContainer, winningInputs, winningNumbersArray) {
  Array.from({ length: 6 }, (_, idx) => {
    const winningNumberInput = createElement("input", { type: "text", class: "winning-input" });
    winningNumberInput.addEventListener("input", (e) => {
      winningNumbersArray[idx] = Number(e.target.value);
    });
    winningInputs.appendChild(winningNumberInput);
  });
  winningAndBonusInputContainer.appendChild(winningInputs);
}
function CreateBonusInput(winningAndBonusInputContainer, bonusNumber) {
  const bonusNumberInput = createElement("input", { type: "text", class: "bonus-input" });
  bonusNumberInput.addEventListener("input", (e) => {
    bonusNumber.value = Number(e.target.value);
  });
  winningAndBonusInputContainer.appendChild(bonusNumberInput);
}
function WinningNumbers(playLotto) {
  const winningNumberContainer = document.createElement("div", { class: "winning-number-container" });
  WinningNumberHeaders(winningNumberContainer);
  const { winningNumbersArray, bonusNumber } = WinningNumberInputs(winningNumberContainer);
  playLotto.appendChild(winningNumberContainer);
  return { winningNumbersArray, bonusNumber };
}
function PurchaseForm(playLotto) {
  const purchasePriceHeader = createElement("span", {
    class: "header",
    textContent: "구매 금액을 입력해주세요."
  });
  playLotto.appendChild(purchasePriceHeader);
  const inputContainer = createElement("div", { class: "input-container" });
  const priceInput = createElement("input", { type: "text", placeholder: "금액" });
  const purchaseButton = createElement("button", { textContent: "구매" });
  inputContainer.appendChild(priceInput);
  inputContainer.appendChild(purchaseButton);
  playLotto.appendChild(inputContainer);
  return { priceInput, purchaseButton };
}
const ERROR = Object.freeze({
  EMPTY_VALUE: "입력 값은 빈 값이 아니여야 해요.",
  NOT_POSITIVE_INTEGER: "입력 값은 양의 정수여야 해요",
  LOWER_THAN_MINIMUM_OF_PUCHASE_PRICE: "구입 금액은 1000원 이상이어야 해요.",
  NOT_RANGE_OF_WINNING_NUMBER: "당첨 번호는 1~45 사이여야 해요.",
  NOT_SAME_LENGTH_OF_WINNING_NUMBER: "당첨 번호는 6개여야 해요.",
  DUPLICATED_WINNING_NUMBER: "당첨 번호는 중복될 수 없어요.",
  DUPLICATED_BONUS_NUMBER: "보너스 번호는 당첨 번호와 중복될 수 없어요.",
  CHECK_REPLAY_GAME: "재시작 여부는 y 또는 n으로 입력해 주세요."
});
const hasEmptyString = (input) => {
  if (input === "") {
    throw new Error(ERROR.EMPTY_VALUE);
  }
};
const isValueInteger = (input) => {
  if (!Number.isInteger(input)) {
    throw new Error(ERROR.NOT_POSITIVE_INTEGER);
  }
};
const validateArrayOfWinningNumbers = (winningNumbers) => {
  winningNumbers.some((value) => {
    const winningNumber = Number(value);
    hasEmptyString(value);
    isValueInteger(winningNumber);
    checkRangeOfLottoNumber(winningNumber);
  });
};
const validateWinningNumbers = (input) => {
  const winningNumbers = input.split(",");
  const winningNumberSet = new Set(winningNumbers);
  if (winningNumbers.length !== LOTTO.MAX_LENGTH) {
    throw new Error(ERROR.NOT_SAME_LENGTH_OF_WINNING_NUMBER);
  }
  if (winningNumberSet.size !== LOTTO.MAX_LENGTH) {
    throw new Error(ERROR.DUPLICATED_WINNING_NUMBER);
  }
  validateArrayOfWinningNumbers(winningNumbers);
};
const validateBonusNumber = (input, winningNumbers) => {
  const bonusNumber = Number(input);
  hasEmptyString(input);
  isValueInteger(bonusNumber);
  checkRangeOfLottoNumber(bonusNumber);
  if (winningNumbers.includes(bonusNumber)) {
    throw new Error(ERROR.DUPLICATED_BONUS_NUMBER);
  }
};
const checkRangeOfLottoNumber = (input) => {
  if (input < LOTTO.MIN_RANDOM_NUMBER || input > LOTTO.MAX_RANDOM_NUMBER) {
    throw new Error(ERROR.NOT_RANGE_OF_WINNING_NUMBER);
  }
};
const getWinningMatchCount = (randomlottos, lottoNumbers) => {
  let matchCounts = [0, 0, 0, 0, 0, 0, 0, 0];
  randomlottos.forEach((randomLotto) => {
    let match = plusIfWinningNumbers(lottoNumbers, randomLotto);
    if (match === LOTTO.FIVE_MATCH && randomLotto.includes(lottoNumbers.bonusNumber)) {
      match = LOTTO.FIVE_WITH_BONUS_MATCH_IDX;
    }
    matchCounts[match]++;
  });
  return matchCounts;
};
const plusIfWinningNumbers = (lottoNumbers, randomLotto) => {
  let match = 0;
  lottoNumbers.winningNumbers.forEach((winningNumber) => {
    if (randomLotto.includes(winningNumber)) {
      match++;
    }
  });
  return match;
};
const calculateRevenue = (matchCounts, purchasePrice) => {
  const sumOfLottoPrize = matchCounts.reduce(
    (acc, cur, idx) => idx >= 3 ? acc + cur * calculateRevenueByMatch(idx) : acc,
    0
  );
  return Number((sumOfLottoPrize / purchasePrice * 100).toFixed(1));
};
const calculateRevenueByMatch = (matchCount) => {
  if (matchCount === LOTTO.SIX_MATCH) return LOTTO.PRIZE_OF_SIX_MATCH;
  else if (matchCount === LOTTO.FIVE_WITH_BONUS_MATCH_IDX) return LOTTO.PRIZE_OF_FIVE_WITH_BONUS_MATCH;
  else if (matchCount === LOTTO.FIVE_MATCH) return LOTTO.PRIZE_OF_FIVE_MATCH;
  else if (matchCount === LOTTO.FOUR_MATCH) return LOTTO.PRIZE_OF_FOUR_MATCH;
  else if (matchCount === LOTTO.THREE_MATCH) return LOTTO.PRIZE_OF_THREE_MATCH;
  return 0;
};
function CloseButton(resultDashboard, resultBackground) {
  const closeButton = createElement("button", { textContent: "X", class: "close-button" });
  closeButton.addEventListener("click", () => {
    resultBackground.remove();
    resultDashboard.remove();
  });
  resultDashboard.appendChild(closeButton);
}
function ResultDashboardHeader(resultDashboard) {
  const resultHeader = createElement("h1", { class: "result-header", textContent: "🏆 당첨 통계 🏆" });
  resultDashboard.appendChild(resultHeader);
}
function ReplayLottoButton(resultDashboard) {
  const replayLottoButton = createElement("button", { class: "replay-lotto-button", textContent: "다시 구매하기" });
  replayLottoButton.addEventListener("click", () => {
    location.reload();
  });
  resultDashboard.appendChild(replayLottoButton);
}
function LottoWinningRevenue(resultDashboard, revenue) {
  const revenueTag = createElement("div", { class: "revenue", textContent: `당신의 총 수익률은 ${revenue}%입니다.` });
  resultDashboard.appendChild(revenueTag);
}
function DividerLine(resultContainer) {
  const dividerLine = createElement("div", { class: "divider-line" });
  resultContainer.appendChild(dividerLine);
}
function ResultCols(resultDashboard) {
  const resultCols = createElement("div", { class: "result-rows" });
  const typeOfMatch = createElement("div", { class: "result-col", textContent: "일치 갯수" });
  resultCols.appendChild(typeOfMatch);
  const winningPrize = createElement("div", { class: "result-col", textContent: "당첨금" });
  resultCols.appendChild(winningPrize);
  const matchCounts = createElement("div", { class: "result-col", textContent: "당첨 횟수" });
  resultCols.appendChild(matchCounts);
  resultDashboard.appendChild(resultCols);
}
function ResultRow(type, prize, count) {
  const resultRow = createElement("div", { class: "result-rows" });
  const typeOfMatch = createElement("div", { class: "result-col", textContent: type });
  resultRow.appendChild(typeOfMatch);
  const winningPrize = createElement("div", { class: "result-col", textContent: prize });
  resultRow.appendChild(winningPrize);
  const matchCounts = createElement("div", { class: "result-col", textContent: count });
  resultRow.appendChild(matchCounts);
  return resultRow;
}
function ResultContainer(resultDashboard, matchCounts) {
  const resultContainer = createElement("div");
  DividerLine(resultContainer);
  ResultCols(resultContainer);
  DividerLine(resultContainer);
  RowsOfTotalResult(resultContainer, matchCounts);
  resultContainer.className = "result-container";
  resultDashboard.appendChild(resultContainer);
}
function RowsOfTotalResult(resultContainer, matchCounts) {
  resultContainer.appendChild(ResultRow("3개", "5,000", matchCounts[LOTTO.THREE_MATCH]));
  DividerLine(resultContainer);
  resultContainer.appendChild(ResultRow("4개", "50,000", matchCounts[LOTTO.FOUR_MATCH]));
  DividerLine(resultContainer);
  resultContainer.appendChild(ResultRow("5개", "1,500,000", matchCounts[LOTTO.FIVE_MATCH]));
  DividerLine(resultContainer);
  resultContainer.appendChild(ResultRow("5개+보너스볼", "30,000,000", matchCounts[LOTTO.FIVE_WITH_BONUS_MATCH_IDX]));
  DividerLine(resultContainer);
  resultContainer.appendChild(ResultRow("6개", "2,000,000,000", matchCounts[LOTTO.SIX_MATCH]));
  DividerLine(resultContainer);
}
function ResultDashboard(playLotto, matchCounts, revenue) {
  const resultDashboard = createElement("div");
  resultDashboard.className = "result-dashboard";
  const resultBackground = createElement("div", { class: "result-background" });
  CloseButton(resultDashboard, resultBackground);
  ResultDashboardHeader(resultDashboard);
  ResultContainer(resultDashboard, matchCounts);
  LottoWinningRevenue(resultDashboard, revenue);
  ReplayLottoButton(resultDashboard);
  playLotto.appendChild(resultBackground);
  playLotto.appendChild(resultDashboard);
}
function LottoResultModal({ priceInput, playLotto, randomlottos }, { winningNumbers, bonusNumber }) {
  const resultButton = createElement("button", { class: "result-button", textContent: "결과 확인하기" });
  resultButton.addEventListener("click", () => {
    try {
      validateWinningAndBonusNumbers(winningNumbers, bonusNumber);
      const matchCounts = getWinningMatchCount(randomlottos, {
        winningNumbers,
        bonusNumber: bonusNumber.value
      });
      const revenue = calculateRevenue(matchCounts, priceInput.value);
      ResultDashboard(playLotto, matchCounts, revenue);
    } catch (error) {
      alert(error.message);
    }
  });
  return resultButton;
}
function validateWinningAndBonusNumbers(winningNumbers, bonusNumber) {
  validateWinningNumbers(winningNumbers.join(","));
  validateBonusNumber(bonusNumber.value, winningNumbers);
}
function PlayLotto() {
  const playLotto = createElement("div", { class: "play-lotto" });
  const { priceInput, purchaseButton } = PurchaseForm(playLotto);
  purchaseButton.addEventListener("click", () => {
    try {
      const lottoQuantity = priceInput.value / LOTTO.MIN_PURCHASE_PRICE;
      const randomlottos = getRandomLottos(lottoQuantity);
      randomLottos(playLotto, getArrayOfStrings(randomlottos));
      const winningNumberInputHeader = createElement("span", {
        class: "header",
        textContent: "지난 주 당첨번호 6개와 보너스 번호 1개를 입력해주세요."
      });
      playLotto.appendChild(winningNumberInputHeader);
      const { winningNumbersArray, bonusNumber } = WinningNumbers(playLotto);
      const resultButton = LottoResultModal(
        { priceInput, playLotto, randomlottos },
        {
          winningNumbers: winningNumbersArray,
          bonusNumber
        }
      );
      playLotto.appendChild(resultButton);
    } catch (error) {
      alert(error.message);
    }
  });
  return playLotto;
}
function LottoDashboard() {
  const lottoDashboard = createElement("div", { class: "lotto-dashboard" });
  const lottoHeader = createElement("span", { textContent: "🎱내 번호 당첨 확인🎱", class: "lotto-header" });
  lottoDashboard.appendChild(lottoHeader);
  lottoDashboard.appendChild(PlayLotto());
  return lottoDashboard;
}
function Main() {
  const main = createElement("main");
  main.appendChild(LottoDashboard());
  return main;
}
function Footer() {
  const footer = createElement("footer");
  const text = createElement("span", { textContent: "Copyright 2025. woowacourse" });
  footer.appendChild(text);
  return footer;
}
const app = document.getElementById("app");
app.appendChild(Header());
app.appendChild(Main());
app.appendChild(Footer());
