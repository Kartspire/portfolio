export class ValidationError extends Error {
  constructor(message, inp, label) {
    super();
    this.message = message;
    this.inp = inp;
    this.label = label;
  }
  showErrorMessage() {
    this.inp.classList.add('is-invalid');
    this.label.textContent = this.message;
  }
}
