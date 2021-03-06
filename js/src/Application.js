/* eslint-disable no-restricted-syntax */
class Application {
  /**
   * @param {Object} basket
   * @param {Object} discounts
   * @returns {!number}
   */

  static getDiscountIdArray(discounts) {
    const discountkeysarray = Object.keys(discounts);
    return discountkeysarray;
  }

  static getBasketId(basket) {
    const basketid = Object.keys(basket)[0];
    return basketid;
  }

  static sizeOfBasket(basket) {
    let size = 0;
    if (Object.keys(basket).length > 0) {
      size = Object.keys(basket).length;
    }
    return size;
  }

  static checkBasketIfInUse(basket) {
    let pricevalue = 0;
    if (this.sizeOfBasket(basket) > 1) {
      // eslint-disable-next-line guard-for-in
      pricevalue += (basket.price * basket.quantity);
    } else if (this.sizeOfBasket(basket) === 1) {
      pricevalue = basket[this.getBasketId(basket)].price;
    }
    return pricevalue;
  }

  static getPercentDiscount(price, discounts, discountid) {
    let discountamount = 0;
    const itemprice = price;
    const discountvalue = discounts[discountid].value;
    discountamount = itemprice * (discountvalue / 100);

    return discountamount;
  }


  static getAbsoluteDiscount(discounts, discountid) {
    const discountamount = discounts[discountid].value;

    return discountamount;
  }

  static getBuyNGetMFree(n, m, price, basketquantity) {
    let counter = 1;
    let pricetobepaid = 0;
    let discountamount = 0;

    for (let i = 1; i <= basketquantity; i++) {
      if (counter <= n) {
        pricetobepaid += price;
        counter += 1;
      } else {
        counter = 1;
      }
    }

    discountamount = price - pricetobepaid;
    return discountamount;
  }

  static makeArrayOfGivenLength(length, item) {
    const myarray = [];
    for (let i = 0; i < length; i++) {
      myarray.push(item);
    }
    return myarray;
  }

  static nForThePriceOfM(n, m, price, basketquantity) {
    const arrayofprices = this.makeArrayOfGivenLength(basketquantity, price);
    let totalprice = 0;
    let subarray = [];
    let x = 0;
    let discountamount = 0;

    while (arrayofprices.length !== 0) {
      for (let i = 0; i < n; i++) {
        if (arrayofprices.length > 0) {
          x = arrayofprices.pop();
          subarray.push(x);
        }
      }
      if (subarray.length > 0) {
        for (let j = 0; j < subarray.length; j++) {
          if (j <= (m - 1)) {
            totalprice += subarray[j];
          }
        }
        subarray = [];
      }
    }
    discountamount = price - totalprice;
    return discountamount;
  }

  static applyDiscount(discountsArray, price, discounts, basketquantity) {
    let discountamount = 0;
    let discountedprice = price;
    let discountid = '';
    // eslint-disable-next-line guard-for-in
    for (let i = 0; i < discountsArray.length; i++) {
      discountid = discountsArray[i];
      const discounttype = discounts[discountsArray[i]].type;
      const discountminimum = discounts[discountid].min;
      const discountm = discounts[discountid].m;
      const discountn = discounts[discountid].n;

      if (discounttype === 'percent' && basketquantity >= discountminimum) {
        discountamount = this.getPercentDiscount(discountedprice, discounts, discountid);
        discountedprice -= discountamount;
      } else if (discounttype === 'absolute' && basketquantity >= discountminimum) {
        discountamount = this.getAbsoluteDiscount(discounts, discountid);
        discountedprice -= discountamount;
      } else if (discounttype === 'buyNGetMFree' && basketquantity >= discountminimum) {
        discountamount = this.getBuyNGetMFree(discountn, discountm, discountedprice, basketquantity);
        discountedprice -= discountamount;
      } else if (discounttype === 'nForThePriceOfM' && basketquantity >= discountminimum) {
        discountamount = this.nForThePriceOfM(discountn, discountm, discountedprice, basketquantity);
        discountedprice -= discountamount;
      } else {
        discountedprice *= basketquantity;
      }
    }
    return discountedprice;
  }

  static howManyItemsInTheBasket(basket) {
    let basketquantity = 0;
    const size = this.sizeOfBasket(basket);
    if (size > 0) {
      basketquantity = basket[this.getBasketId(basket)].quantity;
    } else {
      basketquantity = 0;
    }
    return basketquantity;
  }


  static doDiscountsExist(discounts, price, basketquantity) {
    let subtotal = 0;
    const discountsArray = this.getDiscountIdArray(discounts);
    if (discountsArray.length > 0) {
      subtotal = this.applyDiscount(discountsArray, price, discounts, basketquantity);
    } else {
      subtotal = price;
    }
    return subtotal;
  }

  static forManyBaskets(baskets) {
    let price = 0;
    if (Object.keys(baskets).length > 1) {
      // eslint-disable-next-line guard-for-in
      for (let i in baskets) {
        const basket = baskets[i];
        price += this.checkBasketIfInUse(basket);
      }
    } else {
      price = this.checkBasketIfInUse(baskets);
    }
    return price;
  }

  static main(basket, discounts) { // eslint-disable-line no-unused-vars
    const price = this.forManyBaskets(basket);
    const basketquantity = this.howManyItemsInTheBasket(basket);
    let total = 0;

    total = this.doDiscountsExist(discounts, price, basketquantity);

    return total;
  }
}

module.exports = Application;
