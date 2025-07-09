// Debug script to check theme implementation
// Run this in the browser console at http://localhost:3001/debug-theme

console.log('=== Theme Debug Information ===');

// 1. Check HTML element classes
const htmlElement = document.documentElement;
console.log('HTML element classes:', htmlElement.className);

// 2. Check localStorage
console.log('localStorage color-theme:', localStorage.getItem('color-theme'));
console.log('localStorage theme:', localStorage.getItem('theme'));

// 3. Check computed styles
const computedStyles = getComputedStyle(htmlElement);
const themeVariables = [
  '--color-primary',
  '--color-primary-foreground',
  '--color-background',
  '--color-foreground',
  '--color-border'
];

console.log('\nComputed CSS Variables:');
themeVariables.forEach(variable => {
  const value = computedStyles.getPropertyValue(variable);
  console.log(`${variable}: ${value}`);
});

// 4. Check if theme class is being applied
const themeClasses = Array.from(htmlElement.classList).filter(cls => cls.startsWith('theme-'));
console.log('\nTheme classes on HTML:', themeClasses);

// 5. Check for hydration issues
console.log('\nChecking for hydration issues...');
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      console.log('Class mutation detected:', {
        oldValue: mutation.oldValue,
        newValue: mutation.target.className
      });
    }
  });
});

observer.observe(htmlElement, {
  attributes: true,
  attributeOldValue: true,
  attributeFilter: ['class']
});

console.log('Mutation observer set up. Any class changes will be logged.');

// 6. Test setting color theme
console.log('\nTo test setting a theme, run:');
console.log('localStorage.setItem("color-theme", "red"); location.reload();');