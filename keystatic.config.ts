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
      schema: {
        heading: fields.text({ label: 'Nagłówek' }),
        content: fields.text({ label: 'Treść', multiline: true }),
        image: fields.image({
          label: 'Zdjęcie',
          directory: 'public/images/about',
          publicPath: '/images/about/',
        }),
      },
    }),

    contactInfo: singleton({
      label: 'Dane kontaktowe',
      path: 'src/content/singletons/contact',
      schema: {
        phone: fields.text({ label: 'Telefon' }),
        email: fields.text({ label: 'Email' }),
        address: fields.text({ label: 'Adres' }),
        googleMapsUrl: fields.text({ label: 'Google Maps URL' }),
        facebookUrl: fields.text({ label: 'Facebook URL' }),
        instagramUrl: fields.text({ label: 'Instagram URL' }),
      },
    }),

    siteSettings: singleton({
      label: 'Ustawienia strony',
      path: 'src/content/singletons/settings',
      schema: {
        companyName: fields.text({ label: 'Nazwa firmy' }),
        seoDescription: fields.text({ label: 'Opis SEO', multiline: true }),
        logo: fields.image({
          label: 'Logo',
          directory: 'public/images',
          publicPath: '/images/',
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
