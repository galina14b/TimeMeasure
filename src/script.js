'use strict';

// елементи інпутів та форми
let form = document.querySelector('form');
let dateBefore = document.querySelector('#dateBefore');
let dateAfter = document.querySelector('#dateAfter');

// елементи кнопок
let btn = document.querySelector('.btn');
let weekBtn = document.querySelector('.weekBtn');
let monthBtn = document.querySelector('.monthBtn');

// елементи радіо-інпутів
let allDaysCheck = document.getElementById('allDays');
let weekDaysCheck = document.getElementById('weekDays');
let weekEndCheck = document.getElementById('weekEnd');

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
      <div class="startDate">${value.start}</div>
      <div class="endDate">${value.end}</div>
      <div class="result">${value.result}</div>
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
  const nextDate = new Date(dateBefore.value);
  nextDate.setDate(new Date(dateBefore.value).getDate() + 7);
  let result = getFinalCount(new Date(dateBefore.value), nextDate);
  resultBlock.textContent = result;

  // збереження отриманих результатів у сховищі та виведення у таблицю
  let data = { start: new Date(dateBefore.value).toLocaleDateString('uk-UA', options), end: nextDate.toLocaleDateString('uk-UA', options), result: result };
  updateTable(data.start, data.end, data.result);
  setCountsToLocalStorage(data);
});


// пресет, який додає місяць до обраної дати
monthBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const nextDate = new Date(dateBefore.value);
  nextDate.setMonth(new Date(dateBefore.value).getMonth() + 1);
  let result = getFinalCount(new Date(dateBefore.value), nextDate);
  resultBlock.textContent = result;

  // збереження отриманих результатів у сховищі
  let data = { start: new Date(dateBefore.value).toLocaleDateString('uk-UA', options), end: nextDate.toLocaleDateString('uk-UA', options), result: result };
  updateTable(data.start, data.end, data.result);
  setCountsToLocalStorage(data);
});


// Розрахунок днів при натисканні 'Розрахувати'
btn.addEventListener('click', function(e){
  e.preventDefault();
  let prevDate = new Date(dateBefore.value);
  let nextDate = new Date(dateAfter.value);

  if (!dateAfter.value) {
    alert("Будь ласка, введіть кінцеву дату");
    return
  }

  let result = getFinalCount(prevDate, nextDate);
  resultBlock.textContent = result;

  // збереження отриманих результатів у сховищі
  let data = { start: new Date(dateBefore.value).toLocaleDateString('uk-UA', options), end: nextDate.toLocaleDateString('uk-UA', options), result: result };
  updateTable(data.start, data.end, data.result);
  setCountsToLocalStorage(data);
})


// функція для підрахунку часу в різних одиницях виміру
function timeCounter(number) {
  
  // константи одиниць часу
  const oneHour = 24;
  const oneMinute = 24 * 60;
  const oneSec = 24 * 60 * 60;
  
  // процес розрахунку
  
  if(daysCheck.checked) {
    return(`число днів: ${number}`);
  }
  
  if (hoursCheck.checked) {
    return(`число годин: ${number * oneHour}`);
  }
  
  if (minutesCheck.checked) {
    return(`число хвилин: ${number * oneMinute}`);
  }
  
  if (secondsCheck.checked) {
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

function updateTable(start, end, result) {

  let element = `
  <div class="table-item">
    <div class="startDate">${start}</div>
    <div class="endDate">${end}</div>
    <div class="result">${result}</div>
  </div>
  `
  resultTable.insertAdjacentHTML("beforeend", element);
  

}

