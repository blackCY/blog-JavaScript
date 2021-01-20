class Car {
  constructor(name, number) {
    this.name = name;
    this.number = number;
  }
}

class ZhuanChe extends Car {
  constructor(name, number) {
    super(name, number);
    this.price = 1;
  }
}

class KuaiChe extends Car {
  constructor(name, number) {
    super(name, number);
    this.price = 2;
  }
}

class Trip {
  constructor(car) {
    this.car = car;
  }
  start() {
    console.log(`行程开始, 名称: ${this.car.name}, 车牌号: ${this.car.number}`);
  }
  end() {
    console.log(`行程结束, 金额: ${this.car.price * 5}`);
  }
}

let kcar = new KuaiChe(100, "兰博基尼");
let trip = new Trip(kcar);
trip.start();
trip.end();
