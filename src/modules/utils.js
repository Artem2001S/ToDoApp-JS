export default {
  isAlertShown: false,
  createDOMElement(tag, options, childrens) {
    const $element = document.createElement(tag);

    Object.keys(options).forEach((option) => {
      if (option.startsWith('data-')) {
        $element.setAttribute(option, options[option]);
      } else {
        $element[option] = options[option];
      }
    });

    if (childrens !== null && childrens instanceof Array) {
      childrens.forEach(($children) => {
        $element.append($children);
      });
    }

    return $element;
  },

  showAlert(message, hideAlertTimeout) {
    if (this.isAlertShown) return;

    this.isAlertShown = true;

    const $alert = this.createDOMElement('div', { className: 'alert' });
    $alert.textContent = message;
    document.body.append($alert);

    setTimeout(() => {
      $alert.style.animation = 'hide-alert 1s';
      $alert.addEventListener('animationend', () => {
        document.body.removeChild($alert);
        this.isAlertShown = false;
      });
    }, hideAlertTimeout);
  },

  getIdFromParent($element) { return Number($element.parentNode.dataset.todoid); },
};
