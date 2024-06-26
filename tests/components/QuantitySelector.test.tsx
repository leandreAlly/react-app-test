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

    const getAddToCartButton = () =>
      screen.queryByRole('button', { name: /add to cart/i });

    const getQuantityControl = () => ({
      quantity: screen.getByRole('status'),
      decrementButton: screen.getByRole('button', { name: '-' }),
      incrementButton: screen.getByRole('button', { name: '+' }),
    });
    const user = userEvent.setup();

    const addToCart = async () => {
      const button = getAddToCartButton();
      await user.click(button!);
    };

    const incrementQuantity = async () => {
      const { incrementButton } = getQuantityControl();
      await user.click(incrementButton);
    };
    const decrementQuantity = async () => {
      const { decrementButton } = getQuantityControl();
      await user.click(decrementButton);
    };

    return {
      getAddToCartButton,
      getQuantityControl,
      addToCart,
      incrementQuantity,
      decrementQuantity,
    };
  };
  it('render the Add to Cart Button', () => {
    const { getAddToCartButton } = renderComponent();

    expect(getAddToCartButton()).toBeInTheDocument();
  });

  it('should add product to the cart', async () => {
    const { getAddToCartButton, addToCart, getQuantityControl } =
      renderComponent();

    await addToCart();

    const { quantity, decrementButton, incrementButton } = getQuantityControl();
    expect(quantity).toHaveTextContent('1');
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();

    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  it('should increment the quantity of the product', async () => {
    const { addToCart, getQuantityControl, incrementQuantity } =
      renderComponent();
    await addToCart();

    await incrementQuantity();

    const { quantity } = getQuantityControl();
    expect(quantity).toHaveTextContent('2');
  });

  it('should decrement the quantity of the product', async () => {
    const {
      addToCart,
      getQuantityControl,
      incrementQuantity,
      decrementQuantity,
    } = renderComponent();
    await addToCart();
    await incrementQuantity();

    await decrementQuantity();

    const { quantity } = getQuantityControl();
    expect(quantity).toHaveTextContent('1');
  });

  it('should remove the product from the cart', async () => {
    const {
      getAddToCartButton,
      decrementQuantity,
      addToCart,
      getQuantityControl,
    } = renderComponent();
    await addToCart();
    const { incrementButton, decrementButton, quantity } = getQuantityControl();
    await decrementQuantity();

    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
