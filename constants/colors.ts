/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#25323d',
    tint: '#d84c52',

    // Core surfaces
    background: '#fffaf8',
    foreground: '#25323d',

    // Cards / elevated surfaces
    card: '#ffffff',
    cardForeground: '#25323d',

    // Primary action color (buttons, links, active states)
    primary: '#d84c52',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#fce6e1',
    secondaryForeground: '#8e3038',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#f1e8e5',
    mutedForeground: '#71777b',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#f5d2ca',
    accentForeground: '#8e3038',

    // Destructive actions (delete, error states)
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#eadbd7',
    input: '#ddcbc7',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
