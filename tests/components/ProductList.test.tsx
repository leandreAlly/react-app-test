import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import ProductList from '../../src/components/ProductList';
import allProviders from '../allProviders';
import { db } from '../mocks/db';
import { server } from '../mocks/server';
import { simulateDelay } from '../utils';

const productIds: number[] = [];

describe('ProductList', () => {
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it('should render the all items', async () => {
    render(<ProductList />, { wrapper: allProviders });

    const items = await screen.findAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });

  it('should render a message when there is products', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])));

    render(<ProductList />, { wrapper: allProviders });

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });
  it('should render an error message when there is an error', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));
    render(<ProductList />, { wrapper: allProviders });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
  it('should render a loading indicator when fetching data', async () => {
    simulateDelay('/products');
    render(<ProductList />, { wrapper: allProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it('should remove a loading indicator after data is fetched', async () => {
    render(<ProductList />, { wrapper: allProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
  it('should remove a loading indicator when data fetching fails', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    render(<ProductList />, { wrapper: allProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
