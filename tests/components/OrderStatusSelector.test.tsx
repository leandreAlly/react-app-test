import { render, screen } from '@testing-library/react';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

// we have to use resize-observer-polyfill

describe('OrderStatusSelector', () => {
  const onChange = vi.fn();

  const renderComponent = () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      trigger: screen.getByRole('combobox'),
      user: userEvent.setup(),
      getOptions: () => screen.findAllByRole('option'),
      getOption: (label: RegExp) =>
        screen.findByRole('option', { name: label }),
      onChange,
    };
  };
  it('should render New as the Default value', () => {
    const { trigger } = renderComponent();

    expect(trigger).toHaveTextContent(/new/i);
  });

  it('should render correct statuses', async () => {
    const { trigger, user, getOptions } = renderComponent();
    await user.click(trigger);

    const options = await getOptions();
    expect(options).toHaveLength(3);
    // console.log(options[0].textContent);
    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
  });
  //------V1-----------
  // it('should call onChange with processed when Processed is selected', async () => {
  //   const { trigger, user, onChange } = renderComponent();
  //   await user.click(trigger);

  //   const option = await screen.findByRole('option', { name: /processed/i });
  //   await user.click(option);

  //   expect(onChange).toHaveBeenCalledWith('processed');
  // });

  it.each([
    { label: /processed/i, value: 'processed' },
    { label: /fulfilled/i, value: 'fulfilled' },
  ])(
    'should call onChange with $value when $label option is selected',
    async ({ label, value }) => {
      const { trigger, user, onChange, getOption } = renderComponent();
      await user.click(trigger);

      // const option = await screen.findByRole('option', { name: label }); version : 1
      const option = await getOption(label);
      await user.click(option);

      expect(onChange).toHaveBeenCalledWith(value);
    }
  );

  it("should call onChange with 'new' when the New option is selected.", async () => {
    const { trigger, user, getOption, onChange } = renderComponent();
    await user.click(trigger);

    const processedOption = await getOption(/processed/i);
    await user.click(processedOption);

    await user.click(trigger); // ignore this at first time and provide more clarity and install eslint

    const newOption = await getOption(/new/i);
    await user.click(newOption);
    expect(onChange).toHaveBeenCalledWith('new');
  });
});
