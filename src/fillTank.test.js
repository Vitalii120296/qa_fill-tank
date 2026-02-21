'use strict';

describe('fillTank', () => {
  const { fillTank } = require('./fillTank');

  let customer;

  beforeEach(() => {
    customer = {
      money: 3000,
      vehicle: {
        maxTankCapacity: 40,
        fuelRemains: 8,
      },
    };
  });

  it('should not return anything', () => {
    const result = fillTank(customer, 50, 10);

    expect(result).toBeUndefined();
  });

  it('should fill full tank if amount is not given', () => {
    fillTank(customer, 50);

    expect(customer.vehicle.fuelRemains).toBe(40);
  });

  it('should not pour more than tank capacity allows', () => {
    fillTank(customer, 50, 100);

    expect(customer.vehicle.fuelRemains).toBe(40);
  });

  it('should not pour more than customer can afford', () => {
    customer.money = 100; // can buy only 2 liters if price = 50

    fillTank(customer, 50, 10);

    expect(customer.vehicle.fuelRemains).toBe(10); // 8 + 2
    expect(customer.money).toBe(0);
  });

  it('should discard digits after tenth part', () => {
    customer.money = 333; // 333 / 50 = 6.66 → 6.6 liters

    fillTank(customer, 50, 10);

    expect(customer.vehicle.fuelRemains).toBe(14.6);
  });

  it('should not pour fuel if less than 2 liters', () => {
    customer.money = 50; // 1 liter

    fillTank(customer, 50, 10);

    expect(customer.vehicle.fuelRemains).toBe(8);
    expect(customer.money).toBe(50);
  });

  it('should correctly round price to nearest hundredth', () => {
    fillTank(customer, 33.333, 10);

    const spent = 3000 - customer.money;

    expect(spent).toBeCloseTo(333.33, 2);
  });

  it('should correctly handle complex scenario', () => {
    customer.money = 500;
    customer.vehicle.fuelRemains = 30;

    fillTank(customer, 40, 20);

    // tank can fit only 10 liters
    expect(customer.vehicle.fuelRemains).toBeLessThanOrEqual(40);
  });
});
