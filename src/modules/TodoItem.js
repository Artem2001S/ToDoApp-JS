import utils from './utils';

export default class TodoItem {
  constructor(todoText, todoId, isCompleted) {
    this.todoText = todoText;
    this.todoId = todoId || this.generateId();
    this.isCompleted = isCompleted || false;
  }

  getTodoObject() {
    return {
      todoText: this.todoText,
      todoId: this.todoId,
      isCompleted: this.isCompleted,
    };
  }

  getTodoDOM() {
    this.$todoText = utils.createDOMElement('span', { className: 'todo-item__input' }, [this.todoText]);
    const $todoDeleteBtn = utils.createDOMElement('div', { className: 'todo-item__delete-btn' });

    this.$todoCheckbox = utils.createDOMElement('input',
      {
        type: 'checkbox',
        className: 'todo-item__checkbox',
        id: this.todoId,
        checked: this.isCompleted,
      });

    const $todoToggleBtn = utils.createDOMElement('div', { className: 'todo-item__toggle' });

    const $label = utils.createDOMElement('label',
      { for: this.todoId, className: 'todo-item__label' }, [this.$todoCheckbox, $todoToggleBtn]);

    this.$todoItem = utils.createDOMElement('div',
      { 'data-todoId': this.todoId, className: 'todo-item' }, [$label, this.$todoText, $todoDeleteBtn]);

    if (this.isCompleted) {
      this.isCompletedChanged();
    }
    return this.$todoItem;
  }

  createInputForEditTodo(handler) {
    this.$todoText.textContent = '';

    const $inputForEdit = utils.createDOMElement('input',
      {
        type: 'text',
        className: 'input input_text todo-item__input todo-item__input_for-edit',
        value: this.todoText,
      });

    $inputForEdit.addEventListener('blur', handler.bind($inputForEdit, this));

    $inputForEdit.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter') {
        $inputForEdit.blur();
      }
      if (key === 'Escape') {
        $inputForEdit.value = this.todoText;
        $inputForEdit.blur();
      }
    });

    this.$todoItem.prepend($inputForEdit);
    $inputForEdit.focus();
  }

  isCompletedChanged() {
    this.$todoText.classList.toggle('todo-item__input_completed');
  }
}
