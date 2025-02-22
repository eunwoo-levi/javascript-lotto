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
function Header() {
  const header = document.createElement("header");
  const title = document.createElement("h1");
  title.innerText = "🎱행운의 로또";
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
function randomLottos(playLotto, randomLottosArray) {
  const purchasedLottoQuantity = document.createElement("p");
  purchasedLottoQuantity.innerText = `총 ${randomLottosArray.length}개를 구매하였습니다.`;
  purchasedLottoQuantity.className = "purchaesd-quantity";
  playLotto.appendChild(purchasedLottoQuantity);
  const randomLottos2 = document.createElement("div");
  randomLottos2.className = "random-lottos";
  console.log(randomLottosArray);
  randomLottosArray.forEach((randomLotto) => {
    const oneLotto = document.createElement("div");
    oneLotto.className = "one-lotto";
    const lottoImage = document.createElement("img");
    lottoImage.src = "./lotto.png";
    const randomLottoNumbers = document.createElement("p");
    randomLottoNumbers.innerText = randomLotto;
    oneLotto.appendChild(lottoImage);
    oneLotto.appendChild(randomLottoNumbers);
    randomLottos2.appendChild(oneLotto);
  });
  playLotto.appendChild(randomLottos2);
}
const getArrayOfStrings = (arrays) => {
  return arrays.map((arr) => `${arr.join(", ")}`);
};
function PlayLotto() {
  const playLotto = document.createElement("div");
  playLotto.className = "play-lotto";
  const inputContainer = document.createElement("div");
  inputContainer.className = "input-container";
  const purchasePriceHeader = document.createElement("p");
  purchasePriceHeader.innerText = "구매 금액을 입력해주세요.";
  purchasePriceHeader.className = "header";
  playLotto.appendChild(purchasePriceHeader);
  const priceInput = document.createElement("input");
  priceInput.type = "text";
  priceInput.placeholder = "금액";
  const purchaseButton = document.createElement("button");
  purchaseButton.innerText = "구매";
  inputContainer.appendChild(priceInput);
  inputContainer.appendChild(purchaseButton);
  playLotto.appendChild(inputContainer);
  purchaseButton.addEventListener("click", () => {
    try {
      const lottoQuantity = priceInput.value / LOTTO.MIN_PURCHASE_PRICE;
      const randomlottos = getRandomLottos(lottoQuantity);
      randomLottos(playLotto, getArrayOfStrings(randomlottos));
      const winningNumberInputHeader = document.createElement("p");
      winningNumberInputHeader.innerText = "지난 주 당첨번호 6개와 보너스 번호 1개를 입력해주세요.";
      winningNumberInputHeader.className = "header";
      playLotto.appendChild(winningNumberInputHeader);
    } catch (error) {
      alert(error.message);
    }
  });
  return playLotto;
}
function lottoDashboard() {
  const lottoDashboard2 = document.createElement("div");
  lottoDashboard2.className = "lotto-dashboard";
  const lottoHeader = document.createElement("p");
  lottoHeader.innerText = "🎱내 번호 당첨 확인🎱";
  lottoHeader.className = "lotto-header";
  lottoDashboard2.appendChild(lottoHeader);
  lottoDashboard2.appendChild(PlayLotto());
  return lottoDashboard2;
}
function Main() {
  const main = document.createElement("main");
  main.appendChild(lottoDashboard());
  return main;
}
function Footer() {
  const footer = document.createElement("footer");
  const text = document.createElement("p");
  text.innerText = "Copyright 2023. woowacourse";
  footer.appendChild(text);
  return footer;
}
const app = document.getElementById("app");
app.appendChild(Header());
app.appendChild(Main());
app.appendChild(Footer());
