const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

let items = [];

function handleSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.item.value;
  if (!name) {
    return;
  }
  const item = {
    name,
    id: Date.now(),
    checked: false,
  };

  items.push(item);
  e.target.reset();

  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
  const html = items.map((item) => {
    return `<li class='shopping-item'>
            <input type='checkbox' value=${item.id} ${
      item.checked ? 'checked' : ''
    } />
            <span class='itemName'>${item.name}</span>
            <button value=${item.id} aria-label='Remove ${
      item.name
    }'>&times;</button>
        </li>`;
  });
  list.innerHTML = html.join('');
}

function saveToLocalStorage() {
  localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage() {
  const lsItems = JSON.parse(localStorage.getItem('items'));
  items.push(...lsItems);
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function deleteItem(id) {
  const filteredItems = items.filter((item) => item.id !== id);
  items = [...filteredItems];
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function checkedOrNot(id) {
  console.log(id);
  const itemRef = items.find((item) => item.id === id);
  console.log(itemRef);
  itemRef.checked = !itemRef.checked;
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', saveToLocalStorage);

list.addEventListener('click', (e) => {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('[type="checkbox"]')) {
    checkedOrNot(id);
  }
});
restoreFromLocalStorage();