drinks.forEach(drink => {
  const card = document.createElement('div');
  card.className = 'food-card';

  if (drink.image) {
    const img = document.createElement('img');
    img.src = drink.image;
    img.onerror = () => img.style.display = 'none';
    card.appendChild(img);
  }

  const info = document.createElement('div');
  info.className = 'food-info';
  info.innerHTML = `<h4>${drink.name} <span>${drink.price} د.ع</span></h4>`;
  card.appendChild(info);

  document.body.appendChild(card); // أو أينما تعرض البطاقات
});
