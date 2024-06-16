import { HttpHandler } from 'msw';
import { db } from './db';

export const handlers: HttpHandler[] = [
  ...db.product.toHandlers('rest'),
  ...db.category.toHandlers('rest'),
];
