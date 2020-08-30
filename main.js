const TODOS_KEY = 'todos'
// store each to do item
let toDos = [];
const itemText = document.querySelector("#create-to-do input[id='item-name']");
const itemFreq = document.querySelector("#create-to-do input[id='item-frequency']");
const addItem = document.querySelector("#create-to-do button");
const itemListElements = document.querySelector("#to-do-list ol");


function createToDo(text, frequency) {
  console.log(text, frequency);
  // create toDo item
  const newItem = {
    text: text,
    //frequency: frequency,
    checkboxList: [],
    createdAt: new Date(),
    completed: false
  }
  // create checkboxes for total frequency
  for( let i = 0; i < frequency; i++ ) {
    const newCheckbox = {
      completed: false
    }
    newItem.checkboxList.push(newCheckbox);
  }
  // function to create a checkbox for frequency stored in totalTimes

  toDos.push(newItem);
  saveToDos();
  renderToDos();
}

function renderItem(item, i) {
  // create each to do item
  // list element
  const newItem = document.createElement('li');
  // checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.dataset.index = i;
  checkbox.checked = item.completed;
  checkbox.classList.add('completed');
  // display text
  const itemText = document.createElement("span");
  itemText.innerText = item.text;
  itemText.style.display = item.editing ? "none" : "";
  // 'edit' text input
  const itemTextInput = document.createElement('input');
  itemTextInput.value = item.text;
  itemTextInput.classList.add('edited-text');
  itemTextInput.style.display = item.editing ? "" : "none";
  // 'edit' text button
  const editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editButton.classList.add('edit');
  editButton.dataset.index = i;
  // 'delete' button
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.classList.add('delete');
  deleteButton.dataset.index = i;
  // append children
  newItem.appendChild(checkbox);
  newItem.appendChild(itemTextInput);
  newItem.appendChild(itemText);
  newItem.appendChild(editButton);
  newItem.appendChild(deleteButton);

  // create list for each toDo item
  const newList = document.createElement('ol');
  // create checkbox for each iteration of each item
  if( item.checkboxList ) {
    for(let j=0; j < item.checkboxList.length; j++ ) {
      const checkboxItem = document.createElement('li');
      const itemCheckbox = document.createElement('input');
      itemCheckbox.type = 'checkbox';
      itemCheckbox.dataset.parentIndex = i;
      itemCheckbox.dataset.index = j;
      itemCheckbox.checked = item.checkboxList[j].completed;
      itemCheckbox.classList.add('recur-completed');
      checkboxItem.appendChild(itemCheckbox);
      newList.appendChild(checkboxItem);
    }
  }

  newItem.appendChild(newList);

  itemListElements.appendChild(newItem);
}

function renderToDos() {
  console.log("RENDER TO DOS");
  // clear existing items
  itemListElements.innerHTML = '';

  for(let i=0; i < toDos.length; i++) {
    renderItem(toDos[i], i);
  }
}

function saveToDos() {
  // save to local storage
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

function loadToDos() {
  // load from local storage
  const existingToDos = JSON.parse(localStorage.getItem(TODOS_KEY));
  // return empty array if nothing prior saved
  toDos = existingToDos || [];
}

// MAIN
// event listeners
addItem.addEventListener("click", (event) => {
  createToDo(itemText.value, itemFreq.value);
});

// listener for completion checkboxes
itemListElements.addEventListener("change", (event) => {
  if( event.target.classList.contains('completed') ) {
    console.log("CHANGE");
    const index = event.target.dataset.index;
    toDos[index].completed = event.target.checked;
    saveToDos();
  } else if( event.target.classList.contains('recur-completed') ) {
    console.log("RECUR CHANGE");
    const parentIndex = event.target.dataset.parentIndex;
    const index = event.target.dataset.index;
    toDos[parentIndex].checkboxList[index].completed = event.target.checked;
    saveToDos();
  }
})

// listener for edit/delete button clicks
itemListElements.addEventListener("click", (event) => {
  if( event.target.classList.contains('edit') ) {
    const index = event.target.dataset.index;
    // toggle to opposite state
    toDos[index].editing = !toDos[index].editing;
    // get current text field value
    const editedText = event.target.parentElement.querySelector('.edited-text').value;
    toDos[index].text = editedText;
    console.log(editedText);
    saveToDos();
    renderToDos();
  } else if( event.target.classList.contains('delete') ) {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if( confirmed ) {
      const index = event.target.dataset.index;
      toDos.splice(index, 1);
      saveToDos();
      renderToDos();
    }
  }
})

// load and render from local storage
loadToDos();
renderToDos();
