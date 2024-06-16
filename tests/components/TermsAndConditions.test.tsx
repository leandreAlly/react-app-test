import { render, screen } from '@testing-library/react';
import TermsAndConditions from '../../src/components/TermsAndConditions';
import userEvent from '@testing-library/user-event';

describe('TermsAndCondition', () => {
  //second version
  const renderComponent = () => {
    render(<TermsAndConditions />);

    return {
      heading: screen.getByRole('heading'),
      checkbox: screen.getByRole('checkbox'),
      button: screen.getByRole('button'),
    };
  };

  it('should render with correct text and initial state', () => {
    //----------first version---------//
    // render(<TermsAndConditions />);
    // const heading = screen.getByRole('heading');
    // expect(heading).toBeInTheDocument();
    // expect(heading).toHaveTextContent('Terms & Conditions');
    // const checkbox = screen.getByRole('checkbox');
    // expect(checkbox).toBeInTheDocument();
    // expect(checkbox).not.toBeChecked();
    // // screen.getByRole('button', { name: /submit/i });
    // const button = screen.getByRole('button');
    // expect(button).toBeInTheDocument();
    // expect(button).toBeDisabled();

    const { heading, checkbox, button } = renderComponent();

    expect(heading).toHaveTextContent('Terms & Conditions');
    expect(checkbox).not.toBeChecked();
    // screen.getByRole('button', { name: /submit/i });
    expect(button).toBeDisabled();
  });

  it('should enable the button when the checkbox is checked', async () => {
    //--------first version---------//
    // render(<TermsAndConditions />);
    // const checkbox = screen.getByRole('checkbox');
    // const user = userEvent.setup();
    // await user.click(checkbox);
    // expect(screen.getByRole('button')).toBeEnabled();

    const { checkbox, button } = renderComponent();
    const user = userEvent.setup();
    await user.click(checkbox);

    expect(button).toBeEnabled();
  });
});
