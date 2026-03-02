# Strona wizytówka — firma spawalnicza: Plan Implementacji

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Zbudować statyczną stronę wizytówkę dla firmy spawalniczej z CMS (Keystatic) do zarządzania treściami.

**Architecture:** Astro jako static site generator z Keystatic CMS (Git-based). One-pager z anchor navigation + dynamiczne podstrony realizacji. Tailwind CSS do stylowania. Zdjęcia w `public/images/`, docelowo migracja na Cloudinary. Deploy na Vercel.

**Tech Stack:** Astro, Keystatic, Tailwind CSS, React (dla Keystatic UI), TypeScript

**Design doc:** `docs/plans/2026-03-02-strona-spawalnicza-design.md`

---

## Task 1: Scaffold projektu Astro

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `tailwind.config.mjs`
- Create: `src/pages/index.astro`
- Create: `src/layouts/Layout.astro`

**Step 1: Inicjalizacja projektu Astro**

```bash
cd D:/spaw
npm create astro@latest . -- --template minimal --typescript strict --install --git
```

**Step 2: Dodaj integracje React, Markdoc i Tailwind**

```bash
npx astro add react markdoc tailwindcss
```

**Step 3: Zainstaluj Keystatic**

```bash
npm install @keystatic/core @keystatic/astro
```

**Step 4: Dodaj integrację Keystatic do `astro.config.mjs`**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import markdoc from '@astrojs/markdoc'
import tailwindcss from '@astrojs/tailwind'
import keystatic from '@keystatic/astro'

export default defineConfig({
  integrations: [react(), markdoc(), tailwindcss(), keystatic()],
  output: 'hybrid',
})
```

**Step 5: Zweryfikuj, że dev server startuje**

```bash
npm run dev
```

Expected: Server na `http://localhost:4321`, `/keystatic` pokazuje panel Keystatic.

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project with Keystatic, Tailwind, React"
```

---

## Task 2: Konfiguracja Tailwind — design tokens

**Files:**
- Modify: `tailwind.config.mjs`
- Create: `src/styles/global.css`

**Step 1: Skonfiguruj kolory i typografię w `tailwind.config.mjs`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        dark: '#1C1917',
        light: '#F5F5F4',
        metal: '#78716C',
        cream: '#FAFAF9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Step 2: Utwórz `src/styles/global.css`**

```css
@import 'tailwindcss';

@theme {
  --color-primary: #F97316;
  --color-dark: #1C1917;
  --color-light: #F5F5F4;
  --color-metal: #78716C;
  --color-cream: #FAFAF9;
  --font-sans: 'Inter', system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
}
```

Uwaga: Astro z Tailwind v4 używa `@import 'tailwindcss'` zamiast dyrektyw `@tailwind`. Sprawdź którą wersję Tailwind zainstalował `astro add tailwindcss` i dostosuj odpowiednio. Jeśli Tailwind v3 — użyj `@tailwind base; @tailwind components; @tailwind utilities;`.

**Step 3: Zweryfikuj, że kolory działają**

Dodaj testowy element do `src/pages/index.astro`:

```astro
<div class="bg-primary text-cream p-8">Test kolorów</div>
```

Sprawdź w przeglądarce — powinien być pomarańczowy element z jasnym tekstem.

**Step 4: Commit**

```bash
git add -A
git commit -m "style: configure Tailwind design tokens — colors, fonts"
```

---

## Task 3: Konfiguracja Keystatic — model danych

**Files:**
- Create: `keystatic.config.ts`

**Step 1: Utwórz pełną konfigurację Keystatic**

```typescript
// keystatic.config.ts
import { config, fields, collection, singleton } from '@keystatic/core'

export default config({
  storage: { kind: 'local' },

  singletons: {
    heroSection: singleton({
      label: 'Sekcja Hero',
      path: 'src/content/singletons/hero',
      schema: {
        title: fields.text({ label: 'Tytuł' }),
        subtitle: fields.text({ label: 'Podtytuł' }),
        ctaPrimary: fields.text({ label: 'Tekst CTA główne' }),
        ctaSecondary: fields.text({ label: 'Tekst CTA drugorzędne' }),
        backgroundImage: fields.image({
          label: 'Zdjęcie tła',
          directory: 'public/images/hero',
          publicPath: '/images/hero/',
        }),
      },
    }),

    aboutSection: singleton({
      label: 'O firmie',
      path: 'src/content/singletons/about',
      format: { contentField: 'content' },
      schema: {
        heading: fields.text({ label: 'Nagłówek' }),
        content: fields.markdoc({ label: 'Treść' }),
        image: fields.image({
          label: 'Zdjęcie',
          directory: 'public/images/about',
          publicPath: '/images/about/',
        }),
      },
    }),

    contactInfo: singleton({
      label: 'Dane kontaktowe',
      path: 'src/content/singletons/contact-info',
      schema: {
        phone: fields.text({ label: 'Telefon' }),
        email: fields.text({ label: 'Email' }),
        address: fields.text({ label: 'Adres' }),
        mapsEmbedUrl: fields.url({ label: 'Google Maps Embed URL' }),
        facebookUrl: fields.url({ label: 'Facebook URL' }),
        instagramUrl: fields.url({ label: 'Instagram URL' }),
      },
    }),

    siteSettings: singleton({
      label: 'Ustawienia strony',
      path: 'src/content/singletons/site-settings',
      schema: {
        companyName: fields.text({ label: 'Nazwa firmy' }),
        seoDescription: fields.text({ label: 'Opis SEO', multiline: true }),
        logo: fields.image({
          label: 'Logo',
          directory: 'public/images/brand',
          publicPath: '/images/brand/',
        }),
      },
    }),
  },

  collections: {
    services: collection({
      label: 'Usługi',
      slugField: 'title',
      path: 'src/content/services/*',
      schema: {
        title: fields.slug({ name: { label: 'Tytuł' } }),
        icon: fields.select({
          label: 'Ikona',
          options: [
            { label: 'Meble', value: 'furniture' },
            { label: 'Spawanie', value: 'welding' },
            { label: 'Balustrady', value: 'railing' },
            { label: 'Naprawa', value: 'repair' },
            { label: 'Konstrukcje', value: 'construction' },
          ],
          defaultValue: 'welding',
        }),
        shortDescription: fields.text({ label: 'Opis krótki', multiline: true }),
        order: fields.integer({ label: 'Kolejność', defaultValue: 0 }),
      },
    }),

    projects: collection({
      label: 'Realizacje',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.slug({ name: { label: 'Tytuł' } }),
        category: fields.select({
          label: 'Kategoria',
          options: [
            { label: 'Meble', value: 'meble' },
            { label: 'Konstrukcje', value: 'konstrukcje' },
            { label: 'Balustrady', value: 'balustrady' },
            { label: 'Inne', value: 'inne' },
          ],
          defaultValue: 'meble',
        }),
        description: fields.markdoc({ label: 'Opis' }),
        mainImage: fields.image({
          label: 'Zdjęcie główne',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        gallery: fields.array(
          fields.image({
            label: 'Zdjęcie',
            directory: 'public/images/projects',
            publicPath: '/images/projects/',
          }),
          { label: 'Galeria', itemLabel: (props) => props.value || 'Zdjęcie' }
        ),
        date: fields.date({ label: 'Data realizacji' }),
        featured: fields.checkbox({ label: 'Wyróżniona', defaultValue: false }),
      },
    }),

    pricing: collection({
      label: 'Cennik',
      slugField: 'service',
      path: 'src/content/pricing/*',
      schema: {
        service: fields.slug({ name: { label: 'Usługa' } }),
        priceFrom: fields.integer({ label: 'Cena od (zł)' }),
        priceTo: fields.integer({ label: 'Cena do (zł)' }),
        unit: fields.select({
          label: 'Jednostka',
          options: [
            { label: 'sztuka', value: 'szt' },
            { label: 'metr bieżący', value: 'mb' },
            { label: 'metr kwadratowy', value: 'm2' },
            { label: 'usługa', value: 'usluga' },
          ],
          defaultValue: 'szt',
        }),
        notes: fields.text({ label: 'Uwagi' }),
        order: fields.integer({ label: 'Kolejność', defaultValue: 0 }),
      },
    }),

    contactSubmissions: collection({
      label: 'Zgłoszenia kontaktowe',
      slugField: 'name',
      path: 'src/content/submissions/*',
      schema: {
        name: fields.slug({ name: { label: 'Imię' } }),
        email: fields.text({ label: 'Email' }),
        phone: fields.text({ label: 'Telefon' }),
        message: fields.text({ label: 'Treść', multiline: true }),
        createdAt: fields.datetime({ label: 'Data zgłoszenia' }),
      },
    }),
  },
})
```

**Step 2: Zweryfikuj panel Keystatic**

```bash
npm run dev
```

Wejdź na `http://localhost:4321/keystatic`. Expected: widoczne sekcje "Usługi", "Realizacje", "Cennik", "Zgłoszenia kontaktowe" oraz singletony "Sekcja Hero", "O firmie", "Dane kontaktowe", "Ustawienia strony".

**Step 3: Dodaj przykładowe dane testowe przez panel**

Przez `/keystatic`:
1. Ustawienia strony → nazwa: "StalLoft" (placeholder), opis SEO
2. Sekcja Hero → tytuł, podtytuł, CTA teksty
3. Dodaj 2-3 usługi
4. Dodaj 1-2 realizacje z opisem
5. Dodaj 2-3 pozycje cennika
6. Dane kontaktowe → telefon, email, adres

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: configure Keystatic CMS — collections, singletons, seed data"
```

---

## Task 4: Layout — Header, Footer, bazowy Layout

**Files:**
- Create: `src/layouts/Layout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/MobileMenu.astro`

**Step 1: Utwórz `src/layouts/Layout.astro`**

```astro
---
import Header from '../components/Header.astro'
import Footer from '../components/Footer.astro'
import '../styles/global.css'

interface Props {
  title: string
  description?: string
}

const { title, description = 'Meble loftowe & usługi spawalnicze' } = Astro.props
---

<!doctype html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
    <title>{title}</title>
  </head>
  <body class="bg-light text-dark font-sans">
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Step 2: Utwórz `src/components/Header.astro`**

Sticky header z nawigacją desktopową i hamburger menu na mobile.

```astro
---
const navLinks = [
  { label: 'Usługi', href: '#uslugi' },
  { label: 'Realizacje', href: '#realizacje' },
  { label: 'Cennik', href: '#cennik' },
  { label: 'O firmie', href: '#o-firmie' },
  { label: 'Kontakt', href: '#kontakt' },
]
---

<header class="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-sm border-b border-metal/20">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
    <a href="/" class="text-cream font-bold text-xl tracking-wider uppercase">
      StalLoft
    </a>

    <!-- Desktop nav -->
    <ul class="hidden md:flex items-center gap-8">
      {navLinks.map((link) => (
        <li>
          <a
            href={link.href}
            class="text-cream/80 hover:text-primary transition-colors text-sm uppercase tracking-widest"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>

    <!-- Mobile hamburger -->
    <button
      id="menu-toggle"
      class="md:hidden text-cream p-2"
      aria-label="Otwórz menu"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </nav>

  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden md:hidden bg-dark border-t border-metal/20">
    <ul class="flex flex-col px-4 py-4 gap-4">
      {navLinks.map((link) => (
        <li>
          <a
            href={link.href}
            class="mobile-nav-link block text-cream/80 hover:text-primary transition-colors text-sm uppercase tracking-widest"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</header>

<script>
  const toggle = document.getElementById('menu-toggle')
  const menu = document.getElementById('mobile-menu')

  toggle?.addEventListener('click', () => {
    menu?.classList.toggle('hidden')
  })

  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      menu?.classList.add('hidden')
    })
  })
</script>
```

**Step 3: Utwórz `src/components/Footer.astro`**

```astro
---
const currentYear = new Date().getFullYear()
const navLinks = [
  { label: 'Usługi', href: '#uslugi' },
  { label: 'Realizacje', href: '#realizacje' },
  { label: 'Cennik', href: '#cennik' },
  { label: 'Kontakt', href: '#kontakt' },
]
---

<footer class="bg-dark text-cream/70 border-t border-metal/20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Logo & opis -->
      <div>
        <h3 class="text-cream font-bold text-xl tracking-wider uppercase mb-4">StalLoft</h3>
        <p class="text-sm">Meble loftowe & profesjonalne usługi spawalnicze.</p>
      </div>

      <!-- Nawigacja -->
      <div>
        <h4 class="text-cream font-semibold uppercase tracking-wider text-sm mb-4">Nawigacja</h4>
        <ul class="space-y-2">
          {navLinks.map((link) => (
            <li>
              <a href={link.href} class="text-sm hover:text-primary transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <!-- Kontakt -->
      <div>
        <h4 class="text-cream font-semibold uppercase tracking-wider text-sm mb-4">Kontakt</h4>
        <ul class="space-y-2 text-sm">
          <li>Tel: <a href="tel:+48123456789" class="hover:text-primary transition-colors">+48 123 456 789</a></li>
          <li>Email: <a href="mailto:kontakt@stalloft.pl" class="hover:text-primary transition-colors">kontakt@stalloft.pl</a></li>
        </ul>
      </div>
    </div>

    <div class="mt-12 pt-8 border-t border-metal/20 text-center text-sm">
      <p>&copy; {currentYear} StalLoft. Wszelkie prawa zastrzeżone.</p>
    </div>
  </div>
</footer>
```

**Step 4: Zweryfikuj**

```bash
npm run dev
```

Sprawdź `http://localhost:4321` — widoczny sticky header z nawigacją, footer na dole. Na mobile hamburger menu otwiera/zamyka się.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Layout, Header with mobile menu, Footer"
```

---

## Task 5: Sekcja Hero

**Files:**
- Create: `src/components/sections/Hero.astro`
- Modify: `src/pages/index.astro`

**Step 1: Utwórz komponent Hero**

```astro
---
// src/components/sections/Hero.astro
---

<section id="hero" class="relative min-h-screen flex items-center justify-center">
  <!-- Placeholder tło (gradient imitujący ciemne zdjęcie spawania) -->
  <div class="absolute inset-0 bg-gradient-to-br from-dark via-stone-900 to-dark">
    <div class="absolute inset-0 bg-dark/60"></div>
  </div>

  <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
    <h1 class="text-4xl sm:text-5xl lg:text-7xl font-bold text-cream uppercase tracking-wider mb-6">
      StalLoft
    </h1>
    <p class="text-lg sm:text-xl lg:text-2xl text-cream/80 mb-10">
      Meble loftowe & usługi spawalnicze
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a
        href="#realizacje"
        class="px-8 py-3 bg-primary text-cream font-semibold uppercase tracking-wider text-sm rounded hover:bg-primary/90 transition-colors"
      >
        Zobacz realizacje
      </a>
      <a
        href="#kontakt"
        class="px-8 py-3 border-2 border-cream/50 text-cream font-semibold uppercase tracking-wider text-sm rounded hover:border-primary hover:text-primary transition-colors"
      >
        Skontaktuj się
      </a>
    </div>
  </div>
</section>
```

Uwaga: Na start używamy gradientowego tła. Po dodaniu zdjęcia przez CMS — podmienić na `<img>` z `backgroundImage` z singletona `heroSection`.

**Step 2: Podłącz do strony głównej**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro'
import Hero from '../components/sections/Hero.astro'
---

<Layout title="StalLoft — Meble loftowe & spawanie">
  <Hero />
</Layout>
```

**Step 3: Zweryfikuj**

Sprawdź `http://localhost:4321` — pełnoekranowy hero z ciemnym tłem, nagłówek, podtytuł, dwa CTA buttony. Responsywne na mobile.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Hero section with CTA buttons"
```

---

## Task 6: Sekcja Usługi

**Files:**
- Create: `src/components/sections/Services.astro`
- Create: `src/components/ServiceCard.astro`
- Create: `src/components/icons/ServiceIcon.astro`
- Modify: `src/pages/index.astro` — dodaj import

**Step 1: Utwórz komponent ikony**

```astro
---
// src/components/icons/ServiceIcon.astro
interface Props {
  icon: string
  class?: string
}

const { icon, class: className = 'w-12 h-12' } = Astro.props

const icons: Record<string, string> = {
  furniture: 'M4 6h16M4 10h16M6 14h12v4H6z',
  welding: 'M13 10V3L4 14h7v7l9-11h-7z',
  railing: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6',
  repair: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  construction: 'M2 20h20M6 20V8l6-4 6 4v12M10 20v-4h4v4',
}
---

<svg class={className} fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" d={icons[icon] || icons.welding} />
</svg>
```

**Step 2: Utwórz kartę usługi**

```astro
---
// src/components/ServiceCard.astro
import ServiceIcon from './icons/ServiceIcon.astro'

interface Props {
  title: string
  description: string
  icon: string
}

const { title, description, icon } = Astro.props
---

<div class="bg-cream border border-metal/20 rounded-lg p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
  <div class="text-primary mb-4">
    <ServiceIcon icon={icon} />
  </div>
  <h3 class="text-lg font-bold uppercase tracking-wider mb-3">{title}</h3>
  <p class="text-metal text-sm leading-relaxed">{description}</p>
</div>
```

**Step 3: Utwórz sekcję usług**

```astro
---
// src/components/sections/Services.astro
import ServiceCard from '../ServiceCard.astro'

// Placeholder dane — docelowo z Keystatic
const services = [
  { title: 'Meble loftowe', icon: 'furniture', shortDescription: 'Stoły, regały, szafki i inne meble w stylu industrialnym. Stal + drewno na zamówienie.' },
  { title: 'Spawanie konstrukcji', icon: 'construction', shortDescription: 'Konstrukcje stalowe, pergole, wiaty. Spawanie MIG/MAG i TIG.' },
  { title: 'Balustrady i ogrodzenia', icon: 'railing', shortDescription: 'Balustrady schodowe, balkonowe, ogrodzenia. Nowoczesne i klasyczne wzory.' },
  { title: 'Naprawy spawalnicze', icon: 'repair', shortDescription: 'Naprawy elementów stalowych, spawanie serwisowe. Szybko i solidnie.' },
]
---

<section id="uslugi" class="py-20 bg-light">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-4">Usługi</h2>
      <p class="text-metal max-w-2xl mx-auto">Co możemy dla Ciebie zrobić</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map((service) => (
        <ServiceCard
          title={service.title}
          description={service.shortDescription}
          icon={service.icon}
        />
      ))}
    </div>
  </div>
</section>
```

**Step 4: Dodaj import do `index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro'
import Hero from '../components/sections/Hero.astro'
import Services from '../components/sections/Services.astro'
---

<Layout title="StalLoft — Meble loftowe & spawanie">
  <Hero />
  <Services />
</Layout>
```

**Step 5: Zweryfikuj**

Sprawdź `http://localhost:4321#uslugi` — 4 karty usług w gridzie, responsywne. Hover efekt na kartach.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Services section with icon cards"
```

---

## Task 7: Sekcja Realizacje (grid + filtry)

**Files:**
- Create: `src/components/sections/Projects.astro`
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/ProjectFilter.astro` (client-side React)
- Modify: `src/pages/index.astro`

**Step 1: Utwórz kartę realizacji**

```astro
---
// src/components/ProjectCard.astro
interface Props {
  title: string
  category: string
  mainImage: string
  slug: string
}

const { title, category, mainImage, slug } = Astro.props
---

<a
  href={`/realizacja/${slug}`}
  class="group block overflow-hidden rounded-lg"
  data-category={category}
>
  <div class="relative aspect-[4/3] overflow-hidden bg-metal/20">
    {mainImage ? (
      <img
        src={mainImage}
        alt={title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    ) : (
      <div class="w-full h-full flex items-center justify-center text-metal">
        <span class="text-sm">Brak zdjęcia</span>
      </div>
    )}
    <div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/50 transition-colors duration-300 flex items-end">
      <div class="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 class="text-cream font-bold text-lg">{title}</h3>
        <span class="text-primary text-sm uppercase tracking-wider">{category}</span>
      </div>
    </div>
  </div>
</a>
```

**Step 2: Utwórz komponent filtrów (inline script, bez React)**

```astro
---
// src/components/ProjectFilter.astro
const categories = [
  { label: 'Wszystkie', value: 'all' },
  { label: 'Meble', value: 'meble' },
  { label: 'Konstrukcje', value: 'konstrukcje' },
  { label: 'Balustrady', value: 'balustrady' },
  { label: 'Inne', value: 'inne' },
]
---

<div class="flex flex-wrap justify-center gap-3 mb-12">
  {categories.map((cat) => (
    <button
      class="filter-btn px-5 py-2 text-sm uppercase tracking-wider border border-metal/30 rounded-full transition-all data-[active]:bg-primary data-[active]:border-primary data-[active]:text-cream hover:border-primary"
      data-filter={cat.value}
      data-active={cat.value === 'all' ? '' : undefined}
    >
      {cat.label}
    </button>
  ))}
</div>

<script>
  const buttons = document.querySelectorAll('.filter-btn')
  const cards = document.querySelectorAll('[data-category]')

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter')

      buttons.forEach((b) => b.removeAttribute('data-active'))
      btn.setAttribute('data-active', '')

      cards.forEach((card) => {
        const el = card as HTMLElement
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          el.style.display = ''
        } else {
          el.style.display = 'none'
        }
      })
    })
  })
</script>
```

**Step 3: Utwórz sekcję realizacji**

```astro
---
// src/components/sections/Projects.astro
import ProjectCard from '../ProjectCard.astro'
import ProjectFilter from '../ProjectFilter.astro'

// Placeholder dane — docelowo z Keystatic
const projects = [
  { title: 'Stół industrialny', category: 'meble', mainImage: '', slug: 'stol-industrialny' },
  { title: 'Regał loftowy', category: 'meble', mainImage: '', slug: 'regal-loftowy' },
  { title: 'Balustrada schodowa', category: 'balustrady', mainImage: '', slug: 'balustrada-schodowa' },
  { title: 'Pergola ogrodowa', category: 'konstrukcje', mainImage: '', slug: 'pergola-ogrodowa' },
  { title: 'Stolik kawowy', category: 'meble', mainImage: '', slug: 'stolik-kawowy' },
  { title: 'Ogrodzenie panelowe', category: 'balustrady', mainImage: '', slug: 'ogrodzenie-panelowe' },
]
---

<section id="realizacje" class="py-20 bg-dark">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-4 text-cream">Realizacje</h2>
      <p class="text-metal max-w-2xl mx-auto">Nasze ostatnie projekty</p>
    </div>

    <ProjectFilter />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          title={project.title}
          category={project.category}
          mainImage={project.mainImage}
          slug={project.slug}
        />
      ))}
    </div>
  </div>
</section>
```

**Step 4: Dodaj do `index.astro`**

```astro
import Projects from '../components/sections/Projects.astro'
<!-- w Layout: -->
<Hero />
<Services />
<Projects />
```

**Step 5: Zweryfikuj**

Filtry przełączają widoczność kart. Grid responsywny (1→2→3 kolumny).

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Projects section with category filters"
```

---

## Task 8: Sekcja Cennik

**Files:**
- Create: `src/components/sections/Pricing.astro`
- Modify: `src/pages/index.astro`

**Step 1: Utwórz sekcję cennika**

```astro
---
// src/components/sections/Pricing.astro

// Placeholder dane — docelowo z Keystatic
const pricingItems = [
  { service: 'Stół loftowy', priceFrom: 1500, priceTo: 4000, unit: 'szt', notes: 'Zależnie od rozmiaru i materiału' },
  { service: 'Regał industrialny', priceFrom: 800, priceTo: 2500, unit: 'szt', notes: 'Różne konfiguracje półek' },
  { service: 'Balustrada schodowa', priceFrom: 350, priceTo: 600, unit: 'mb', notes: 'Stal + wykończenie' },
  { service: 'Ogrodzenie panelowe', priceFrom: 250, priceTo: 450, unit: 'mb', notes: 'Z montażem' },
  { service: 'Spawanie naprawcze', priceFrom: 100, priceTo: 0, unit: 'usluga', notes: 'Wycena indywidualna' },
]

const unitLabels: Record<string, string> = {
  szt: 'szt.',
  mb: 'mb.',
  m2: 'm²',
  usluga: 'usługa',
}

function formatPrice(item: typeof pricingItems[0]) {
  if (item.priceTo && item.priceTo > item.priceFrom) {
    return `${item.priceFrom} – ${item.priceTo} zł / ${unitLabels[item.unit]}`
  }
  return `od ${item.priceFrom} zł / ${unitLabels[item.unit]}`
}
---

<section id="cennik" class="py-20 bg-light">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-4">Cennik</h2>
      <p class="text-metal max-w-2xl mx-auto">Orientacyjne ceny naszych usług</p>
    </div>

    <div class="space-y-4">
      {pricingItems.map((item) => (
        <div class="bg-cream border border-metal/20 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 class="font-bold text-lg">{item.service}</h3>
            {item.notes && <p class="text-metal text-sm mt-1">{item.notes}</p>}
          </div>
          <div class="text-primary font-bold text-lg whitespace-nowrap">
            {formatPrice(item)}
          </div>
        </div>
      ))}
    </div>

    <p class="text-center text-metal text-sm mt-8">
      * Ceny orientacyjne. Ostateczna wycena po indywidualnej konsultacji.
    </p>
  </div>
</section>
```

**Step 2: Dodaj do `index.astro`**

**Step 3: Zweryfikuj** — lista cennikowa responsywna, ceny po prawej na desktop, pod spodem na mobile.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Pricing section"
```

---

## Task 9: Sekcja O firmie

**Files:**
- Create: `src/components/sections/About.astro`
- Modify: `src/pages/index.astro`

**Step 1: Utwórz sekcję O firmie**

```astro
---
// src/components/sections/About.astro
---

<section id="o-firmie" class="py-20 bg-dark">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Tekst -->
      <div>
        <h2 class="text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-6 text-cream">O firmie</h2>
        <div class="space-y-4 text-cream/80 leading-relaxed">
          <p>
            Zajmujemy się profesjonalnym spawaniem i produkcją mebli w stylu loftowym.
            Łączymy solidne rzemiosło z nowoczesnym designem, tworząc unikalne produkty
            na zamówienie.
          </p>
          <p>
            Specjalizujemy się w spawaniu MIG/MAG i TIG. Każdy projekt traktujemy
            indywidualnie — od konsultacji, przez projekt, po realizację i montaż.
          </p>
          <p>
            Stawiamy na jakość materiałów, precyzję wykonania i terminowość.
            Nasi klienci wracają do nas, bo wiedzą, że mogą na nas polegać.
          </p>
        </div>
      </div>

      <!-- Zdjęcie placeholder -->
      <div class="aspect-[4/3] bg-metal/20 rounded-lg overflow-hidden flex items-center justify-center">
        <span class="text-metal text-sm">Zdjęcie warsztatu</span>
      </div>
    </div>
  </div>
</section>
```

**Step 2: Dodaj do `index.astro`, zweryfikuj, commit**

```bash
git add -A
git commit -m "feat: add About section"
```

---

## Task 10: Sekcja Kontakt (formularz + dane + mapa)

**Files:**
- Create: `src/components/sections/Contact.astro`
- Create: `src/components/ContactForm.astro`
- Modify: `src/pages/index.astro`

**Step 1: Utwórz formularz kontaktowy**

```astro
---
// src/components/ContactForm.astro
---

<form id="contact-form" class="space-y-5">
  <div>
    <label for="name" class="block text-sm font-semibold uppercase tracking-wider mb-2">Imię i nazwisko</label>
    <input
      type="text"
      id="name"
      name="name"
      required
      class="w-full px-4 py-3 bg-cream border border-metal/30 rounded-lg focus:outline-none focus:border-primary transition-colors"
      placeholder="Jan Kowalski"
    />
  </div>
  <div>
    <label for="email" class="block text-sm font-semibold uppercase tracking-wider mb-2">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      class="w-full px-4 py-3 bg-cream border border-metal/30 rounded-lg focus:outline-none focus:border-primary transition-colors"
      placeholder="jan@example.com"
    />
  </div>
  <div>
    <label for="phone" class="block text-sm font-semibold uppercase tracking-wider mb-2">Telefon</label>
    <input
      type="tel"
      id="phone"
      name="phone"
      class="w-full px-4 py-3 bg-cream border border-metal/30 rounded-lg focus:outline-none focus:border-primary transition-colors"
      placeholder="+48 123 456 789"
    />
  </div>
  <div>
    <label for="message" class="block text-sm font-semibold uppercase tracking-wider mb-2">Wiadomość</label>
    <textarea
      id="message"
      name="message"
      rows="5"
      required
      class="w-full px-4 py-3 bg-cream border border-metal/30 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
      placeholder="Opisz czego potrzebujesz..."
    ></textarea>
  </div>
  <button
    type="submit"
    class="w-full px-8 py-3 bg-primary text-cream font-semibold uppercase tracking-wider text-sm rounded-lg hover:bg-primary/90 transition-colors"
  >
    Wyślij wiadomość
  </button>
  <p id="form-status" class="text-sm text-center hidden"></p>
</form>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement
  const status = document.getElementById('form-status')

  form?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = new FormData(form)
    // Docelowo: POST do API route lub Formspree
    // Na razie: symulacja sukcesu
    if (status) {
      status.textContent = 'Dziękujemy! Wiadomość została wysłana.'
      status.className = 'text-sm text-center text-green-600'
      status.classList.remove('hidden')
    }
    form.reset()
  })
</script>
```

**Step 2: Utwórz sekcję Kontakt**

```astro
---
// src/components/sections/Contact.astro
import ContactForm from '../ContactForm.astro'
---

<section id="kontakt" class="py-20 bg-light">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-4">Kontakt</h2>
      <p class="text-metal max-w-2xl mx-auto">Napisz do nas lub zadzwoń</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Formularz -->
      <div>
        <ContactForm />
      </div>

      <!-- Dane kontaktowe + mapa -->
      <div class="space-y-8">
        <div class="space-y-4">
          <div class="flex items-start gap-4">
            <svg class="w-6 h-6 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <div>
              <p class="font-semibold">Telefon</p>
              <a href="tel:+48123456789" class="text-metal hover:text-primary transition-colors">+48 123 456 789</a>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <svg class="w-6 h-6 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <div>
              <p class="font-semibold">Email</p>
              <a href="mailto:kontakt@stalloft.pl" class="text-metal hover:text-primary transition-colors">kontakt@stalloft.pl</a>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <svg class="w-6 h-6 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <div>
              <p class="font-semibold">Adres</p>
              <p class="text-metal">ul. Stalowa 1, 00-000 Miasto</p>
            </div>
          </div>
        </div>

        <!-- Mapa placeholder -->
        <div class="aspect-video bg-metal/20 rounded-lg overflow-hidden flex items-center justify-center">
          <span class="text-metal text-sm">Google Maps embed</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Step 3: Dodaj do `index.astro`, zweryfikuj, commit**

```bash
git add -A
git commit -m "feat: add Contact section with form, info, and map placeholder"
```

---

## Task 11: Podstrona realizacji `/realizacja/[slug]`

**Files:**
- Create: `src/pages/realizacja/[slug].astro`

**Step 1: Utwórz dynamiczną podstronę**

```astro
---
// src/pages/realizacja/[slug].astro
import Layout from '../../layouts/Layout.astro'

// Placeholder — docelowo z Keystatic reader API
export function getStaticPaths() {
  const projects = [
    { slug: 'stol-industrialny', title: 'Stół industrialny', category: 'meble', description: 'Stół industrialny z blatem dębowym i stalowymi nogami.', mainImage: '', gallery: [] },
    { slug: 'regal-loftowy', title: 'Regał loftowy', category: 'meble', description: 'Regał w stylu loft z profili stalowych.', mainImage: '', gallery: [] },
  ]
  return projects.map((p) => ({
    params: { slug: p.slug },
    props: p,
  }))
}

const { title, category, description, mainImage, gallery } = Astro.props
---

<Layout title={`${title} — StalLoft`}>
  <div class="pt-24 pb-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Powrót -->
      <a href="/#realizacje" class="inline-flex items-center gap-2 text-metal hover:text-primary transition-colors mb-8 text-sm uppercase tracking-wider">
        &larr; Wróć do realizacji
      </a>

      <!-- Nagłówek -->
      <h1 class="text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-2">{title}</h1>
      <span class="text-primary text-sm uppercase tracking-wider">{category}</span>

      <!-- Zdjęcie główne -->
      <div class="mt-8 aspect-video bg-metal/20 rounded-lg overflow-hidden flex items-center justify-center">
        {mainImage ? (
          <img src={mainImage} alt={title} class="w-full h-full object-cover" />
        ) : (
          <span class="text-metal">Zdjęcie główne</span>
        )}
      </div>

      <!-- Opis -->
      <div class="mt-8 prose prose-stone max-w-none">
        <p>{description}</p>
      </div>

      <!-- Galeria -->
      {gallery && gallery.length > 0 && (
        <div class="mt-12">
          <h2 class="text-2xl font-bold uppercase tracking-wider mb-6">Galeria</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.map((img: string) => (
              <div class="aspect-square bg-metal/20 rounded-lg overflow-hidden">
                <img src={img} alt="" class="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</Layout>
```

**Step 2: Zweryfikuj** — `/realizacja/stol-industrialny` renderuje się z powrotem do grid.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add dynamic project detail page /realizacja/[slug]"
```

---

## Task 12: Podłączenie danych z Keystatic (reader API)

**Files:**
- Modify: `src/components/sections/Services.astro`
- Modify: `src/components/sections/Projects.astro`
- Modify: `src/components/sections/Pricing.astro`
- Modify: `src/components/sections/About.astro`
- Modify: `src/components/sections/Hero.astro`
- Modify: `src/components/sections/Contact.astro`
- Modify: `src/pages/realizacja/[slug].astro`
- Create: `src/utils/keystatic.ts`

**Step 1: Utwórz helper do odczytu danych z Keystatic**

```typescript
// src/utils/keystatic.ts
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'

export const reader = createReader(process.cwd(), keystaticConfig)
```

**Step 2: Podłącz dane w każdym komponencie sekcji**

Zamień placeholder tablice na odczyty z readera, np.:

```astro
---
// src/components/sections/Services.astro
import { reader } from '../../utils/keystatic'
import ServiceCard from '../ServiceCard.astro'

const allServices = await reader.collections.services.all()
const services = allServices
  .sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0))
---
```

Powtórz wzorzec dla: Projects, Pricing, Hero (singleton), About (singleton), Contact (singleton).

**Step 3: Podłącz dane w `/realizacja/[slug].astro`**

```astro
---
import { reader } from '../../utils/keystatic'

export async function getStaticPaths() {
  const projects = await reader.collections.projects.all()
  return projects.map((p) => ({
    params: { slug: p.slug },
    props: { ...p.entry, slug: p.slug },
  }))
}
---
```

**Step 4: Zweryfikuj** — dane z panelu `/keystatic` pojawiają się na stronie.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: connect all sections to Keystatic reader API"
```

---

## Task 13: API route dla formularza kontaktowego

**Files:**
- Create: `src/pages/api/contact.ts`
- Modify: `src/components/ContactForm.astro` — podłącz do API

**Step 1: Utwórz API endpoint**

```typescript
// src/pages/api/contact.ts
import type { APIRoute } from 'astro'
import fs from 'node:fs/promises'
import path from 'node:path'

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json()
  const { name, email, phone, message } = data

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Wypełnij wymagane pola' }), { status: 400 })
  }

  const timestamp = new Date().toISOString()
  const slug = `${timestamp.slice(0, 10)}-${name.toLowerCase().replace(/\s+/g, '-')}`
  const filePath = path.join(process.cwd(), 'src/content/submissions', slug)

  await fs.mkdir(filePath, { recursive: true })
  await fs.writeFile(
    path.join(filePath, 'index.yaml'),
    [
      `name: "${name}"`,
      `email: "${email}"`,
      `phone: "${phone || ''}"`,
      `message: "${message.replace(/"/g, '\\"')}"`,
      `createdAt: "${timestamp}"`,
    ].join('\n')
  )

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
```

Uwaga: To działa w trybie dev / SSR. W trybie statycznym formularz może wymagać zewnętrznego serwisu (Formspree, Netlify Forms). Zdecydować na etapie deploy.

**Step 2: Podłącz formularz do API**

W `ContactForm.astro` zamień symulację na fetch do `/api/contact`.

**Step 3: Zweryfikuj** — wyślij formularz, sprawdź czy plik pojawia się w `src/content/submissions/`.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add contact form API route saving to Keystatic"
```

---

## Task 14: Animacje scroll (fade-in)

**Files:**
- Create: `src/scripts/scroll-animations.ts`
- Modify: `src/layouts/Layout.astro` — dodaj script
- Modify: sekcje — dodaj klasy animacji

**Step 1: Utwórz skrypt animacji z Intersection Observer**

```typescript
// src/scripts/scroll-animations.ts
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
)

document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))
```

**Step 2: Dodaj style animacji do `global.css`**

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}
```

**Step 3: Dodaj klasy `animate-on-scroll` do elementów sekcji** (karty usług, karty realizacji, cennik items, itp.)

**Step 4: Zweryfikuj, commit**

```bash
git add -A
git commit -m "feat: add scroll-triggered fade-in animations"
```

---

## Task 15: SEO, meta tagi, Open Graph

**Files:**
- Modify: `src/layouts/Layout.astro` — rozszerz head
- Create: `public/favicon.svg`

**Step 1: Rozszerz `<head>` w Layout**

Dodaj Open Graph meta tagi, canonical URL, lang, favicon, structured data (LocalBusiness schema.org).

**Step 2: Utwórz prosty favicon SVG** (ikona spawania/iskry)

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add SEO meta tags, Open Graph, favicon"
```

---

## Task 16: Finalne testy i responsywność

**Files:** — brak nowych, modyfikacje istniejących jeśli potrzebne

**Step 1: Przetestuj wszystkie breakpointy**

Sprawdź w devtools:
- **Mobile** (375px): hamburger menu, single column, czytelność
- **Tablet** (768px): 2 kolumny grid
- **Desktop** (1280px): pełny layout

**Step 2: Przetestuj Keystatic workflow**

1. Wejdź na `/keystatic`
2. Dodaj nową realizację ze zdjęciem
3. Edytuj cennik
4. Sprawdź czy zmiany widoczne po refreshu

**Step 3: Uruchom build**

```bash
npm run build
```

Expected: brak błędów, pliki w `dist/`.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: final responsive and CMS workflow verification"
```

---

## Task 17: Deploy na Vercel

**Step 1: Utwórz konto Vercel (jeśli nie ma) i połącz z GitHub repo**

**Step 2: Skonfiguruj Keystatic na GitHub mode**

W `keystatic.config.ts` zmień storage na:

```typescript
storage: {
  kind: 'github',
  repo: 'user/repo-name',
},
```

**Step 3: Deploy**

```bash
npm install -g vercel
vercel
```

Lub połącz repo na vercel.com.

**Step 4: Zweryfikuj** — strona dostępna publicznie, `/keystatic` działa z GitHub auth.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: configure Vercel deployment and GitHub storage"
```

---

## Podsumowanie tasków

| # | Task | Szacowany rozmiar |
|---|------|-------------------|
| 1 | Scaffold projektu | mały |
| 2 | Tailwind design tokens | mały |
| 3 | Keystatic config + dane | średni |
| 4 | Layout, Header, Footer | średni |
| 5 | Hero | mały |
| 6 | Usługi | mały |
| 7 | Realizacje + filtry | średni |
| 8 | Cennik | mały |
| 9 | O firmie | mały |
| 10 | Kontakt + formularz | średni |
| 11 | Podstrona realizacji | mały |
| 12 | Podłączenie Keystatic reader | średni |
| 13 | API route formularza | mały |
| 14 | Animacje scroll | mały |
| 15 | SEO + meta | mały |
| 16 | Testy responsywności | mały |
| 17 | Deploy Vercel | mały |
