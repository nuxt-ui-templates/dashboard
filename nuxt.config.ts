// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt'],

  $development: {
    runtimeConfig: {
      public: {
        // Local compatibility while existing developer environments migrate
        // from NUXT_PUBLIC_SUPABASE_KEY to the publishable-key convention.
        supabasePublishableKey: process.env.NUXT_PUBLIC_SUPABASE_KEY || ''
      }
    }
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    siigo: {
      apiUrl: 'https://api.siigo.mx',
      username: '',
      accessKey: '',
      applicationId: 'CarolinaPinturas'
    },
    public: {
      siteUrl: 'http://localhost:3000',
      supabaseUrl: '',
      supabasePublishableKey: ''
    }
  },

  routeRules: {
    '/api/**': {
      cors: false,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'same-origin'
      }
    }
  },

  compatibilityDate: '2026-06-30',

  vite: {
    optimizeDeps: {
      include: ['zod']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
