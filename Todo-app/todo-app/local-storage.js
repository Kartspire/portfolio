export function getTodoList(owner) {
  if (localStorage.getItem(owner)) {
    return JSON.parse(localStorage.getItem(owner));
  }
}
export function createTodoItem({ owner, name }) {
  let done = false;
  let localItems;
  if (localStorage.getItem(owner) !== null) {
    localItems = JSON.parse(localStorage.getItem(owner));
  } else {
    localItems = [];
    localStorage.setItem(owner, JSON.stringify(localItems));
  }
  const todoItem = {
    owner,
    name,
    done: done,
    id: Math.floor(Math.random() * Math.pow(10, 7)),
  };
  localItems.push(todoItem);
  localStorage.setItem(owner, JSON.stringify(localItems));
  return todoItem;
}

export function switchTodoItemDone({ todoItem }) {
  todoItem.done = !todoItem.done;
  let todoItemId = todoItem.id;
  const localItems = JSON.parse(localStorage.getItem(todoItem.owner));
  let switchingItem = localItems.find((item) => item.id === todoItemId);
  Object.assign(
    localItems.find((item) => item.id === todoItemId),
    (switchingItem.done = todoItem.done)
  );
  localStorage.setItem(todoItem.owner, JSON.stringify(localItems));
}

export function deleteTodoItem({ element, todoItem }) {
  if (!confirm("Вы уверены?")) {
    return;
  }
  element.remove();
  const localItems = JSON.parse(localStorage.getItem(todoItem.owner));
  let index = localItems.findIndex((el) => el.name === todoItem.name);
  localItems.splice(index, 1);
  localStorage.setItem(todoItem.owner, JSON.stringify(localItems));
}
