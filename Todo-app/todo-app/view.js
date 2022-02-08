function createAppTitle(title) {
  const appTitle = document.createElement("h2");
  appTitle.innerHTML = title;
  return appTitle;
}
export function createSwitchStorageButton() {
  const switchStorageButton = document.createElement("button");
  switchStorageButton.classList.add("btn", "btn-primary", "mb-5");
  let switcherKey = "switcherKey";
  let switcher;
  if (localStorage.getItem(switcherKey) === null) {
    switcher = false;
  } else {
    switcher = JSON.parse(localStorage.getItem(switcherKey));
  }
  if (switcher) {
    switchStorageButton.textContent = "Перейти на локальное хранилище";
  } else {
    switchStorageButton.textContent = "Перейти на серверное хранилище";
  }
  switchStorageButton.addEventListener("click", () => {
    localStorage.setItem(switcherKey, !switcher);
    window.location.reload();
  });
  return { switcher, switchStorageButton };
}

function createTodoItemForm() {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const buttonWrapper = document.createElement("div");
  const button = document.createElement("button");

  form.classList.add("input-group", "mb-3");
  input.classList.add("form-control");
  input.placeholder = "Ведите название нового дела";
  buttonWrapper.classList.add("input-group-append");
  button.classList.add("btn", "btn-primary");
  button.textContent = "Добавить дело";

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  return {
    form,
    input,
    button,
  };
}

function createTodoList() {
  const list = document.createElement("ul");
  list.classList.add("list-group");
  return list;
}

function createTodoItemElement(todoItem, { onDone, onDelete }) {
  const doneClass = "list-group-item-success";

  const item = document.createElement("li");
  const buttonGroup = document.createElement("div");
  const doneButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  item.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );
  if (todoItem.done) {
    item.classList.add(doneClass);
  }
  item.textContent = todoItem.name;

  buttonGroup.classList.add("btn-group", "btn-group-sm");
  doneButton.classList.add("btn", "btn-success");
  doneButton.textContent = "Готово";
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.textContent = "Удалить";

  doneButton.addEventListener("click", () => {
    onDone({ todoItem, element: item });
    item.classList.toggle(doneClass, todoItem.done);
  });

  deleteButton.addEventListener("click", function () {
    onDelete({ todoItem, element: item });
  });

  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  return item;
}

async function createTodoApp(
  container,
  {
    title,
    owner,
    todoItemList = [],
    onCreateFormSubmit,
    onDoneClick,
    onDeleteClick,
  }
) {
  const todoAppTitle = createAppTitle(title);
  const todoItemForm = createTodoItemForm();
  const todoList = createTodoList();
  const handlers = { onDone: onDoneClick, onDelete: onDeleteClick };
  const todoAppSwitchStorageButton = createSwitchStorageButton();

  container.append(todoAppTitle);
  container.append(todoAppSwitchStorageButton.switchStorageButton);
  container.append(todoItemForm.form);
  container.append(todoList);

  todoItemList.forEach((todoItem) => {
    const todoItemElement = createTodoItemElement(todoItem, handlers);
    todoList.append(todoItemElement);
  });

  todoItemForm.form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!todoItemForm.input.value) {
      return;
    }
    const todoItem = await onCreateFormSubmit({
      owner,
      name: todoItemForm.input.value.trim(),
    });

    const todoItemElement = createTodoItemElement(todoItem, handlers);

    todoList.append(todoItemElement);

    todoItemForm.input.value = "";
  });
}
export { createTodoApp };
