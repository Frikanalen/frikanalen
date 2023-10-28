export const VALID_CONFIGS = ["development", "staging", "devcluster", "production"] as const;

export type Config = {
  api: string;
  upload: string;
};

export type ConfigType = typeof VALID_CONFIGS[number];

export const configs: Record<ConfigType, Config> = {
  development: {
    api: "http://localhost:8000/api/",
    upload: "https://frikanalen.no/api/videos/upload/",
  },
  staging: {
    api: "https://frikanalen.no/api/",
    upload: "https://upload.frikanalen.no/files",
  },
  devcluster: {
    api: "http://fk.dev.local/api/",
    upload: "http://fk.dev.local/api/videos/upload/",
  },
  production: {
    api: "https://frikanalen.no/api/",
    // This is temporarily file01; until the rest of the system is in play
    // Usually it will be `/api/videos/upload/` at full URL
    upload: "https://upload.frikanalen.no/files",
  },
};

const env = (process.env.NEXT_PUBLIC_ENV || "development") as ConfigType;

if (!VALID_CONFIGS.includes(env)) {
  throw new Error(`Environment "${env}" is not valid. Options are: ${JSON.stringify(VALID_CONFIGS)}`);
}

export default configs[env];
