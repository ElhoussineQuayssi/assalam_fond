# Fix Home Page SSR Hydration Issues - Testimonials Empty &amp; Stats 0 on Initial Load

Status: ✅ Components fixed (.new versions ready)

## Diagnosis
- **Testimonials**: SSR t.raw() unavailable → empty
- **Stats Cards**: SSR displayValue="0", ScrollTrigger client-only
- **Fixes on refresh**: Client re-render loads data → works

## Steps:
- [✅] 1. Confirmed all translations (en/ar/fr) have testimonials.list
- [✅] 2. Created TODO.md
- [✅] 3. Fixed TestimonialsSection.jsx.new (use client, fallback, logs)
- [✅] 4. Fixed ImpactCard.jsx.new (static value, client animation)
- [ ] 5. Test: npm run dev → verify http://localhost:3000/[locale] shows correct initial load
- [ ] 6. Replace .new → original files
- [ ] 7. attempt_completion

**Next:** Run dev server for testing


