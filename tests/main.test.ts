import { it, expect, describe } from 'vitest';
import { faker } from '@faker-js/faker';
import { db } from './mocks/db';

const { commerce } = faker;

describe('group', () => {
  it('should', () => {
    const product = db.product.create({ name: 'Apple' });
    console.log(product);
  });
});
