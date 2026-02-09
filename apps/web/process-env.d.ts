declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WAIM_API_URL: string;
    }
  }
}

export {};


