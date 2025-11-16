# Design Guidelines: Arabic Real Estate Platform

## Design Approach
**Hybrid Professional System** - Combining Material Design principles for data-dense interfaces with custom trust-building elements. Drawing inspiration from:
- **Zillow/Redfin**: Property presentation and search interfaces
- **Stripe**: Clean, professional trust-building for financial decisions
- **Linear**: Typography and information hierarchy for dashboards
- **Airbnb**: Visual storytelling for properties

**Core Principle**: Build unwavering trust through professional polish, clarity, and transparency - users are making major financial decisions.

## Bilingual Architecture (Critical)
- **Full RTL/LTR Support**: All layouts must mirror perfectly for Arabic
- **Text Direction Classes**: `dir="rtl"` for Arabic, `dir="ltr"` for English
- **Mirrored Navigation**: Right-to-left in Arabic, left-to-right in English
- **Icon Positioning**: Flip directional icons (arrows, chevrons) based on language
- **Number Formatting**: Arabic numerals in Arabic, Western in English

## Typography System

**Primary Arabic Font**: 
- Cairo or Tajawal (Google Fonts) - excellent for RTL, professional appearance

**Primary English Font**:
- Inter or Work Sans (Google Fonts) - clean, modern, professional

**Hierarchy**:
- Hero Headlines: 3xl-5xl (48-60px), font-bold
- Section Headers: 2xl-3xl (32-40px), font-semibold  
- Property Titles: xl-2xl (24-32px), font-semibold
- Body Text: base-lg (16-18px), font-normal
- Meta/Stats: sm-base (14-16px), font-medium
- Captions: xs-sm (12-14px), font-normal

## Layout System
**Spacing Units**: Use Tailwind units of **4, 6, 8, 12, 16** for consistency
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-16 (mobile), py-16 to py-24 (desktop)
- Card gaps: gap-4 to gap-6
- Form fields: space-y-4

**Grid Patterns**:
- Property Cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with gap-6
- Developer Profiles: `grid-cols-1 lg:grid-cols-2` for detail pages
- Dashboard Analytics: `grid-cols-1 md:grid-cols-2 xl:grid-cols-4` for metrics

## Color Strategy (Trust & Authority)

**Primary Trust Palette**:
- Deep Navy: #0F172A (headers, trust elements)
- Rich Gold: #F59E0B to #D97706 (accents, CTAs, trust scores)
- Clean White: #FFFFFF (backgrounds, cards)
- Subtle Gray: #F8FAFC to #E2E8F0 (sections, borders)

**Semantic Colors**:
- Success/High Trust: #10B981 (green for high trust scores)
- Warning/Medium Risk: #F59E0B (amber for moderate flags)
- Danger/High Risk: #EF4444 (red for risk indicators)
- Info: #3B82F6 (blue for AI features)

**Gradients** (Use Sparingly):
- Hero backgrounds: `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`
- Trust Score badges: `bg-gradient-to-r from-amber-500 to-amber-600`

## Component Library

### Navigation
- **Top Bar**: Sticky header with logo (left/right based on language), language switcher, auth buttons
- **Main Nav**: Horizontal menu with clear hierarchy, Gold underline for active items
- **Mobile**: Hamburger menu (left for LTR, right for RTL) with slide-in drawer

### Property Cards
- Image (16:9 ratio) with subtle hover scale (1.02)
- Price (bold, large, prominent) with currency symbol
- Title, location, size as secondary info
- Trust indicator badge (developer trust score)
- Risk flags as small colored pills if present

### Developer Profile Cards
- Company logo/image (circular or rounded square)
- Trust Score prominently displayed with star/badge visual
- Key metrics: Projects delivered, Average rating, Years active
- Brief description with "View Full Profile" link

### AI Closer Chat Interface
- **Layout**: Fixed chat container with message history (scrollable) + input at bottom
- **Message Bubbles**: 
  - User: Align right (LTR) / left (RTL), blue background (#3B82F6)
  - AI: Align left (LTR) / right (RTL), gray background (#F3F4F6)
- **Typing Indicator**: Animated dots for AI responses
- **Trust Elements**: AI avatar/icon, "Powered by AI" subtle badge

### Forms & Inputs
- Generous padding (p-3 to p-4)
- Clear labels above inputs
- Border focus state with gold ring (`focus:ring-2 focus:ring-amber-500`)
- Error states with red border and text below
- Helper text in muted gray

### Trust Indicators
- **Developer Trust Score**: Large circular badge with percentage/rating
- **Risk Flags**: Colored pills with icon + text (amber/red based on severity)
- **Verification Badges**: Checkmark icons for verified developers

### Data Visualization (Admin Dashboard)
- **Metric Cards**: Large number with label, small trend indicator (↑↓)
- **Charts**: Use Chart.js or Recharts with primary color scheme
- **Tables**: Striped rows, sortable headers, hover states

## Page-Specific Guidelines

### Landing Page
- **Hero**: Full-width with gradient background, large headline in both languages, search bar prominently centered, hero image showing modern property/skyline
- **Trust Section**: Developer logos, user testimonials, key metrics (properties listed, satisfied buyers)
- **Features**: 3-column grid explaining AI Closer, Property Match, Trust System
- **CTA Section**: Strong call-to-action with gold button, secondary info

### Property Listing Page
- **Filters Sidebar**: Sticky on desktop, collapsible on mobile, organized by category
- **Sort Controls**: Dropdown for price, date, match score
- **Results Grid**: 3-column on desktop, responsive down to 1-column mobile

### Property Detail Page
- **Image Gallery**: Large featured image with thumbnail carousel below
- **Info Panels**: Two-column layout - left for details, right for developer info + CTA
- **Risk Analysis**: Expandable section with clear visual indicators
- **Similar Properties**: Carousel at bottom

### Admin Dashboard
- **Sidebar Navigation**: Fixed left (LTR) / right (RTL) with icons + labels
- **Main Content**: Cards for each metric category, charts for trends
- **Data Tables**: Paginated, searchable, exportable

## Images
- **Hero Section**: Wide panoramic image of modern Middle Eastern cityscape or luxury property interior (1920x800px minimum)
- **Property Cards**: High-quality property photos (3-5 per listing)
- **Developer Profiles**: Professional company logos and completed project photos
- **Trust Section**: Minimal iconography or abstract shapes, focus on data/text

## Interactions
- **Animations**: Subtle only - hover scale on cards (1.02), fade-ins on scroll (100ms)
- **Loading States**: Skeleton screens for property cards, spinner for AI responses
- **Transitions**: 150-200ms duration for most interactions
- **Scroll Behavior**: Smooth scroll for anchor links

## Accessibility & Performance
- Minimum contrast ratio 4.5:1 for body text
- Focus indicators on all interactive elements
- Keyboard navigation for all features
- Image lazy loading for property galleries
- Semantic HTML with proper ARIA labels (especially important for bilingual content)