function toggleDropdown(dropdownContent) {
  dropdownContent.classList.toggle('show');
}
function selectOption(button, option, dropdownContent) {
  button.textContent = option.pointOptionsName;
  button.setAttribute('data-raiting', option.coefficient);
  toggleDropdown(dropdownContent);
}

document.getElementById('sub').addEventListener('click', downloadPointsData);
let pointsNum = 0;

let templateArray = [
  {
    templateName: 'softSkills',
    points: [
      { pointName: 'Время начала', pointType: 'Time' },
      {
        pointName: 'Опоздание',
        pointType: 'Select',
        pointOptions: [
          { pointOptionsName: 'Неуважительная', coefficient: -1 },
          { pointOptionsName: 'Уважительная', coefficient: 0 },
        ],
      },
      {
        pointName: 'Пришёл',
        pointType: 'Select',
        pointOptions: [
          { pointOptionsName: 'раньше', coefficient: 1 },
          { pointOptionsName: 'вовремя', coefficient: 0.5 },
          { pointOptionsName: 'от 5 мин. до 15 мин', coefficient: -1 },
          { pointOptionsName: 'от 15 мин. и более', coefficient: -2 },
        ],
      },
      {
        pointName: 'Сколько времени у вас есть для нашего разговора?',
        pointType: 'Select',
        pointOptions: [
          { pointOptionsName: 'да', coefficient: 1 },
          { pointOptionsName: 'скорее да', coefficient: 0.5 },
          { pointOptionsName: 'Сложно для определения', coefficient: 0 },
          { pointOptionsName: 'скорее нет', coefficient: -0.5 },
          { pointOptionsName: 'нет', coefficient: -1 },
        ],
      },
      {
        pointName:
          'Расскажите о том, о чем вы готов поделиться сейчас, что то не связанное с нашим сегодняшним интервью?',
        pointType: 'Select',
        pointOptions: [
          { pointOptionsName: 'да', coefficient: 1 },
          { pointOptionsName: 'скорее да', coefficient: 0.5 },
          { pointOptionsName: 'Сложно для определения', coefficient: 0 },
          { pointOptionsName: 'скорее нет', coefficient: -0.5 },
          { pointOptionsName: 'нет', coefficient: -1 },
        ],
      },
      {
        pointName: 'Почему откликнулся -лась именно на нашу вакансию?',
        pointType: 'Select',
        pointOptions: ['мотивация материальная', 'мотивация нематериальная'],
      },
      {
        pointName: 'Есть ли еще отклики и запланированные собеседования?',
        pointType: 'Select',
        pointOptions: [
          { pointOptionsName: 'да', coefficient: 1 },
          { pointOptionsName: 'скорее да', coefficient: 0.5 },
          { pointOptionsName: 'Сложно для определения', coefficient: 0 },
          { pointOptionsName: 'скорее нет', coefficient: -0.5 },
          { pointOptionsName: 'нет', coefficient: -1 },
        ],
      },
      {
        pointName: 'Кандидат убедил специалиста о наличие опыта',
        pointType: 'Select',
        pointOptions: [
          { pointOptionsName: 'да', coefficient: 0.5 },
          { pointOptionsName: 'нет', coefficient: -0.5 },
        ],
      },
      {
        pointName: 'Физ. активность',
        pointType: 'Select',
        pointOptions: [
          { pointOptionsName: 'активный', coefficient: 0 },
          { pointOptionsName: 'пассивный', coefficient: 0 },
        ],
      },
      {
        pointName: 'Соц. навыки',
        pointType: 'Select',
        pointOptions: [
          { pointOptionsName: 'замкнутый', coefficient: 0 },
          { pointOptionsName: 'открытый', coefficient: 0 },
        ],
      },
    ],
  },
];

function templatesRender() {
  templateArray.forEach((template) => {
    template.points.forEach((point) => {
      pointsNum++;
      const newPoint = createPointElement(
        point.pointName,
        point.pointType,
        point.pointOptions,
      );
      document.getElementById('template_list').appendChild(newPoint);
      addPointHandler(newPoint);
    });
  });
}
templatesRender();

function downloadPointsData() {
  const pointsData = [];
  const pointElements = document.querySelectorAll('.point');
  let hardSkillsTotalRating = 0;
  let softSkillsTotalRating = 0;
  let totalRating = 0;

  pointElements.forEach((point) => {
    let hardRating = null;
    let softRating = null;
    let select = null;
    let time = null;
    const nameInput = point.querySelector('.point_name');

    if (point.querySelector('.stars_input')) {
      const ratingInputs = point.querySelectorAll(
        'input[name="' + point.id + '"]',
      );

      for (const input of ratingInputs) {
        if (input.checked) {
          hardRating = input.getAttribute('data-raiting');
          break;
        }
      }
      if (!hardRating) {
        hardRating = 0;
      }
      // Преобразуем значение в число для вычисления общего рейтинга
      hardSkillsTotalRating += parseInt(hardRating);
    }

    if (point.querySelector('.choice_input')) {
    }

    if (point.querySelector('.time_input')) {
      const inputValue = point.querySelector('.time_input');
      if (inputValue) {
        time = inputValue.value;
      }
    }
    if (point.querySelector('.select_input')) {
      const buttonValue = point.querySelector('.select_input');

      if (buttonValue) {
        select = buttonValue.textContent;
        softRating = buttonValue.getAttribute('data-raiting');
      }
      softSkillsTotalRating += parseInt(softRating);
    }

    const pointData = {
      id: point.id,
      name: nameInput.value
        ? nameInput.value
        : point.querySelector('.point_span').textContent,
      hardRating: hardRating ? hardRating : null,
      softRating: softRating ? softRating : null,
      time: time ? time : null,
      select: select ? select : null,
    };
    pointsData.push(pointData);
  });

  const dataRows = pointsData
    .map(
      (point) =>
        `${point.name}: ${
          point.hardRating ? 'хард рейтинг: ' + point.hardRating : ''
        }${point.softRating ? 'софт рейтинг: ' + point.softRating : ''} ${
          point.time ? 'время: ' + point.time : ''
        } ${point.select ? 'выбрано: ' + point.select : ''}`,
    )
    .join('\n');
  const hardSkillsTotalRatingRow = `Итоговый (хард скиллы): ${hardSkillsTotalRating}`;
  const softSkillsTotalRatingRow = `Итоговый (софт скиллы): ${softSkillsTotalRating}`;
  totalRating = hardSkillsTotalRating + softSkillsTotalRating;
  const totalRatingRow = `Итоговый (общий): ${totalRating}`;

  const notes = 'Заметка: ' + document.getElementById('notes').value || '';

  const fileName =
    document.getElementById('doc_title').value || 'собеседование';
  const creatorName = localStorage.getItem('username');
  const headerRow = `${'Собеседуемый: ' + fileName}\n${
    'Собеседовал: ' + creatorName
  }\n${hardSkillsTotalRatingRow}\n${softSkillsTotalRatingRow}\n${totalRatingRow}`;
  const fileContent = `${headerRow}\n${dataRows}\n${notes}`;

  const blob = new Blob([fileContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${fileName}.txt`;
  downloadLink.click();
}

function addAllPoints() {
  let numbers = document.getElementById('points_num').value;
  for (let i = 0; i < numbers; i++) {
    addPoint();
  }
}

function addPoint() {
  pointsNum++;
  const newPoint = createPointElement(`Пункт (${pointsNum})`, 'Star', '');
  document.getElementById('points_list').appendChild(newPoint);
  addPointHandler(newPoint);
}

function createPointElement(pointName, pointType, pointOptions) {
  const pointWrapper = document.createElement('div');
  pointWrapper.classList.add('point');
  pointWrapper.id = pointsNum;

  const innerDiv = document.createElement('div');
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete_point');
  deleteBtn.classList.add('dark_ed');
  // deleteBtn.id = `delete_${pointsNum}`;
  deleteBtn.textContent = 'x';
  innerDiv.appendChild(deleteBtn);

  const span = document.createElement('span');
  span.textContent = pointName;
  span.classList.add('point_span');
  innerDiv.appendChild(span);

  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('point_name');
  input.classList.add('dark_ed');
  innerDiv.appendChild(input);

  pointWrapper.appendChild(innerDiv);

  switch (pointType) {
    case 'Choice':
      const choiceInput = document.createElement('input');
      choiceInput.type = 'number';
      choiceInput.min = '0';
      choiceInput.max = '1';
      choiceInput.classList.add('dark_ed');
      choiceInput.classList.add('choice_input');
      pointWrapper.appendChild(choiceInput);
      break;

    case 'Star':
      const starsDiv = document.createElement('div');
      starsDiv.classList.add('stars');
      starsDiv.classList.add('stars_input');
      const span1 = document.createElement('span');
      span1.textContent = '1';
      starsDiv.appendChild(span1);
      for (let i = 1; i <= 5; i++) {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.setAttribute('data-raiting', i);
        radio.name = pointsNum;
        starsDiv.appendChild(radio);
      }
      const span5 = document.createElement('span');
      span5.textContent = '5';
      starsDiv.appendChild(span5);
      pointWrapper.appendChild(starsDiv);
      break;

    case 'Time':
      const timeInput = document.createElement('input');
      timeInput.type = 'time';
      timeInput.classList.add('dark_ed');
      timeInput.classList.add('time_input');
      pointWrapper.appendChild(timeInput);
      break;

    case 'Select':
      const dropdown = document.createElement('div');
      dropdown.classList.add('dropdown');

      const dropdownContent = document.createElement('div');
      dropdownContent.classList.add('dark_ed');
      dropdownContent.classList.add('dropdown-content');

      const button = document.createElement('button');
      button.id = `dropdown-btn_${pointsNum}`;
      button.classList.add('dark_ed');
      button.classList.add('select_input');
      button.setAttribute('data-raiting', 0);
      button.textContent = 'Выберите вариант';
      button.addEventListener('click', () => toggleDropdown(dropdownContent));
      dropdown.appendChild(button);

      pointOptions.forEach((option) => {
        let optionElem = document.createElement('a');
        //optionElem.classList.add('select_input_option');
        //optionElem.setAttribute('data-id', `dropdown-btn_${pointsNum}`);
        optionElem.value = option.pointOptionsName;
        optionElem.text = option.pointOptionsName;
        optionElem.setAttribute('data-raiting', option.coefficient);
        optionElem.addEventListener('click', () =>
          selectOption(button, option, dropdownContent),
        );
        dropdownContent.appendChild(optionElem);
      });
      dropdown.appendChild(dropdownContent);
      pointWrapper.appendChild(dropdown);

      // selectInput.addEventListener('change', function () {
      //   const selectedOptions = Array.from(this.options).filter(
      //     (option) => option.selected,
      //   );

      //   // Перебираем все варианты и добавляем/удаляем классы
      //   Array.from(this.options).forEach((option) => {
      //     if (selectedOptions.includes(option)) {
      //       option.classList.add('active_option');
      //     } else {
      //       option.classList.remove('active_option');
      //       option.classList.add('hide-option');
      //     }
      //   });
      // });
      break;

    default:
      break;
  }

  return pointWrapper;
}

function addPointHandler(point) {
  const deleteBtn = point.querySelector('.delete_point');
  deleteBtn.addEventListener('click', deletePoint);
}

function deletePoint(event) {
  const deleteBtn = event.target;
  const point = deleteBtn.parentNode.parentNode;
  point.remove();
}
