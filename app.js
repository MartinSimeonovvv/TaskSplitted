const availableCurrencies = ["usd", "eur", "aud", "cad", "chf", "nzd", "bgn"];
const url =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";
const groupOne = document.querySelector(".group1");
const groupTwo = document.querySelector(".group2");
const groupThree = document.querySelector(".group3");

let currenciesData = [];

const select = document.querySelector("select");

window.addEventListener("load", async () => {
  const requestCurrencies = availableCurrencies.filter(
    (curr) => curr !== "usd"
  );

  for (let value of requestCurrencies) {
    const response = await fetch(`${url}/usd/${value}.json`);
    const data = await response.json();
    currenciesData.push(data);
    sessionStorage.setItem("usd", `${currenciesData}`);
  }

  separateInGroups(currenciesData);
});

select.addEventListener("change", async (event) => {
  const currentCurrency = event.target.value.toLowerCase();
  const requestCurrencies = availableCurrencies.filter(
    (x) => x !== currentCurrency
  );

  currenciesData = [];
  groupOne.innerHTML = "";
  groupTwo.innerHTML = "";
  groupThree.innerHTML = "";
  groupOne.textContent = "Group1 (< 1)";
  groupTwo.textContent = "Group2 (>= 1 and < 1.5)";
  groupThree.textContent = "Group3 (>= 1.5)";

  for (let currency of requestCurrencies) {
    const request = await fetch(`${url}/${currentCurrency}/${currency}.json`);
    const data = await request.json();
    currenciesData.push(data);
  }
  separateInGroups(currenciesData, currentCurrency);
});

async function separateInGroups(currenciesData, currentCurrency) {
  groupOneOrdering(currenciesData, groupOne, currentCurrency);
  groupTwoOrdering(currenciesData, groupTwo, currentCurrency);
  groupThreeOrdering(currenciesData, groupThree, currentCurrency);
}

function groupOneOrdering(currenciesData, groupOne, currentCurrency) {
  const currenciesLowerThenOne = currenciesData
    .map((v) => Object.entries(v)[1])
    .filter((c) => c[1] < 1)
    .sort((a, b) => a[1] - b[1]);
  appendValues(currenciesLowerThenOne, groupOne, currentCurrency);
}

function groupTwoOrdering(currenciesData, groupTwo, currentCurrency) {
  const currenciesBetweenOneAndOneAndHalf = currenciesData
    .map((v) => Object.entries(v)[1])
    .filter((c) => c[1] >= 1 && c[1] < 1.5)
    .sort((a, b) => a[1] - b[1]);
  appendValues(currenciesBetweenOneAndOneAndHalf, groupTwo, currentCurrency);
}

function groupThreeOrdering(currenciesData, groupThree, currentCurrency) {
  const currenciesGreaterThenOneAndHalf = currenciesData
    .map((v) => Object.entries(v)[1])
    .filter((c) => c[1] >= 1.5)
    .sort((a, b) => a[1] - b[1]);
  appendValues(currenciesGreaterThenOneAndHalf, groupThree, currentCurrency);
}

function appendValues(values, group, currentCurrency = "usd") {
  for (let currentValue of values) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.textContent = `${currentCurrency.toUpperCase()}-${currentValue[0].toUpperCase()}:${
      currentValue[1]
    }`;
    tr.appendChild(td);

    group.appendChild(tr);
  }
  const trCount = document.createElement("tr");
  trCount.textContent = `Count: ${values.length}`;
  group.appendChild(trCount);
}
