'use strict';

let quoteBlock = document.querySelector('.quote-text');
let messageBlock = document.querySelector('.message');

// елементи інпутів та форми
let form = document.querySelector('form');
let dateBefore = document.querySelector('#dateBefore');
let dateAfter = document.querySelector('#dateAfter');

// елементи кнопок
let btn = document.querySelector('#btn');
let weekBtn = document.querySelector('.weekBtn');
let monthBtn = document.querySelector('.monthBtn');

// елементи радіо-інпутів
let allDaysCheck = document.getElementById('allDays');
let weekDaysCheck = document.getElementById('weekDays');
let weekEndCheck = document.getElementById('weekEnd');

const select = document.getElementById('form-select');

let daysCheck = document.getElementById('days');
let hoursCheck = document.getElementById('hours');
let minutesCheck = document.getElementById('minutes');
let secondsCheck = document.getElementById('seconds');

// елемент для виведення результатів
let resultBlock = document.querySelector('.result-block');

// елемент для виведення історії результатів
let resultTable = document.querySelector('.table');

// Опції, для виведення дати українською мовою
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

// якщо є збережені дані в сховищі - вивести на екран
let dates = [];

let savedData = JSON.parse(localStorage.getItem('dates'));
if (savedData) {
  for (let value of savedData) {
    let element = `
    <div class="table-item">
      <div class="table-frame">${new Date(value.start).toLocaleDateString('uk-UA', options)}</div>
      <div class="table-frame">${new Date(value.end).toLocaleDateString('uk-UA', options)}</div>
      <div class="table-frame">${value.result}</div>
    </div>
    `
    resultTable.insertAdjacentHTML("beforeend", element);
  }
}


// Якщо введена початкова дата - кнопки стають активними
dateBefore.addEventListener('change', function () {
  if (this.value) {
    btn.removeAttribute('disabled');
    weekBtn.removeAttribute('disabled');
    monthBtn.removeAttribute('disabled');
    dateAfter.setAttribute('min', dateBefore.value);
  }
});


// пресет, який додає 7 днів до обраної дати 
weekBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (!selectedOption || selectedOption === 'none') {
    messageBlock.textContent = "Будь ласка, оберіть одиницю часу";
    select.style.border = "solid 2px red";
    setTimeout((function () {
      select.style.border = "#116466 solid 2px";
      messageBlock.textContent = '';
    }), 8000);
    return
  };

  const nextDate = new Date(dateBefore.value);
  nextDate.setDate(new Date(dateBefore.value).getDate() + 7);
  dateAfter.value = new Date(nextDate.setDate(new Date(dateBefore.value).getDate() + 7)).toISOString().split('T')[0];
  let result = getFinalCount(new Date(dateBefore.value), nextDate);
  resultBlock.textContent = result;
  resultBlock.classList.add('result-frame');

  // збереження отриманих результатів у сховищі та виведення у таблицю
  let data = { start: new Date(dateBefore.value).getTime(), end: nextDate.getTime(), result: result };
  updateTable(new Date(dateBefore.value).toLocaleDateString('uk-UA', options), nextDate.toLocaleDateString('uk-UA', options), result);
  setCountsToLocalStorage(data);
});


// пресет, який додає місяць до обраної дати
monthBtn.addEventListener('click', function (e) {
  e.preventDefault();

  if (!selectedOption || selectedOption === 'none') {
    messageBlock.textContent = "Будь ласка, оберіть одиницю часу";
    select.style.border = "solid 2px red";
    setTimeout((function () {
      select.style.border = "#116466 solid 2px";
      messageBlock.textContent = '';
    }), 8000);
    return
  };

  const nextDate = new Date(dateBefore.value);
  nextDate.setMonth(new Date(dateBefore.value).getMonth() + 1);
  dateAfter.value = new Date(nextDate.setMonth(new Date(dateBefore.value).getMonth() + 1)).toISOString().split('T')[0];
  let result = getFinalCount(new Date(dateBefore.value), nextDate);
  resultBlock.textContent = result;
  resultBlock.classList.add('result-frame');


  // збереження отриманих результатів у сховищі
  let data = { start: new Date(dateBefore.value).getTime(), end: nextDate.getTime(), result: result };
  updateTable(new Date(dateBefore.value).toLocaleDateString('uk-UA', options), nextDate.toLocaleDateString('uk-UA', options), result);
  setCountsToLocalStorage(data);
});


// Розрахунок днів при натисканні 'Розрахувати'
btn.addEventListener('click', function(e){
  e.preventDefault();
  let prevDate = new Date(dateBefore.value);
  let nextDate = new Date(dateAfter.value);

  if (!dateAfter.value) {
    messageBlock.textContent = "Будь ласка, введіть кінцеву дату";
    dateAfter.style.border = "solid 2px red";
    setTimeout((function () {
      dateAfter.style.border = "#116466 solid 2px";
      messageBlock.textContent = '';
    }), 8000);
    return
  }

  if (!selectedOption || selectedOption === 'none') {
    messageBlock.textContent = "Будь ласка, оберіть одиницю часу";
    select.style.border = "solid 2px red";
    setTimeout((function () {
      select.style.border = "#116466 solid 2px";
      messageBlock.textContent = '';
    }), 8000);
    return
  }

  let result = getFinalCount(prevDate, nextDate);
  resultBlock.textContent = result;
  resultBlock.classList.add('result-frame');

  // збереження отриманих результатів у сховищі
  let data = { start: new Date(dateBefore.value).getTime(), end: nextDate.getTime(), result: result };
  updateTable(new Date(dateBefore.value).toLocaleDateString('uk-UA', options), nextDate.toLocaleDateString('uk-UA', options), result);
  setCountsToLocalStorage(data);
})

// визначення яку одиницю часу було обрано
let selectedOption = '';
select.addEventListener('change', function () {
  
    let selectedIndex = select.selectedIndex;
    let options = select.options;
    selectedOption = options[selectedIndex].id;
    return selectedOption;
});


// функція для підрахунку часу в різних одиницях виміру
function timeCounter(number) {
  
  // константи одиниць часу
  const oneHour = 24;
  const oneMinute = 24 * 60;
  const oneSec = 24 * 60 * 60;
  
  // процес розрахунку     
    
  if(selectedOption === 'days') {
    return(`число днів: ${number}`);
  }
  
  if (selectedOption === 'hours') {
    return(`число годин: ${number * oneHour}`);
  }
  
  if (selectedOption === 'minutes') {
    return(`число хвилин: ${number * oneMinute}`);
  }
  
  if (selectedOption === 'seconds') {
    return(`число секунд: ${number * oneSec}`);
  };
};


// функція для підрахунку всіх днів
function getAllDaysCount(prev, next) {
  let daysCounter = 0;
  while (prev < next) {
    prev.setDate(prev.getDate() + 1);
    daysCounter++;
  }
  return daysCounter;
}

// функція для підрахунку тільки будних днів
function getWeekDaysCount (prev, next) {
  let daysCounter = 0;
  while(prev < next) {
    prev.setDate(prev.getDate() + 1);
    if(prev.getDay() != 0 && prev.getDay() != 6) {
      daysCounter++;
    }
  }
  return daysCounter;
};

//функція для підрахунку тільки вихідних
function getWeekEndsCount(prev, next) {
  let daysCounter = 0;
  while(prev < next) {
    prev.setDate(prev.getDate() + 1);
    if(prev.getDay() === 0 || prev.getDay() === 6) {
      daysCounter++;
    }
  }
  return daysCounter;
}

//функція для виведення фінального результату усіх розрахунків
function getFinalCount(prev, next) {
  let result;
  if (allDaysCheck.checked) {
    result = `Усі дні, ${timeCounter(getAllDaysCount(prev, next))}`;
  }else if (weekDaysCheck.checked) {
    result = `Будні дні, ${timeCounter(getWeekDaysCount(prev, next))}`;

  }else if (weekEndCheck.checked) {
    result = `Вихідні дні, ${timeCounter(getWeekEndsCount(prev, next))}`;
  }
  return result;
};

// функція яка зберігає результати в сховищі

function setCountsToLocalStorage(data) {
  if (!savedData) {
    savedData = [];
  }
  if (savedData.length >= 10) {
    savedData.shift();
  } 

  savedData.push(data);
  localStorage.setItem('dates', JSON.stringify(savedData));

}

// функція, яка оновлює таблицю результатів

function updateTable(start, end, result) {

  let element = `
  <div class="table-item">
    <div class="table-frame">${start}</div>
    <div class="table-frame">${end}</div>
    <div class="table-frame">${result}</div>
  </div>
  `
  resultTable.insertAdjacentHTML("beforeend", element);
}


let quotes = ["Єдине, що нам належить у цьому житті, — це час.", "Час ніколи не лягає спати.",
  "І випереджати час треба вчасно.", "Час безцінний. Гарненько подумай, на що ти його витрачаєш.",
  "Невдале планування часу — це планування невдачі.", "Ми витрачаємо час, а воно не чекає…",
  "Між успіхом і невдачею лежить прірва, ім’я якої “у мене немає часу.",
  "Або ви керуєте вашим днем, або ваш день буде керувати вами.", "Коли ми витрачаємо час на планування, його стає більше."]

// функція яка змінює цитату кожні 8 секунд

function setQuote() {
  let i = 0;
  let quoteTimer = setInterval(function () {
    if (i >= quotes.length) {
    i = 0
  } else {
      quoteBlock.textContent = `"${ quotes[i++] }"`;
  }
}, 8000);
}

setQuote();

