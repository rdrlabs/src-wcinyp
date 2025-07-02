import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

describe('Select Component', () => {
  const SelectExample = ({ onValueChange = () => {}, defaultValue = undefined }) => (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger data-testid="select-trigger">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  );

  describe('Basic Functionality', () => {
    it('renders select without crashing', () => {
      render(<SelectExample />);
      
      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toBeInTheDocument();
    });

    it('shows placeholder text when no value selected', () => {
      render(<SelectExample />);
      
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('opens dropdown when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(<SelectExample />);
      
      const trigger = screen.getByTestId('select-trigger');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });
    });

    it('selects option when clicked', async () => {
      const handleValueChange = jest.fn();
      const user = userEvent.setup();
      
      render(<SelectExample onValueChange={handleValueChange} />);
      
      const trigger = screen.getByTestId('select-trigger');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Option 2'));
      
      expect(handleValueChange).toHaveBeenCalledWith('option2');
    });

    it('displays selected value in trigger', async () => {
      const user = userEvent.setup();
      render(<SelectExample />);
      
      const trigger = screen.getByTestId('select-trigger');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Option 1'));
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });
  });

  describe('SelectTrigger', () => {
    it('applies custom className', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger" data-testid="select-trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      
      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('can be disabled', () => {
      render(
        <Select>
          <SelectTrigger disabled data-testid="select-trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      
      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(
        <Select>
          <SelectTrigger ref={ref} data-testid="select-trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      
      expect(ref.current).toBeTruthy();
    });
  });

  describe('SelectValue', () => {
    it('shows placeholder when no value is selected', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose option" />
          </SelectTrigger>
        </Select>
      );
      
      expect(screen.getByText('Choose option')).toBeInTheDocument();
    });

    it('shows selected value when option is chosen', () => {
      render(
        <Select defaultValue="option2">
          <SelectTrigger>
            <SelectValue placeholder="Choose option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );
      
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('SelectContent', () => {
    it('applies custom className', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger data-testid="select-trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="custom-content">
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );
      
      const trigger = screen.getByTestId('select-trigger');
      await user.click(trigger);
      
      await waitFor(() => {
        const content = screen.getByText('Option 1').closest('[role="listbox"]');
        expect(content).toHaveClass('custom-content');
      });
    });

    it('positions content correctly', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger data-testid="select-trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="top">
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );
      
      const trigger = screen.getByTestId('select-trigger');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });
  });

  describe('SelectItem', () => {
    it('applies custom className', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger data-testid="select-trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1" className="custom-item">
              Option 1
            </SelectItem>
          </SelectContent>
        </Select>
      );
      
      const trigger = screen.getByTestId('select-trigger');
      await user.click(trigger);
      
      await waitFor(() => {
        const item = screen.getByText('Option 1');
        expect(item).toHaveClass('custom-item');
      });
    });

    it('can be disabled', async () => {
      const handleValueChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <Select onValueChange={handleValueChange}>
          <SelectTrigger data-testid="select-trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1" disabled>
              Disabled Option
            </SelectItem>
            <SelectItem value="option2">Available Option</SelectItem>
          </SelectContent>
        </Select>
      );
      
      const trigger = screen.getByTestId('select-trigger');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Disabled Option')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Disabled Option'));
      
      // Should not call onValueChange for disabled item
      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Controlled Behavior', () => {
    it('works as controlled component', async () => {
      const handleValueChange = jest.fn();
      const user = userEvent.setup();
      
      const ControlledSelect = () => {
        const [value, setValue] = React.useState('');
        
        return (
          <Select value={value} onValueChange={(newValue) => {
            setValue(newValue);
            handleValueChange(newValue);
          }}>
            <SelectTrigger data-testid="select-trigger">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="controlled1">Controlled 1</SelectItem>
              <SelectItem value="controlled2">Controlled 2</SelectItem>
            </SelectContent>
          </Select>
        );
      };
      
      render(<ControlledSelect />);
      
      const trigger = screen.getByTestId('select-trigger');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Controlled 1')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Controlled 1'));
      
      expect(handleValueChange).toHaveBeenCalledWith('controlled1');
    });

    it('respects defaultValue prop', () => {
      render(<SelectExample defaultValue="option2" />);
      
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens dropdown with Enter key', async () => {
      const user = userEvent.setup();
      render(<SelectExample />);
      
      const trigger = screen.getByTestId('select-trigger');
      trigger.focus();
      
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    it('opens dropdown with Space key', async () => {
      const user = userEvent.setup();
      render(<SelectExample />);
      
      const trigger = screen.getByTestId('select-trigger');
      trigger.focus();
      
      await user.keyboard(' ');
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    it('closes dropdown with Escape key', async () => {
      const user = userEvent.setup();
      render(<SelectExample />);
      
      const trigger = screen.getByTestId('select-trigger');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
      
      await user.keyboard('{Escape}');
      
      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<SelectExample />);
      
      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toHaveAttribute('role', 'combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('updates aria-expanded when opened', async () => {
      const user = userEvent.setup();
      render(<SelectExample />);
      
      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      
      await user.click(trigger);
      
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('supports aria-label', () => {
      render(
        <Select>
          <SelectTrigger aria-label="Choose option" data-testid="select-trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      
      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toHaveAttribute('aria-label', 'Choose option');
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<SelectExample />);
      
      const trigger = screen.getByTestId('select-trigger');
      
      await user.tab();
      expect(trigger).toHaveFocus();
    });
  });

  describe('Form Integration', () => {
    it('works with form submission', () => {
      const handleSubmit = jest.fn((e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        expect(formData.get('testSelect')).toBe('option2');
      });
      
      render(
        <form onSubmit={handleSubmit}>
          <Select name="testSelect" defaultValue="option2">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
          <button type="submit">Submit</button>
        </form>
      );
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      fireEvent.click(submitButton);
      
      expect(handleSubmit).toHaveBeenCalled();
    });

    it('supports required attribute', () => {
      render(
        <Select required>
          <SelectTrigger data-testid="select-trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      
      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toBeRequired();
    });
  });
});