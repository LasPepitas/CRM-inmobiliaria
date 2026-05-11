---
name: Siena Corporate Excellence
colors:
  surface: '#fbf8fc'
  surface-dim: '#dbd9dd'
  surface-bright: '#fbf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f6'
  surface-container: '#efedf1'
  surface-container-high: '#eae7eb'
  surface-container-highest: '#e4e2e5'
  on-surface: '#1b1b1e'
  on-surface-variant: '#45464e'
  inverse-surface: '#303033'
  inverse-on-surface: '#f2f0f3'
  outline: '#75777f'
  outline-variant: '#c5c6cf'
  surface-tint: '#4f5e83'
  primary: '#000310'
  on-primary: '#ffffff'
  primary-container: '#0b1c3e'
  on-primary-container: '#7685ac'
  inverse-primary: '#b7c6f1'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea517'
  on-secondary-container: '#684000'
  tertiary: '#000311'
  on-tertiary: '#ffffff'
  tertiary-container: '#001b48'
  on-tertiary-container: '#6d84bd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b7c6f1'
  on-primary-fixed: '#091a3c'
  on-primary-fixed-variant: '#37466a'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#d9e2ff'
  tertiary-fixed-dim: '#b0c6ff'
  on-tertiary-fixed: '#001945'
  on-tertiary-fixed-variant: '#2d4579'
  background: '#fbf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e2e5'
typography:
  display-lg:
    fontFamily: metropolis
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: metropolis
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: metropolis
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: metropolis
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: hankenGrotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: hankenGrotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: hankenGrotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: hankenGrotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

This design system is built on the pillars of **trust, architectural precision, and premium real estate service**. The aesthetic identity leans into a **Corporate / Modern** style, emphasizing the longevity and reliability of a high-end property group.

The visual language balances the weight of deep navy blue with the energy of vibrant orange to create a look that feels both established and forward-thinking. The interface should feel structured and authoritative, utilizing a clear hierarchical grid that reflects the stability of construction and property investment.

User interactions should evoke confidence through snappy transitions and precise alignments, avoiding unnecessary ornamentation in favor of high-legibility and functional elegance.

## Colors

The color palette is anchored by **Deep Navy Blue**, used for core branding, primary typography, and structural elements to signal professionalism and depth. **Vibrant Orange** is utilized strictly as a strategic accent color for calls to action, highlights, and status indicators, ensuring high visibility without compromising the corporate tone.

- **Primary (#0B1C3E):** Used for headers, footers, and primary buttons.
- **Secondary/Accent (#FEA516):** Reserved for interactive elements and key brand accents (e.g., the "Grupo" badge background).
- **Surface Tones:** A mix of pure White for primary cards and Light Gray (#F8F9FA) for background depth to distinguish different content sections clearly.

## Typography

This design system employs a dual-sans-serif approach to mirror the architectural nature of the brand.

- **Headings:** **Metropolis** provides a geometric, structured, and modern feel similar to 'Eastman Roman'. It should be used for all titles to convey strength and precision. High-level displays and headlines should favor a bold weight.
- **Body & UI:** **Hanken Grotesk** is selected for its exceptional legibility and contemporary "sharp" character. It handles high-density information (property specs, financial data) with clarity.
- **Labeling:** Small labels and captions should use uppercase styling with increased letter spacing to maintain a premium, organized feel.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop screens to maintain a controlled, high-end editorial feel, transitioning to a fluid model for mobile devices.

- **Grid:** A 12-column grid is standard for desktop (1280px max-width). Components like property cards should span 3 or 4 columns.
- **Rhythm:** Spacing follows a strict 8px/4px incremental scale. Consistent vertical "stack" spacing (2rem) between major sections ensures the design feels "airy" and premium.
- **Mobile:** On mobile devices, margins reduce to 16px, and the grid collapses to a single column for content, ensuring high-end imagery remains the focal point.

## Elevation & Depth

To maintain a professional and trustworthy atmosphere, this design system avoids heavy shadows in favor of **Tonal Layers** and **Subtle Ambient Shadows**.

- **Surface Layers:** Use the light gray background to "push" white cards forward.
- **Shadows:** When used (primarily on cards and floating buttons), shadows should be extremely diffused: `0px 4px 20px rgba(11, 28, 62, 0.08)`. This uses a tiny hint of the Primary Navy color in the shadow to keep the palette cohesive.
- **Borders:** Low-contrast 1px borders (#E2E8F0) are preferred for input fields and static containers to maintain a "clean line" architectural aesthetic.

## Shapes

The shape language is **Soft (0.25rem)**. While the overall feel is modern, we avoid "bubble" or overly rounded aesthetics to preserve the serious, corporate nature of the real estate industry.

- **Small Components:** Buttons, inputs, and tags use a base radius of 4px.
- **Large Components:** Property cards and modal containers use a "Large" radius of 8px (0.5rem).
- **Logos:** The 'Grupo' orange badge should remain sharp-edged or with a maximum of 2px radius to match the existing brand assets.

## Components

- **Buttons:** Primary buttons use the Primary Navy Blue with white text. CTA buttons for "Inquire" or "View Project" use the Vibrant Orange. All buttons feature a 4px corner radius and a subtle hover lift.
- **Cards:** Property cards feature a full-bleed image at the top, followed by a white content area. Titles are set in Metropolis Bold. Use subtle ambient shadows to separate cards from the light gray background.
- **Input Fields:** Use a white background with a 1px border. Labels should be small and uppercase using Hanken Grotesk.
- **Logos:** The 'Grupo Siena' logo must be placed in the primary navigation (top-left) or footer. The 'GS Inmobiliaria' variant is reserved for property-specific watermarks or smaller mobile headers.
- **Chips/Badges:** Used for property status (e.g., "Sold," "New Project"). These should use the Vibrant Orange background with white text or a light gray background with navy text for secondary information.
- **Property Specs:** Use clean icons (lines-only) paired with Hanken Grotesk for metrics like square footage, bedrooms, and location.
