declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_API_BASE_URL: string
      NODE_ENV: 'development' | 'production'
    }
  }
}

export {} 