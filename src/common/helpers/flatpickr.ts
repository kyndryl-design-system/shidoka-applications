let isFlatpickrStylesInjected = false;

export function injectFlatpickrStyles(customStyle: string): void {
  if (!isFlatpickrStylesInjected) {
    const styleElement = document.createElement('style');
    styleElement.id = 'flatpickr-custom-styles';
    styleElement.textContent = customStyle;
    document.head.appendChild(styleElement);
    isFlatpickrStylesInjected = true;
  }
}
