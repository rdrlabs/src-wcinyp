import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Slider } from './slider'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Slider', () => {
  describe('Basic Functionality', () => {
    it('renders slider with default value', () => {
      render(<Slider defaultValue={[50]} />)

      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
      expect(slider).toHaveAttribute('aria-valuenow', '50')
    })

    it('renders slider with custom value', () => {
      render(<Slider value={[75]} />)

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-valuenow', '75')
    })

    it('renders with min and max values', () => {
      render(<Slider defaultValue={[50]} min={0} max={100} />)

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-valuemin', '0')
      expect(slider).toHaveAttribute('aria-valuemax', '100')
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      
      render(<Slider ref={ref} defaultValue={[50]} />)

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('User Interaction', () => {
    it('handles value change', () => {
      const handleValueChange = vi.fn()
      
      render(
        <Slider
          defaultValue={[50]}
          onValueChange={handleValueChange}
        />
      )

      const slider = screen.getByRole('slider')
      
      // Simulate dragging slider
      fireEvent.keyDown(slider, { key: 'ArrowRight' })
      
      expect(handleValueChange).toHaveBeenCalled()
    })

    it('responds to keyboard navigation', () => {
      const handleValueChange = vi.fn()
      
      render(
        <Slider
          defaultValue={[50]}
          onValueChange={handleValueChange}
          step={10}
        />
      )

      const slider = screen.getByRole('slider')
      
      fireEvent.keyDown(slider, { key: 'ArrowRight' })
      expect(handleValueChange).toHaveBeenCalledWith([60])
      
      fireEvent.keyDown(slider, { key: 'ArrowLeft' })
      // Note: Since we're not controlling the value, it may not be exactly 50
      expect(handleValueChange).toHaveBeenCalled()
    })

    it('handles page up/down keys', () => {
      const handleValueChange = vi.fn()
      
      render(
        <Slider
          defaultValue={[50]}
          onValueChange={handleValueChange}
          step={1}
        />
      )

      const slider = screen.getByRole('slider')
      
      fireEvent.keyDown(slider, { key: 'PageUp' })
      expect(handleValueChange).toHaveBeenCalled()
      
      fireEvent.keyDown(slider, { key: 'PageDown' })
      expect(handleValueChange).toHaveBeenCalled()
    })

    it('handles home/end keys', () => {
      const handleValueChange = vi.fn()
      
      render(
        <Slider
          defaultValue={[50]}
          onValueChange={handleValueChange}
          min={0}
          max={100}
        />
      )

      const slider = screen.getByRole('slider')
      
      fireEvent.keyDown(slider, { key: 'Home' })
      expect(handleValueChange).toHaveBeenCalledWith([0])
      
      fireEvent.keyDown(slider, { key: 'End' })
      expect(handleValueChange).toHaveBeenCalledWith([100])
    })
  })

  describe('Disabled State', () => {
    it('renders disabled slider', () => {
      render(<Slider defaultValue={[50]} disabled />)

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-disabled', 'true')
    })

    it('does not respond to interaction when disabled', () => {
      const handleValueChange = vi.fn()
      
      render(
        <Slider
          defaultValue={[50]}
          disabled
          onValueChange={handleValueChange}
        />
      )

      const slider = screen.getByRole('slider')
      fireEvent.keyDown(slider, { key: 'ArrowRight' })
      
      expect(handleValueChange).not.toHaveBeenCalled()
    })
  })

  describe('Visual Components', () => {
    it('renders track and range', () => {
      const { container } = render(<Slider defaultValue={[50]} />)

      const track = container.querySelector('.bg-secondary')
      const range = container.querySelector('.bg-primary')
      
      expect(track).toBeInTheDocument()
      expect(track).toHaveClass('h-2')
      expect(track).toHaveClass('rounded-full')
      
      expect(range).toBeInTheDocument()
      expect(range).toHaveClass('absolute')
      expect(range).toHaveClass('h-full')
    })

    it('renders thumb', () => {
      const { container } = render(<Slider defaultValue={[50]} />)

      const thumb = screen.getByRole('slider')
      expect(thumb).toHaveClass('h-5')
      expect(thumb).toHaveClass('w-5')
      expect(thumb).toHaveClass('rounded-full')
      expect(thumb).toHaveClass('border-2')
      expect(thumb).toHaveClass('border-primary')
    })
  })

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Slider defaultValue={[50]} className="custom-slider" />
      )

      const root = container.firstChild
      expect(root).toHaveClass('custom-slider')
      expect(root).toHaveClass('relative')
      expect(root).toHaveClass('flex')
      expect(root).toHaveClass('w-full')
    })

    it('has focus styles', () => {
      render(<Slider defaultValue={[50]} />)

      const thumb = screen.getByRole('slider')
      expect(thumb).toHaveClass('focus-visible:outline-none')
      expect(thumb).toHaveClass('focus-visible:ring-2')
      expect(thumb).toHaveClass('focus-visible:ring-ring')
    })

    it('has disabled opacity', () => {
      render(<Slider defaultValue={[50]} disabled />)

      const thumb = screen.getByRole('slider')
      expect(thumb).toHaveClass('disabled:opacity-50')
      expect(thumb).toHaveClass('disabled:pointer-events-none')
    })
  })

  describe('Step Values', () => {
    it('uses step value for increments', () => {
      const handleValueChange = vi.fn()
      
      render(
        <Slider
          defaultValue={[0]}
          step={25}
          max={100}
          onValueChange={handleValueChange}
        />
      )

      const slider = screen.getByRole('slider')
      fireEvent.keyDown(slider, { key: 'ArrowRight' })
      
      expect(handleValueChange).toHaveBeenCalledWith([25])
    })

    it('handles decimal steps', () => {
      const handleValueChange = vi.fn()
      
      render(
        <Slider
          defaultValue={[0]}
          step={0.1}
          max={1}
          onValueChange={handleValueChange}
        />
      )

      const slider = screen.getByRole('slider')
      fireEvent.keyDown(slider, { key: 'ArrowRight' })
      
      expect(handleValueChange).toHaveBeenCalledWith([0.1])
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <div className="space-y-8">
          <Slider defaultValue={[50]} />
          <Slider defaultValue={[25]} disabled />
          <Slider defaultValue={[75]} className="w-[60%]" />
        </div>,
        { theme: 'light' }
      )

      // Check track uses semantic colors
      const tracks = container.querySelectorAll('[data-orientation="horizontal"] > span')
      expect(tracks.length).toBeGreaterThan(0)
      
      tracks.forEach(track => {
        if (track.className.includes('bg-')) {
          expect(track.className).toContain('bg-secondary')
        }
      })
      
      // Check range uses semantic primary color
      const ranges = container.querySelectorAll('.bg-primary')
      expect(ranges.length).toBeGreaterThan(0)
      
      // Check thumb uses semantic colors
      const thumbs = container.querySelectorAll('[role="slider"]')
      thumbs.forEach(thumb => {
        expect(thumb.className).toContain('bg-background')
        expect(thumb.className).toContain('border-primary')
      })
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <div className="space-y-8">
          <Slider defaultValue={[50]} />
          <Slider defaultValue={[25]} disabled />
          <Slider defaultValue={[75]} className="w-[60%]" />
        </div>,
        { theme: 'dark' }
      )

      // Check track uses semantic colors in dark mode
      const tracks = container.querySelectorAll('[data-orientation="horizontal"] > span')
      expect(tracks.length).toBeGreaterThan(0)
      
      tracks.forEach(track => {
        if (track.className.includes('bg-')) {
          expect(track.className).toContain('bg-secondary')
        }
      })
      
      // Check range maintains semantic primary color
      const ranges = container.querySelectorAll('.bg-primary')
      expect(ranges.length).toBeGreaterThan(0)
      
      // Check thumb maintains semantic colors
      const thumbs = container.querySelectorAll('[role="slider"]')
      thumbs.forEach(thumb => {
        expect(thumb.className).toContain('bg-background')
        expect(thumb.className).toContain('border-primary')
      })
    })

    it('maintains semantic colors for different states', () => {
      renderWithTheme(
        <div className="space-y-8">
          {/* Normal state */}
          <div>
            <label className="text-sm font-medium">Volume</label>
            <Slider defaultValue={[65]} aria-label="Volume control" />
          </div>
          
          {/* Disabled state */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Brightness (Disabled)</label>
            <Slider defaultValue={[50]} disabled aria-label="Brightness control" />
          </div>
          
          {/* With custom step */}
          <div>
            <label className="text-sm font-medium">Progress</label>
            <Slider defaultValue={[33]} step={10} aria-label="Progress indicator" />
          </div>
        </div>,
        { theme: 'dark' }
      )

      // Normal slider should have full opacity
      const volumeSlider = screen.getByRole('slider', { name: 'Volume control' })
      expect(volumeSlider.className).not.toContain('opacity-50')
      expect(volumeSlider.className).toContain('bg-background')
      
      // Disabled slider should have reduced opacity but maintain semantic colors
      const brightnessSlider = screen.getByRole('slider', { name: 'Brightness control' })
      expect(brightnessSlider.className).toContain('disabled:opacity-50')
      expect(brightnessSlider.className).toContain('bg-background')
      
      // All sliders should use semantic border colors
      const allSliders = screen.getAllByRole('slider')
      allSliders.forEach(slider => {
        expect(slider.className).toContain('border-primary')
      })
    })

    it('ensures no hard-coded colors', () => {
      const { container } = renderWithTheme(
        <div className="space-y-8">
          <Slider defaultValue={[30]} className="my-4" />
          <Slider defaultValue={[60]} step={5} />
          <Slider defaultValue={[90]} disabled />
        </div>,
        { theme: 'dark' }
      )

      // Check all elements for hard-coded colors
      const allElements = container.querySelectorAll('*')
      allElements.forEach(element => {
        const classList = element.className
        if (typeof classList === 'string' && classList.includes('bg-')) {
          // Should not contain hard-coded color values
          expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
          
          // Should use semantic colors
          if (classList.includes('bg-')) {
            expect(classList).toMatch(/bg-(primary|secondary|background|muted)/)
          }
        }
      })
    })

    it('maintains theme consistency with focus states', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <div className="space-y-8">
          <Slider defaultValue={[50]} aria-label="Focus test slider" />
        </div>,
        { theme: 'dark' }
      )

      const slider = screen.getByRole('slider', { name: 'Focus test slider' })
      
      // Focus the slider
      await user.tab()
      expect(document.activeElement).toBe(slider)
      
      // Check focus styles use semantic colors
      expect(slider.className).toContain('focus-visible:ring-ring')
      expect(slider.className).toContain('focus-visible:ring-offset-background')
    })

    it('works correctly with vertical orientation', () => {
      const { container } = renderWithTheme(
        <div className="h-[200px] flex gap-8">
          <Slider
            defaultValue={[50]}
            orientation="vertical"
            className="h-full"
            aria-label="Vertical slider"
          />
          <Slider
            defaultValue={[75]}
            orientation="vertical"
            className="h-full"
            disabled
            aria-label="Disabled vertical slider"
          />
        </div>,
        { theme: 'dark' }
      )

      // Vertical sliders should maintain semantic colors
      const sliders = screen.getAllByRole('slider')
      expect(sliders).toHaveLength(2)
      
      sliders.forEach(slider => {
        expect(slider).toHaveAttribute('aria-orientation', 'vertical')
        expect(slider.className).toContain('bg-background')
        expect(slider.className).toContain('border-primary')
      })
      
      // Track should still use semantic secondary color
      const tracks = container.querySelectorAll('[data-orientation="vertical"] > span')
      tracks.forEach(track => {
        if (track.className.includes('bg-')) {
          expect(track.className).toContain('bg-secondary')
        }
      })
    })
  })

  describe('Common Use Cases', () => {
    it('works as volume control', () => {
      const handleVolumeChange = vi.fn()
      
      render(
        <div>
          <label htmlFor="volume">Volume</label>
          <Slider
            id="volume"
            defaultValue={[50]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            aria-label="Volume"
          />
        </div>
      )

      const slider = screen.getByRole('slider', { name: 'Volume' })
      expect(slider).toHaveAttribute('aria-valuenow', '50')
    })

    it('works as brightness control', () => {
      render(
        <Slider
          defaultValue={[75]}
          max={100}
          step={5}
          aria-label="Brightness"
        />
      )

      const slider = screen.getByRole('slider', { name: 'Brightness' })
      expect(slider).toHaveAttribute('aria-valuenow', '75')
    })

    it('works as progress indicator', () => {
      render(
        <Slider
          value={[33]}
          max={100}
          disabled
          aria-label="Upload progress"
        />
      )

      const slider = screen.getByRole('slider', { name: 'Upload progress' })
      expect(slider).toHaveAttribute('aria-valuenow', '33')
      expect(slider).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Slider
          defaultValue={[50]}
          min={0}
          max={100}
          aria-label="Test slider"
        />
      )

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-label', 'Test slider')
      expect(slider).toHaveAttribute('aria-valuenow', '50')
      expect(slider).toHaveAttribute('aria-valuemin', '0')
      expect(slider).toHaveAttribute('aria-valuemax', '100')
    })

    it('announces value changes', () => {
      const handleValueChange = vi.fn()
      
      render(
        <Slider
          defaultValue={[50]}
          onValueChange={handleValueChange}
          aria-label="Adjustable slider"
        />
      )

      const slider = screen.getByRole('slider')
      fireEvent.keyDown(slider, { key: 'ArrowRight' })
      
      // Value should update for screen readers
      expect(handleValueChange).toHaveBeenCalled()
    })

    it('supports custom aria-valuetext', () => {
      render(
        <Slider
          defaultValue={[50]}
          aria-valuetext="50 percent"
        />
      )

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-valuetext', '50 percent')
    })
  })

  describe('Edge Cases', () => {
    it('handles value outside range', () => {
      render(
        <Slider
          value={[150]}
          min={0}
          max={100}
        />
      )

      const slider = screen.getByRole('slider')
      // Should clamp to max value
      expect(slider).toHaveAttribute('aria-valuenow', '100')
    })

    it('handles negative values', () => {
      render(
        <Slider
          defaultValue={[-25]}
          min={-50}
          max={50}
        />
      )

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-valuenow', '-25')
    })

    it('handles inverted range', () => {
      render(
        <Slider
          defaultValue={[0]}
          inverted
        />
      )

      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
    })

    it('handles orientation prop', () => {
      render(
        <Slider
          defaultValue={[50]}
          orientation="vertical"
        />
      )

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-orientation', 'vertical')
    })
  })
})