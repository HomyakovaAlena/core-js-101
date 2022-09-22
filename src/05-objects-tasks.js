
/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */

// eslint-disable-next-line max-classes-per-file
function Rectangle(width, height) {
  const rectangle = {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
  return rectangle;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const prop = JSON.parse(json);
  const obj = { __proto__: proto, ...prop };
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */


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


const cssSelectorBuilder = {
  element(value) {
    return new Selector({ element: value });
  },

  id(value) {
    return new Selector({ id: value });
  },

  class(value) {
    return new Selector({ class1: value });
  },

  attr(value) {
    return new Selector({ attr: value });
  },

  pseudoClass(value) {
    return new Selector({ pseudoClass: value });
  },

  pseudoElement(value) {
    return new Selector({ pseudoElement: value });
  },

  combine(selector1, combinator, selector2) {
    return new CombinedSelector(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
