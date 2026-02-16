/**
 * 待办事项应用 - 核心逻辑
 * 基于 PRD 文档实现
 */

const STORAGE_KEY = 'todo-app-todos';

// 生成唯一 ID
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 格式化时间
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`;
  return date.toLocaleDateString('zh-CN');
}

// 优先级配置：1 紧急 2 高 3 中 4 低
const PRIORITY_LABELS = { 1: '紧急', 2: '高', 3: '中', 4: '低' };

// 应用状态
let todos = [];
let filter = 'all';  // all | active | completed
let sortOrder = 'newest';  // newest | oldest
let defaultPriority = 3;  // 添加时默认优先级

// DOM 元素
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const statsEl = document.getElementById('stats');
const clearCompletedBtn = document.getElementById('clear-completed');
const sortSelect = document.getElementById('sort-select');

// 从 LocalStorage 加载
function loadTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    todos = data ? JSON.parse(data) : [];
    // 兼容旧数据：无 priority 的设为 3
    todos.forEach((t) => {
      if (t.priority == null || t.priority < 1 || t.priority > 4) {
        t.priority = 3;
      }
    });
  } catch (e) {
    todos = [];
  }
}

// 保存到 LocalStorage
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 获取过滤后的待办
function getFilteredTodos() {
  let list = [...todos];

  if (filter === 'active') {
    list = list.filter((t) => !t.completed);
  } else if (filter === 'completed') {
    list = list.filter((t) => t.completed);
  }

  list.sort((a, b) =>
    sortOrder === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
  );
  return list;
}

// 渲染单个待办项
function renderTodoItem(todo) {
  const priority = todo.priority >= 1 && todo.priority <= 4 ? todo.priority : 3;
  const li = document.createElement('li');
  li.className = `todo-item priority-${priority} ${todo.completed ? 'completed' : ''}`;
  li.dataset.id = todo.id;

  const priorityBadge = document.createElement('button');
  priorityBadge.type = 'button';
  priorityBadge.className = `todo-priority-badge priority-${priority}`;
  priorityBadge.textContent = priority;
  priorityBadge.setAttribute('aria-label', `优先级 ${priority}，点击切换`);
  priorityBadge.title = `${priority} 级 - ${PRIORITY_LABELS[priority]}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('aria-label', todo.completed ? '标记为未完成' : '标记为已完成');

  const content = document.createElement('div');
  content.className = 'todo-content';

  const title = document.createElement('span');
  title.className = 'todo-title';
  title.textContent = todo.title;

  const meta = document.createElement('div');
  meta.className = 'todo-meta';
  meta.textContent = `创建于 ${formatTime(todo.createdAt)}`;

  content.appendChild(title);
  content.appendChild(meta);

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'todo-delete';
  deleteBtn.setAttribute('aria-label', '删除');
  deleteBtn.innerHTML = '×';

  li.appendChild(priorityBadge);
  li.appendChild(checkbox);
  li.appendChild(content);
  li.appendChild(deleteBtn);

  // 点击优先级徽章循环切换 1→2→3→4→1
  priorityBadge.addEventListener('click', (e) => {
    e.stopPropagation();
    const next = todo.priority >= 4 ? 1 : todo.priority + 1;
    updatePriority(todo.id, next);
  });

  // 勾选切换
  checkbox.addEventListener('change', () => toggleTodo(todo.id));

  // 点击标题进入编辑
  title.addEventListener('click', (e) => {
    if (!e.target.closest('.todo-input-edit')) {
      enterEditMode(li, todo);
    }
  });

  // 删除
  deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

  return li;
}

// 进入编辑模式
function enterEditMode(li, todo) {
  const content = li.querySelector('.todo-content');
  const title = content.querySelector('.todo-title');
  const meta = content.querySelector('.todo-meta');
  const originalTitle = todo.title;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'todo-input-edit';
  input.value = todo.title;
  input.setAttribute('maxlength', '200');

  content.innerHTML = '';
  content.appendChild(input);
  input.focus();

  function saveEdit() {
    const newTitle = input.value.trim();
    if (newTitle) {
      todo.title = newTitle;
      todo.updatedAt = Date.now();
      saveTodos();
    }
    exitEditMode(li, todo, newTitle || originalTitle);
  }

  function cancelEdit() {
    exitEditMode(li, todo, originalTitle);
  }

  input.addEventListener('blur', saveEdit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  });
}

// 退出编辑模式
function exitEditMode(li, todo, displayTitle) {
  const content = li.querySelector('.todo-content');
  const title = document.createElement('span');
  title.className = 'todo-title';
  title.textContent = displayTitle;

  const meta = document.createElement('div');
  meta.className = 'todo-meta';
  meta.textContent = `更新于 ${formatTime(todo.updatedAt)}`;

  content.innerHTML = '';
  content.appendChild(title);
  content.appendChild(meta);

  title.addEventListener('click', () => enterEditMode(li, todo));
}

// 渲染列表
function render() {
  const filtered = getFilteredTodos();

  todoList.innerHTML = '';

  filtered.forEach((todo) => {
    const item = renderTodoItem(todo);
    todoList.appendChild(item);
  });

  // 空状态
  const showEmpty = filtered.length === 0;
  emptyState.classList.toggle('visible', showEmpty);
  todoList.style.display = showEmpty ? 'none' : 'block';

  // 统计
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  statsEl.textContent = `共 ${total} 项，已完成 ${completed} 项`;

  // 清空已完成按钮
  clearCompletedBtn.style.visibility = completed > 0 ? 'visible' : 'hidden';
}

// 添加待办
function addTodo() {
  const title = todoInput.value.trim();
  if (!title) return;

  const now = Date.now();
  const todo = {
    id: uuid(),
    title,
    completed: false,
    priority: defaultPriority,
    createdAt: now,
    updatedAt: now,
  };

  todos.unshift(todo);
  saveTodos();
  todoInput.value = '';
  todoInput.focus();
  render();
}

// 切换完成状态
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
  todo.updatedAt = Date.now();
  saveTodos();
  render();
}

// 删除待办
function deleteTodo(id) {
  const li = todoList.querySelector(`[data-id="${id}"]`);
  if (li) {
    li.classList.add('removing');
    setTimeout(() => {
      todos = todos.filter((t) => t.id !== id);
      saveTodos();
      render();
    }, 250);
  } else {
    todos = todos.filter((t) => t.id !== id);
    saveTodos();
    render();
  }
}

// 更新优先级
function updatePriority(id, priority) {
  const todo = todos.find((t) => t.id === id);
  if (!todo || priority < 1 || priority > 4) return;
  todo.priority = priority;
  todo.updatedAt = Date.now();
  saveTodos();
  render();
}

// 清空已完成
function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  render();
}

// 事件绑定
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTodo();
  }
});

addBtn.addEventListener('click', addTodo);

document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  });
});

sortSelect.addEventListener('change', (e) => {
  sortOrder = e.target.value;
  render();
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// 优先级选择器
document.querySelectorAll('.priority-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.priority-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    defaultPriority = parseInt(btn.dataset.priority, 10);
  });
});

// 初始化
loadTodos();
render();
todoInput.focus();
