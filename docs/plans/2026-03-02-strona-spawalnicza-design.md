# Design: Strona wizytówka — firma spawalnicza

## Kontekst

Strona wizytówka dla firmy spawalniczej specjalizującej się w meblach loftowych i ogólnych usługach spawalniczych. Właściciel potrzebuje prostego CMS do zarządzania treściami (zdjęcia realizacji, cennik, usługi). Nazwa firmy i materiały (logo, zdjęcia) do ustalenia — start z placeholderami.

## Tech stack

| Warstwa | Technologia | Uzasadnienie |
|---------|-------------|--------------|
| Framework | **Astro** | Statyczny site, najszybszy czas ładowania |
| CMS | **Keystatic** | Git-based, darmowy, przyjazny panel UI |
| Stylowanie | **Tailwind CSS** | Szybki development, utility-first |
| Zdjęcia | **Cloudinary** (free tier 25GB) | Auto-resize, WebP, lazy loading |
| Hosting | **Vercel** (free tier) | Auto-deploy z GitHub |
| Formularz | Keystatic (zapis do repo) | Zgłoszenia jako pliki w repo |

**Koszt utrzymania: 0 zł/mies** (free tiers)

## Struktura stron

```
/ (strona główna - one-pager z anchor navigation)
├── #hero          — pełnoekranowy baner z CTA
├── #uslugi        — karty usług
├── #realizacje    — siatka zdjęć z filtrami
├── #cennik        — tabela orientacyjnych cen
├── #o-firmie      — opis firmy + zdjęcie
├── #kontakt       — formularz + mapa + dane kontaktowe
│
/realizacja/[slug]  — podstrona realizacji (galeria + opis)
/keystatic          — panel CMS
```

Nawigacja: sticky header, hamburger menu na mobile, smooth scroll.

## Wygląd i klimat

### Kolorystyka — industrialny loft

| Rola | Kolor | Użycie |
|------|-------|--------|
| Primary | `#F97316` (pomarańczowy/ogień) | CTA, akcenty, hover |
| Dark | `#1C1917` (ciemny grafit) | Tło ciemnych sekcji, nagłówki |
| Light | `#F5F5F4` (jasny beton) | Tło jasnych sekcji |
| Metal | `#78716C` (stal) | Teksty pomocnicze, bordy |
| White | `#FAFAF9` | Tekst na ciemnym tle |

### Typografia

- Nagłówki: **Inter** (bold, uppercase, letter-spacing)
- Body: **Inter** (regular)

### Styl

- Ciemne i jasne sekcje naprzemiennie
- Duże zdjęcia realizacji
- Subtelne animacje fade-in przy scrollu
- Ikony line/outline
- Karty z cieniem i border w kolorze metalu

## Sekcje — szczegóły

### Hero

- Pełnoekranowe tło (zdjęcie spawania z iskrami, placeholder na start)
- Ciemny overlay ~60%
- Duży nagłówek: nazwa firmy
- Podtytuł: "Meble loftowe & usługi spawalnicze"
- Dwa CTA: "Zobacz realizacje" + "Skontaktuj się"

### Usługi

- Grid 3-4 kart (1 kolumna mobile → 3-4 desktop)
- Karta: ikona + tytuł + krótki opis
- Kategorie: meble loftowe, spawanie konstrukcji, balustrady i ogrodzenia, naprawy
- Edytowalne z CMS

### Realizacje

- Grid zdjęć (3 kolumny desktop)
- Filtry: Wszystkie | Meble | Konstrukcje | Balustrady
- Klik → podstrona `/realizacja/[slug]` z galerią + opisem
- Cloudinary: auto-resize, lazy loading, WebP

### Cennik

- Tabela/karty: usługa, zakres cen, jednostka, uwagi
- Disclaimer: "Ceny orientacyjne, wycena indywidualna po kontakcie"
- Edytowalny z CMS

### O firmie

- Layout: tekst (lewo) + zdjęcie (prawo)
- Krótki opis: doświadczenie, podejście
- Edytowalny z CMS

### Kontakt

- Dwie kolumny: formularz (lewo), dane kontaktowe (prawo)
- Formularz: imię, email, telefon, treść, przycisk wyślij
- Zgłoszenia → Keystatic (pliki w repo)
- Dane: telefon (klikalny), email, adres
- Google Maps embed
- Ikony social media

### Footer

- Logo + krótki opis
- Szybkie linki do sekcji
- Dane kontaktowe
- Copyright

## Model danych CMS (Keystatic)

### Kolekcje

**realizacje/**
- tytuł (text)
- slug (auto)
- kategoria (select: meble / konstrukcje / balustrady / inne)
- opis (rich text)
- zdjęcie główne (image → Cloudinary)
- galeria (lista obrazków)
- data realizacji (date)
- wyróżniona (boolean)

**usługi/**
- tytuł (text)
- ikona (select z listy)
- opis krótki (text)
- opis pełny (rich text, opcjonalny)
- kolejność (number)

**cennik/**
- usługa (text)
- cena od (number)
- cena do (number, opcjonalne)
- jednostka (select: szt / mb / m² / usługa)
- uwagi (text)
- kolejność (number)

**zgłoszenia kontaktowe/**
- imię (text)
- email (text)
- telefon (text)
- treść (text)
- data (datetime, auto)

### Singletony

**strona główna/** — hero tytuł, podtytuł, zdjęcie tła, CTA teksty

**o firmie/** — nagłówek, treść (rich text), zdjęcie

**dane kontaktowe/** — telefon, email, adres, Google Maps URL, Facebook URL, Instagram URL

**ustawienia strony/** — nazwa firmy, opis SEO, logo

### Workflow CMS

1. Wejście na `strona.pl/keystatic`
2. Login przez GitHub
3. Panel: Realizacje, Usługi, Cennik, Ustawienia
4. Edycja → zapis → auto-deploy na Vercel (~30s)
