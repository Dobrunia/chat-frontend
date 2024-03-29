// Переменные
const fileInput = document.getElementById('fileInput');
const opacityInput = document.getElementById('opacityInput');
const generatePuzzleButton = document.getElementById('generatePuzzleButton');
const photoPreview = document.querySelector('.photo_preview');
const placeForBlocks = document.querySelector('.place_for_blocks'); // Зона 1
const blocksContainer = document.querySelector('.blocks_container'); // Зона 2
const buttonCheck = document.getElementById('puzzleCheck');
let imageWidth;
const imageHeight = 400; // Фиксированная высота 400px
let blockCount;
let blockWidth;
const blockHeight = 50;
const rowCount = imageHeight / blockHeight;
const colCount = 8;

// Обработчики событий
fileInput.addEventListener('change', handleFileInputChange);
opacityInput.addEventListener('input', handleOpacityInputChange);
generatePuzzleButton.addEventListener('click', generatePuzzle);
buttonCheck.addEventListener('click', () => alert(checkSequence()));
placeForBlocks.ondragover = allowDrop;
blocksContainer.ondragover = allowDrop;
placeForBlocks.ondrop = drop;
blocksContainer.ondrop = drop;

// Функции

export async function startProgram() {
  console.log('start');
}

// Обработчик изменения файла
function handleFileInputChange() {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.addEventListener('load', handleFileLoad);
    reader.readAsDataURL(file);
  }
}

// Обработчик загрузки файла
function handleFileLoad(event) {
  photoPreview.style.backgroundImage = `url('${event.target.result}')`;
  clearBlocks();
}

// Обработчик изменения прозрачности
function handleOpacityInputChange() {
  photoPreview.style.opacity = opacityInput.value;
}

// Разрешить перетаскивание на элемент
function allowDrop(event) {
  event.preventDefault();
}

// Обработчик сброса элемента
function drop(event) {
  if (event.target.classList.contains('block_zone')) {
    if (event.target.childElementCount === 0) {
      const itemId = event.dataTransfer.getData('id');
      event.target.appendChild(document.getElementById(itemId));
    }
  }

  if (event.target.classList.contains('blocks_container')) {
    const itemId = event.dataTransfer.getData('id');
    event.target.append(document.getElementById(itemId));
  }

  buttonCheck.disabled = hasNoChildren(blocksContainer);
}

// Генерация головоломки
function generatePuzzle() {
  if (!fileInput.files || !fileInput.files[0]) {
    alert('Файл с фотографией не выбран!');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = handleImageLoad;
  reader.readAsDataURL(file);

  clearBlocks();
}

// Обработчик загрузки изображения
function handleImageLoad(event) {
  const image = new Image();
  image.onload = function () {
    imageWidth = image.width * (imageHeight / image.height);
    placeForBlocks.style.width = imageWidth + 'px';
    placeForBlocks.style.outline = '2px solid #37a5ff';
    blockCount = colCount * rowCount;
    blockWidth = imageWidth / colCount;

    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        const block = createBlock(row, col, event.target.result);
        const randomPosition = Math.floor(Math.random() * blockCount);
        blocksContainer.insertBefore(
          block,
          blocksContainer.children[randomPosition],
        );
      }
    }

    createBlockZones();
    enableDragOnBlocks();
    buttonCheck.disabled = hasNoChildren(blocksContainer);
  };

  image.src = event.target.result;
}

// Создание и стилизация блока
function createBlock(row, col, imageSrc) {
  const block = document.createElement('div');
  block.className = 'block';
  block.id = row + '' + col;
  block.draggable = true;
  block.style.width = blockWidth + 'px';
  block.style.height = blockHeight + 'px';
  block.style.backgroundImage = `url(${imageSrc})`;
  block.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
  block.style.backgroundPosition = `-${col * blockWidth}px -${
    row * blockHeight
  }px`;
  return block;
}

// Создание блок-зон
function createBlockZones() {
  for (let i = 0; i < blockCount; i++) {
    const block_zone = document.createElement('div');
    block_zone.className = 'block_zone';
    block_zone.style.width = blockWidth + 'px';
    block_zone.style.height = blockHeight + 'px';
    placeForBlocks.appendChild(block_zone);
  }
}

// Включение перетаскивания на блоках
function enableDragOnBlocks() {
  const blocks = document.querySelectorAll('.block');
  blocks.forEach((block) => {
    block.ondragstart = handleBlockDragStart;
  });
}

// Обработчик начала перетаскивания блока
function handleBlockDragStart(event) {
  event.dataTransfer.setData('id', event.target.id);
}

// Очистить блоки в блок-контейнере
function clearBlocks() {
  const blocks = blocksContainer.querySelectorAll('.block');
  blocks.forEach(function (block) {
    if (block.parentNode === blocksContainer) {
      blocksContainer.removeChild(block);
    }
  });

  const blockZones = document.querySelectorAll('.block_zone');
  blockZones.forEach(function (blockZone) {
    if (blockZone.parentNode === placeForBlocks) {
      placeForBlocks.removeChild(blockZone);
    }
  });
}

// Проверка последовательности блоков
function checkSequence() {
  const blockZones = document.querySelectorAll('.block_zone');
  let expectedId = 0;

  for (let i = 0; i < blockZones.length; i++) {
    const block = blockZones[i].querySelector('.block');
    if (!block) {
      return 'Есть ошибка';
    }

    const currentId = Number(block.id);
    if (currentId < expectedId) {
      return 'Есть ошибка';
    }
    expectedId = currentId;
  }

  return 'Все верно';
}

// Проверить, есть ли дочерние элементы у элемента
function hasNoChildren(element) {
  return !(element.childElementCount === 0);
}
