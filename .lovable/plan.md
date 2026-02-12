

## Enhance Service Landing Pages with Premium Animations and Gallery Effects

Based on the reference website (Mischler Webdesign), I've identified key visual effects and patterns to adapt to your service landing pages while keeping your warm, premium theme.

### What I observed from the reference site

- **Large hero images** that fill the viewport with smooth scroll-based reveal
- **Image gallery grid** with hover overlays showing an expand icon
- **Lightbox/fullscreen viewer** when clicking gallery images
- **Generous whitespace** and clean, spacious layouts
- **Scroll-triggered fade-in animations** for content sections
- **Parallax subtle movement** on image dividers
- **Smooth hover scale effects** on interactive elements

### Changes to implement

#### 1. Enhanced Gallery with Lightbox and Hover Overlays
Replace the current simple carousel/grid gallery with a masonry-style grid layout. Each image will have:
- A subtle dark overlay on hover with a "fullscreen" expand icon (like the reference)
- A smooth scale-up animation on hover
- Clicking opens a fullscreen lightbox with navigation arrows and close button
- Responsive: 3 columns on desktop, 2 on tablet, 1 on mobile

#### 2. Parallax Image Dividers
The two full-width image dividers between sections will get a subtle parallax scrolling effect using framer-motion's `useScroll` and `useTransform`, making the background image move slightly slower than the scroll, creating depth.

#### 3. Enhanced Scroll Animations
Upgrade the existing `fadeUp` animations with:
- Staggered reveals for grid items (gallery, highlights, why-choose-us cards)
- Slightly more dramatic entrance (larger Y offset, spring-based easing)
- Scale-in effect combined with fade for cards and highlights

#### 4. Hero Section Polish
- Add a subtle zoom-out animation on the hero image when the page loads (starts slightly zoomed, settles to normal)
- Smoother gradient overlay transition

#### 5. Section Transitions
- Add subtle horizontal line dividers or decorative elements between sections to create visual rhythm

### Files to modify

| File | Change |
|------|--------|
| `src/components/ServiceGallery.tsx` | Complete rewrite: masonry grid with hover overlays, lightbox component |
| `src/components/ServiceLandingPage.tsx` | Parallax dividers, enhanced animations, hero zoom effect |

### Technical approach

- **Lightbox**: Built with framer-motion `AnimatePresence` and a portal overlay -- no new dependencies needed
- **Parallax**: Using framer-motion's `useScroll` + `useTransform` (already installed)
- **Masonry grid**: CSS columns approach for natural image flow without cropping
- **Hover overlays**: Tailwind CSS with group-hover utilities + framer-motion for smooth opacity transitions
- All effects are mobile-friendly with reduced motion for accessibility

