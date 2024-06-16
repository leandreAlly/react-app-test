import { render, screen } from '@testing-library/react';
import Greet from '../../src/components/Greet';

describe('Greet', () => {
  it('should render Hello with the name when name is provided', () => {
    render(<Greet name="leandre" />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/leandre/i);
  });

  it('should render login button when name is not provided', () => {
    render(<Greet />);

    const heading = screen.getByRole('button');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/login/i);
  });
});
