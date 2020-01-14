import utils from './utils';
import idGenerator from './idGenerator';

export default class TodoItem {
  constructor(todoText, todoId) {
    this.todoText = todoText;
    this.todoId = todoId || idGenerator();
    this.isCompleted = false;
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

    const $todoCheckbox = utils.createDOMElement('input', { type: 'checkbox', className: 'todo-item__checkbox', id: this.todoId });
    const $todoToggleBtn = utils.createDOMElement('div', { className: 'todo-item__toggle' });

    const $label = utils.createDOMElement('label',
      { for: this.todoId, className: 'todo-item__label' }, [$todoCheckbox, $todoToggleBtn]);

    this.$todoItem = utils.createDOMElement('div',
      { 'data-todoId': this.todoId, className: 'todo-item' }, [$label, this.$todoText, $todoDeleteBtn]);

    return this.$todoItem;
  }

  createInputForEditTodo(storage, variables) {
    this.$todoText.textContent = '';

    const $inputForEdit = utils.createDOMElement('input',
      {
        type: 'text',
        className: 'input input_text todo-item__input todo-item__input_for-edit',
        value: this.todoText,
      });

    $inputForEdit.addEventListener('blur', () => {
      // eslint-disable-next-line no-param-reassign
      variables.isEditModeActive = false;

      storage.updateObject((todo) => todo.todoId === this.todoId,
        { todoText: $inputForEdit.value });
      this.$todoText.textContent = $inputForEdit.value;
      this.$todoItem.removeChild($inputForEdit);
    });

    $inputForEdit.addEventListener('keypress', ({ key }) => {
      if (key === 'Enter') {
        $inputForEdit.blur();
      }
    });

    this.$todoItem.prepend($inputForEdit);
    $inputForEdit.focus();
  }
}
