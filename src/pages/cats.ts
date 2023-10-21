const createImagePlaceholder = (container, minSize) =>
  new Promise((resolve, reject) => {
    let placeholder = null;
    let initCoords = null;
    const minMax = (a, b) => [Math.min(a, b), Math.max(a, b)];
    const toPx = (v) => v + 'px';

    container.onmousedown = (event) => {
      if (placeholder) return;
      initCoords = { x: event.clientX, y: event.clientY };
      placeholder = document.createElement('div');
      placeholder.classList.add('placeholder');
      container.appendChild(placeholder);
    };

    container.onmousemove = (event) => {
      if (!placeholder) return;
      const { clientX, clientY } = event;
      const { x, y } = initCoords;
      const [left, right] = minMax(clientX, x);
      const [top, bottom] = minMax(clientY, y);

      placeholder.style.left = toPx(left);
      placeholder.style.top = toPx(top);
      placeholder.style.width = toPx(right - left);
      placeholder.style.height = toPx(bottom - top);
    };

    container.onmouseup = () => {
      if (!placeholder) return;
      container.onmousedown = null;
      container.onmousemove = null;
      container.onmouseup = null;

      const { width, height } = placeholder.getBoundingClientRect();
      if (width < minSize || height < minSize) {
        reject(new Error('Size is less then needed'));
        return container.removeChild(placeholder);
      }
      resolve(placeholder);
    };
  });
const loadImageToPlaceholder = (placeholder, index) => {
  const int = parseInt;
  const { width, height } = placeholder.getBoundingClientRect();
  const path = `https://loremflickr.com/${int(width)}/${int(height)}?random=${
    index + 1
  }`;
  const image = new Image();
  image.onload = () => {
    image.classList.add('uk-animation-scale-down');
    placeholder.appendChild(image);
  };
  image.src = path;
};
export function removeCats() {
  document.getElementById('cats_place').innerHTML = '';
  makeCats();
}
export async function makeCats() {
  const maxPlaceholders = 1;
  const minSize = 200;
  const placeholders = [];

  while (placeholders.length < maxPlaceholders) {
    try {
      placeholders.push(
        await createImagePlaceholder(
          document.getElementById('cats_place'),
          minSize,
        ),
      );
    } catch (e) {
      console.log('placeholder creation error', e);
      alert('Картинки такого размера не найдено(')
    }
  }
  placeholders.forEach(loadImageToPlaceholder);
  return;
}
