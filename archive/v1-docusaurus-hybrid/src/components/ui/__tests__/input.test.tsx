import { render, screen, fireEvent } from '../../../test-utils';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input Component', () => {
  describe('Basic Functionality', () => {
    it('renders input with placeholder', () => {
      render(<Input placeholder="Enter text" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    it('accepts user input', async () => {
      const user = userEvent.setup();
      render(<Input data-testid="input" />);
      
      const input = screen.getByTestId('input');
      await user.type(input, 'test input');
      
      expect(input).toHaveValue('test input');
    });

    it('applies custom className', () => {
      render(<Input className="custom-input" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('custom-input');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Input ref={ref} data-testid="input" />);
      
      expect(ref.current).toBeTruthy();
    });
  });

  describe('Input Types', () => {
    it('renders text input by default', () => {
      render(<Input data-testid="input" />);
      
      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.type).toBe('text');
    });

    it('renders email input when specified', () => {
      render(<Input type="email" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders password input when specified', () => {
      render(<Input type="password" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders number input when specified', () => {
      render(<Input type="number" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Input States', () => {
    it('can be disabled', () => {
      render(<Input disabled data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toBeDisabled();
    });

    it('can be readonly', () => {
      render(<Input readOnly data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('readonly');
    });

    it('can have a default value', () => {
      render(<Input defaultValue="default text" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveValue('default text');
    });

    it('can be controlled with value prop', () => {
      const { rerender } = render(<Input value="controlled" onChange={() => {}} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveValue('controlled');
      
      rerender(<Input value="updated" onChange={() => {}} data-testid="input" />);
      expect(input).toHaveValue('updated');
    });
  });

  describe('Event Handling', () => {
    it('calls onChange when input changes', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(<Input onChange={handleChange} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      await user.type(input, 'a');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when input is focused', async () => {
      const handleFocus = jest.fn();
      const user = userEvent.setup();
      
      render(<Input onFocus={handleFocus} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      await user.click(input);
      
      expect(handleFocus).toHaveBeenCalled();
    });

    it('calls onBlur when input loses focus', async () => {
      const handleBlur = jest.fn();
      const user = userEvent.setup();
      
      render(
        <div>
          <Input onBlur={handleBlur} data-testid="input" />
          <button>Other element</button>
        </div>
      );
      
      const input = screen.getByTestId('input');
      const button = screen.getByRole('button');
      
      await user.click(input);
      await user.click(button);
      
      expect(handleBlur).toHaveBeenCalled();
    });

    it('calls onKeyDown when key is pressed', async () => {
      const handleKeyDown = jest.fn();
      const user = userEvent.setup();
      
      render(<Input onKeyDown={handleKeyDown} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      await user.type(input, 'a');
      
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Input aria-label="Search input" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-label', 'Search input');
    });

    it('supports aria-describedby', () => {
      render(<Input aria-describedby="help-text" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('supports aria-invalid', () => {
      render(<Input aria-invalid="true" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<Input data-testid="input" />);
      
      const input = screen.getByTestId('input');
      
      await user.tab();
      expect(input).toHaveFocus();
      
      await user.type(input, 'test');
      expect(input).toHaveValue('test');
    });
  });

  describe('Form Integration', () => {
    it('works with form submission', () => {
      const handleSubmit = jest.fn((e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        expect(formData.get('testInput')).toBe('test value');
      });
      
      render(
        <form onSubmit={handleSubmit}>
          <Input name="testInput" defaultValue="test value" data-testid="input" />
          <button type="submit">Submit</button>
        </form>
      );
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      fireEvent.click(submitButton);
      
      expect(handleSubmit).toHaveBeenCalled();
    });

    it('supports required attribute', () => {
      render(<Input required data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toBeRequired();
    });

    it('supports maxLength attribute', () => {
      render(<Input maxLength={10} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('maxLength', '10');
    });

    it('supports minLength attribute', () => {
      render(<Input minLength={3} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('minLength', '3');
    });
  });
});