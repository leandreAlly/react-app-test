import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import ProductDetail from '../../src/components/ProductDetail';
import { server } from '../mocks/server';
import { http, HttpResponse, delay } from 'msw';
import { db } from '../mocks/db';
import allProviders from '../allProviders';

describe('ProductDetail', () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });
  it('should render the list of product', async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });
    render(<ProductDetail productId={productId} />, { wrapper: allProviders });

    // expect(await screen.findByText(/product 1/i)).toBeInTheDocument();
    // expect(await screen.findByText(/\$10/i));

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(product!.price.toString())));
  });

  it('should render the message when product not found', async () => {
    server.use(http.get('/products/1', () => HttpResponse.json(null)));
    render(<ProductDetail productId={1} />, { wrapper: allProviders });

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  it('should render an error if data fetching fails', async () => {
    server.use(http.get('/products/1', () => HttpResponse.error()));
    render(<ProductDetail productId={0} />, { wrapper: allProviders });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render a loading indicator when fething data', async () => {
    server.use(
      http.get(`/products/${productId}`, async () => {
        await delay(), HttpResponse.json([]);
      })
    );
    render(<ProductDetail productId={productId} />, { wrapper: allProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it('should remove a loading indicator after data fetching', async () => {
    server.use(
      http.get(`/products/${productId}`, async () => {
        await delay(), HttpResponse.json([]);
      })
    );

    render(<ProductDetail productId={productId} />, { wrapper: allProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
