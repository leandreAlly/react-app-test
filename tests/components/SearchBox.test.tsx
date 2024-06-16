import { render, screen } from '@testing-library/react';
import SearchBox from '../../src/components/SearchBox';
import userEvent from '@testing-library/user-event';

describe('SearchBox', () => {
  const renderSearchBox = () => {
    const onchange = vi.fn();
    render(<SearchBox onChange={onchange} />);

    return {
      input: screen.getByPlaceholderText(/search/i),
      user: userEvent.setup(),
      onchange,
    };
  };
  it('should render an input field for searching', () => {
    const { input } = renderSearchBox();

    expect(input).toBeInTheDocument();
  });
  it('should call onChange when enter is pressed', async () => {
    // const { input, onchange } = renderSearchBox();

    // const user = userEvent.setup();
    // await user.type(input, 'SearchTerm{enter}');

    // expect(onchange).toHaveBeenCalledWith('SearchTerm');

    const { input, onchange, user } = renderSearchBox();

    const searchTerm = 'SearchTerm';
    await user.type(input, searchTerm + '{enter}');

    expect(onchange).toHaveBeenCalledWith(searchTerm);
  });

  it('should not call onChange if input field is empty', async () => {
    const { input, onchange, user } = renderSearchBox();

    await user.type(input, '{enter}');

    expect(onchange).not.toHaveBeenCalled();
  });
});
