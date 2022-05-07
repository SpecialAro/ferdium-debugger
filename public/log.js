/**
 * Script for log viewing page
 */

const themeInfo = {"color":".theme__dark .app .sidebar .sidebar__button.is-muted, .theme__dark .app .sidebar .sidebar__button.is-active, .sidebar .sidebar__button.is-muted, .sidebar .sidebar__button.is-active, .settings .account .invoices .invoices__action button, .settings-navigation .settings-navigation__link.is-active .badge, a.button, a.link, .auth .welcome .button:hover, .auth .welcome .button__inverted, .franz-form .franz-form__radio.is-selected, .theme__dark .franz-form__button.franz-form__button--inverted, .franz-form__button.franz-form__button--inverted","border-left-color":".tab-item.is-active","border-color":".theme__dark .settings .premium-info, a.button, .franz-form .franz-form__radio.is-selected","background":".settings .settings__header, .settings .settings__close, .settings .settings__close:hover, .settings-navigation .settings-navigation__link.is-active, a.button:hover, .info-bar, .info-bar.info-bar--primary, .infobox.infobox--primary, .theme__dark .badge.badge--primary, .theme__dark .badge.badge--premium, .badge.badge--primary, .badge.badge--premium, .content-tabs .content-tabs__tabs .content-tabs__item.is-active, #electron-app-title-bar .toolbar-dropdown:not(.open) > .toolbar-button > button:hover, #electron-app-title-bar .list-item.selected .menu-item, #electron-app-title-bar .list-item.selected:focus .menu-item, .theme__dark .quick-switch .active, .franz-form .franz-form__toggle-wrapper .franz-form__toggle.is-active .franz-form__toggle-button, .theme__dark .franz-form__button, .theme__dark .franz-form__button:hover, .theme__dark .franz-form__button.franz-form__button--inverted:hover, .franz-form__button, .franz-form__button:hover, .franz-form__button.franz-form__button--inverted:hover","border-right-color":".settings .settings__header .separator"};

// From Ferdium/src/features/accentColor/index.js
const STYLE_ELEMENT_ID = 'accent-color';
function createAccentStyleElement() {
  const styles = document.createElement('style');
  styles.id = STYLE_ELEMENT_ID;

  document.querySelector('head').appendChild(styles);
}
function setAccentStyle(style) {
  const styleElement = document.getElementById(STYLE_ELEMENT_ID);
  styleElement.innerHTML = style;
}
function generateAccentStyle(color) {
  let style = '';

  Object.keys(themeInfo).forEach((property) => {
    style += `
      ${themeInfo[property]} {
        ${property}: ${color};
      }
    `;
  });

  return style;
}
function setAccentColor(color) {
  createAccentStyleElement();
  const style = generateAccentStyle(color);
  setAccentStyle(style);
}


// UI toggles
const toggleWorkspaces = () => {
  document.querySelector('.app .app__content').classList.toggle('AppLayout-appContent-0-1-106');
  document.getElementById('workspaces').classList.toggle('is-active');
}
const toggleSettings = () => {
  document.getElementById('portalContainer').classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  // Attach button listeners to toggle UI elements
  document.getElementById('workspaces').addEventListener('click', toggleWorkspaces);
  document.getElementById('close_settings').addEventListener('click', toggleSettings);
  document.getElementById('open_settings').addEventListener('click', toggleSettings);
  document.getElementById('settings_backdrop').addEventListener('click', toggleSettings);

  // Apply style from log
  if (window.accentColor !== '#7367f0') {
    setAccentColor(window.accentColor);
  }
  if(window.darkMode) {
    document.body.classList.add('theme__dark');
  }
})
