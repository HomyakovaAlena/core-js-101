class Selector {
  constructor({
    element, class1, id, attr, pseudoClass, pseudoElement,
  }) {
    this.element1 = element;
    this.id1 = id;
    this.class1 = class1 ? [class1] : [];
    this.attr1 = attr ? [attr] : [];
    this.pseudoClass1 = pseudoClass ? [pseudoClass] : [];
    this.pseudoElement1 = pseudoElement;
    this.correctOrder = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
  }

  returnComplexSelector() {
    return [
      this.element1, this.id1, this.class1, this.attr1, this.pseudoClass1, this.pseudoElement1,
    ];
  }

  verifyOrder(indexElement) {
    const complexSelector = this.returnComplexSelector();
    let flag = false;
    complexSelector.forEach((item, index) => {
      if (index > indexElement && item && item.length) {
        flag = true;
      }
      return true;
    });
    return flag;
  }

  element(value) {
    if (this.element1) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    if (this.verifyOrder(this.correctOrder.indexOf('element'))) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    this.element1 = value;
    return this;
  }

  id(value) {
    if (this.verifyOrder(this.correctOrder.indexOf('id'))) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    if (this.id1) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    this.id1 = value;
    return this;
  }

  class(value) {
    if (this.verifyOrder(this.correctOrder.indexOf('class'))) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    if (this.class1.length) {
      this.class1.push(value);
    } else {
      this.class1 = [value];
    }
    return this;
  }

  attr(value) {
    if (this.verifyOrder(this.correctOrder.indexOf('attr'))) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    if (this.attr1.length) {
      this.attr1.push(value);
    } else {
      this.attr1 = [value];
    }
    return this;
  }

  pseudoClass(value) {
    if (this.verifyOrder(this.correctOrder.indexOf('pseudoClass'))) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    if (this.pseudoClass1.length) {
      this.pseudoClass1.push(value);
    } else {
      this.pseudoClass1 = [value];
    }
    return this;
  }

  pseudoElement(value) {
    if (!this.pseudoElement1) {
      this.pseudoElement1 = value;
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
        return null;
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
      } else if (!Array.isArray(item) && item.length) {
        result += Selector.switchitem(index, item);
      }
      return false;
    });
    return result;
  }
}

module.exports = { Selector };
