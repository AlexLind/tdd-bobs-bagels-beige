const { Bagel } = require("../src/bagel.js");
const deals = require("../src/deals.js");

class Basket {
  constructor(basketQuantity = 3) {
    this.contents = [];
    this.IDcounter = 0;
    this.capacity = basketQuantity;
    this.counts = {};
  }

  addBagel(SKU, numOfBagels = 1) {
    this.#addMultipleBagelsLoop(SKU,numOfBagels)
    return this.contents;
  }

  removeBagel(id) {
    for (let i = 0; i < this.contents.length; i++) {
      if (this.contents[i].id === id) {
        this.contents.splice([i], 1);
        return this.contents;
      }
    }
    return "Bagel isn't in basket";
  }

  basketIsFull() {
    if (this.contents.length >= this.capacity) {
      return true;
    }
    return false;
  }

  countBagelsInBasket() {
    this.counts = {};
    for (let i = 0; i < this.contents.length; i++) {
      const SKU = this.contents[i]["SKU"];
      if (!this.counts.hasOwnProperty(SKU)) {
        this.counts[`${SKU}`] = 1;
      } else {
        this.counts[`${SKU}`]++;
      }
    }
    return this.counts;
  }

  static getSubtotal(counts, SKU) {
    const { count, dealQuantity, dealPrice, bagelPrice } = this.#getDeals(counts, SKU);
    const dealSum = Math.floor(count / dealQuantity) * dealPrice;
    const nonDealSum = (count % dealQuantity) * bagelPrice;
    return Number((dealSum + nonDealSum).toFixed(2));
  }



  getTotal() {
    const counts = this.counts;
    let total = 0;
    for (let SKU in counts) {
      const { count, dealQuantity, dealPrice, bagelPrice } = this.#getDeals(counts, SKU);
      calcDealPrice(SKU, count, dealQuantity, dealPrice, bagelPrice);
      calcCoffeeAndBagelDeal(dealQuantity, SKU);
    }
    return Number(total.toFixed(2));

    function calcCoffeeAndBagelDeal(dealQuantity, SKU) {
      if (dealQuantity === 1) {
        // adhoc application of coffee deal saving
        const BOGOFSKU = `${deals[SKU][2]}`;
        const numOfDiscounts = counts[BOGOFSKU] % deals[BOGOFSKU][0];
        const saving = Bagel.getPriceOfBagel(BOGOFSKU) - deals[SKU][3];
        total -= numOfDiscounts * saving;
      }
    }

    function calcDealPrice(SKU, count, dealQuantity, dealPrice, bagelPrice) {
      if (deals.hasOwnProperty(SKU)) {
        const dealSum = Math.floor(count / dealQuantity) * dealPrice;
        const nonDealSum = (count % dealQuantity) * bagelPrice;
        total += dealSum + nonDealSum;
      }
    }
  }

  #addMultipleBagelsLoop(SKU, numOfBagels) {
    for (let i = 0; i < numOfBagels; i++) {
      if (this.basketIsFull()) {
          return 'Basket is full'
      }
      this.IDcounter++;
      const id = this.IDcounter;
      let bagelItem = new Bagel(SKU, id);
      this.contents.push(bagelItem);
  }
  }

  #getDeals(counts, SKU) {
    const count = counts[SKU];
    const dealQuantity = deals[SKU][0];
    const dealPrice = deals[SKU][1];
    const bagelPrice = Bagel.getPriceOfBagel(SKU);
    return { count, dealQuantity, dealPrice, bagelPrice };
  }

}

module.exports = Basket;
