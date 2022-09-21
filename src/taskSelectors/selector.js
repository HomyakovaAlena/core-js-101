class Selector {
  constructor({
    element, class1, id, attr, pseudoClass, pseudoElement,
  }) {
    this.elementItem = element;
    this.idItem = id;
    this.classItem = class1 ? [class1] : [];
    this.attrItem = attr ? [attr] : [];
    this.pseudoClassItem = pseudoClass ? [pseudoClass] : [];
    this.pseudoElementItem = pseudoElement;
    this.correctOrder = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
  }

  returnComplexSelector() {
    const result = [];
    this.correctOrder.forEach((item) => {
      result.push(this[`${item}Item`]);
    });
    return result;
  }

  verifyOrder(indexElement) {
    const complexSelector = this.returnComplexSelector();
    let flag = false;
    complexSelector.forEach((item, index) => {
      if (index > indexElement && item && item.length) {
        flag = true;
      }
      return flag;
    });
    return flag;
  }

  element(value) {
    if (this.elementItem) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    if (this.verifyOrder(this.correctOrder.indexOf('element'))) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    this.elementItem = value;
    return this;
  }

  id(value) {
    if (this.verifyOrder(this.correctOrder.indexOf('id'))) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    if (this.idItem) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    this.idItem = value;
    return this;
  }

  class(value) {
    if (this.verifyOrder(this.correctOrder.indexOf('class'))) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    if (this.classItem.length) {
      this.classItem.push(value);
    } else {
      this.classItem = [value];
    }
    return this;
  }

  attr(value) {
    if (this.verifyOrder(this.correctOrder.indexOf('attr'))) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    if (this.attrItem.length) {
      this.attrItem.push(value);
    } else {
      this.attrItem = [value];
    }
    return this;
  }

  pseudoClass(value) {
    if (this.verifyOrder(this.correctOrder.indexOf('pseudoClass'))) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    if (this.pseudoClassItem.length) {
      this.pseudoClassItem.push(value);
    } else {
      this.pseudoClassItem = [value];
    }
    return this;
  }

  pseudoElement(value) {
    if (!this.pseudoElementItem) {
      this.pseudoElementItem = value;
      return this;
    }
    throw new Error(
      'Element, id and pseudo-element should not occur more then one time inside the selector',
    );
  }

  static switchitem(index, item) {
    let result = '';
    switch (index) {
      case 0:
        result += `${item}`;
        break;
      case 1:
        result += `#${item}`;
        break;
      case 2:
        result += `.${item}`;
        break;
      case 3:
        result += `[${item}]`;
        break;
      case 4:
        result += `:${item}`;
        break;
      case 5:
        result += `::${item}`;
        break;
      default:
        return '';
    }
    return result;
  }

  stringify() {
    let result = '';
    const complexSelector = this.returnComplexSelector();
    complexSelector.forEach((item, index) => {
      if (!item) {
        return false;
      }
      if (Array.isArray(item)) {
        item.forEach((subitem) => {
          result += Selector.switchitem(index, subitem);
          return false;
        });
      } else {
        result += Selector.switchitem(index, item);
      }
      return false;
    });
    return result;
  }
}

module.exports = { Selector };
