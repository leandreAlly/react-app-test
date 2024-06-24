import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuantitySelector from '../../src/components/QuantitySelector';
import { Product } from '../../src/entities';
import { CartProvider } from '../../src/providers/CartProvider';

describe('QuantitySelector', () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: 'Milk',
      price: 10,
      categoryId: 3,
    };

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    return {
      AddToCartButton: screen.getByRole('button', { name: /add to cart/i }),
      getQuantity: () => screen.getByRole('status'),
      getDecrementButton: () => screen.getByRole('button', { name: '-' }),
      getIncrementButton: () => screen.getByRole('button', { name: '+' }),
      user: userEvent.setup(),
    };
  };
  it('render the Add to Cart Button', () => {
    const { AddToCartButton } = renderComponent();

    expect(AddToCartButton).toBeInTheDocument();
  });

  it('should add product to the cart', async () => {
    const {
      AddToCartButton,
      user,
      getQuantity,
      getDecrementButton,
      getIncrementButton,
    } = renderComponent();

    await user.click(AddToCartButton);

    expect(getQuantity()).toHaveTextContent('1');
    expect(getDecrementButton()).toBeInTheDocument();
    expect(getIncrementButton()).toBeInTheDocument();

    expect(AddToCartButton).not.toBeInTheDocument();
  });

  it('should increment the quantity of the product', async () => {
    const { AddToCartButton, user, getQuantity, getIncrementButton } =
      renderComponent();
    await user.click(AddToCartButton);

    await user.click(getIncrementButton());

    expect(getQuantity()).toHaveTextContent('2');
  });

  it('should decrement the quantity of the product', async () => {
    const { AddToCartButton, user, getQuantity, getDecrementButton } =
      renderComponent();
    await user.click(AddToCartButton);

    await user.click(getDecrementButton());

    // expect(getQuantity()).not.toHaveTextContent('2');
  });
});
