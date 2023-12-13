function generateCardStyle(cardData) {
  let backG;
  if (cardData.cardBackgroundPhoto) {
    backG = `background: url('${cardData.cardBackgroundPhoto}');`;
  } else {
    backG = `background-color: ${
      cardData.cardBackgroundColor ? cardData.cardBackgroundColor : 'var(--navLightBg)'
    };`;
  }

  return `color: ${
    cardData.cardColor ? cardData.cardColor : '#FFF'
  };font-family: ${
    cardData.cardFont ? cardData.cardFont : 'Comfortaa'
  }, sans-serif; ${backG}`;
}

export function returnCard(cardData) {
  return `
    <div class="card ${cardData.cardName}" data-programId="${cardData.cardId}">
        <div class="cardTitle" style="${generateCardStyle(cardData)}">${
    cardData.cardName
  }</div>
        <div class="cardDescription">${
          cardData.cardDescription
            ? cardData.cardDescription
            : 'Описание приложения'
        }</div>
    </div>`;
}
