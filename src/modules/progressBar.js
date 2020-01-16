export default {
  $progressBar: document.querySelector('#progress-bar'),
  $progressBarValue: document.querySelector('#progress-bar-value'),
  $progressBarActive: document.querySelector('#progress-bar-active'),

  setNewValue(value) {
    this.$progressBarValue.textContent = `${value}%`;
    this.$progressBarActive.style.width = `${value}%`;
  },

  hideElements() {
    this.$progressBar.style.display = 'none';
  },

  showElements() {
    this.$progressBar.style.display = 'flex';
  },
};
