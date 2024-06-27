import { screen } from '@testing-library/react';
import { db } from '../mocks/db';
import { navigateTo } from '../utils';

describe('Router', () => {
  it('should render the home page for /', () => {
    navigateTo('/');

    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
  });

  it('should render the products page for /products', () => {
    navigateTo('/products');

    expect(
      screen.getByRole('heading', { name: /products/i })
    ).toBeInTheDocument();
  });
  it('should render the product details page for /products:id', async () => {
    const product = db.product.create();
    navigateTo('/products/' + product.id);

    expect(
      await screen.findByRole('heading', { name: product.name })
    ).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it('should render not found page for invalid routes', () => {
    navigateTo('/invalid-route');

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
  it('should render  the admin home page for /admin', () => {
    navigateTo('/admin');

    expect(screen.getByRole('heading', { name: /admin/i })).toBeInTheDocument();
  });
  it('should render  the new product creation page for /admin/product/new', () => {
    navigateTo('/admin/products/new');

    expect(
      screen.getByRole('heading', { name: /new product/i })
    ).toBeInTheDocument();
  });
  it('should render  the admin edit product page for /admin/products/:id/edit', async () => {
    const product = db.product.create();
    navigateTo(`/admin/products/${product.id}/edit`);

    expect(
      await screen.findByRole('heading', { name: /edit product/i })
    ).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: product.id } } });
  });
});
