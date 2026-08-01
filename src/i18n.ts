/**
 * i18n helper for WebExtension browser.i18n API
 */
export function getMessage(messageName: string, substitutions?: string | string[]): string {
  if (typeof browser !== 'undefined' && browser.i18n && typeof browser.i18n.getMessage === 'function') {
    const msg = browser.i18n.getMessage(messageName, substitutions as any);
    if (msg) return msg;
  }
  return messageName;
}

export default getMessage;
