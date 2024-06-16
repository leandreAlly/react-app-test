import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Category, Product } from '../../src/entities';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import allProviders from '../allProviders';
import { db, getProductsByCategory } from '../mocks/db';
import { simulateDelay, simulateError } from '../utils';

describe('BrowserProuductsPage', () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  // creating data for categories
  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: 'Category' + item });
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productsIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productsIds } } });
  });

  it('should show a loading skelton when fetching products', () => {
    simulateDelay('/products');

    const { getProductsSkeleton } = renderComponents();

    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it('should show a loading skelton when fetching categories', async () => {
    simulateDelay('/categories');

    const { getCategoriesSkeleton } = renderComponents();

    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it('should hide a loading skelton after products are fetched', async () => {
    const { getProductsSkeleton } = renderComponents();
    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it('should hide a loading skelton after products are fetched', async () => {
    const { getProductsSkeleton } = renderComponents();

    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it('should not render an error if categories cannot be fetched', async () => {
    simulateError('/categories');

    const { getCategoriesComboBox } = renderComponents();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /products/i })
    );
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    expect(getCategoriesComboBox()).not.toBeInTheDocument();
  });

  it('should render an error if products is not fetched', async () => {
    simulateError('/products');

    renderComponents();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render categories', async () => {
    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponents();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesComboBox();
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox!);

    expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument();
    categories.forEach((category) => {
      expect(screen.getByRole('option', { name: category.name }));
    });
  });

  it('should render a products', async () => {
    const { getProductsSkeleton } = renderComponents();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('should filter products by category', async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponents();

    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    const products = getProductsByCategory(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  });
  it('should render all products when all category is selected', async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponents();

    await selectCategory(/all/i);

    const products = db.product.getAll();
    expectProductsToBeInTheDocument(products);
  });
});

const renderComponents = () => {
  render(<BrowseProducts />, { wrapper: allProviders });
  const getCategoriesSkeleton = () =>
    screen.queryByRole('progressbar', {
      name: /categories/i,
    });

  const getProductsSkeleton = () =>
    screen.queryByRole('progressbar', {
      name: /products/i,
    });

  const getCategoriesComboBox = () => screen.queryByRole('combobox');

  const selectCategory = async (name: RegExp | string) => {
    //Arrange
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = getCategoriesComboBox();
    const user = userEvent.setup();
    await user.click(combobox!);

    //Act
    const option = screen.getByRole('option', { name });
    await user.click(option);
  };

  const expectProductsToBeInTheDocument = (products: Product[]) => {
    const rows = screen.getAllByRole('row');
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  };

  return {
    getProductsSkeleton,
    getCategoriesSkeleton,
    getCategoriesComboBox,
    selectCategory,
    expectProductsToBeInTheDocument,
  };
};
