export default {
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
};
