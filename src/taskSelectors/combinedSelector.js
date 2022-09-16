class CombinedSelector {
  constructor(...value) {
    this.elements = value ? [...value] : [];
  }

  stringify() {
    let result = '';
    this.elements.forEach((element) => {
      result += element.stringify ? element.stringify() : ` ${element} `;
    });
    return result;
  }
}

module.exports = { CombinedSelector };
