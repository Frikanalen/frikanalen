export const VALID_CONFIGS = ["development", "staging", "devcluster", "production"] as const;

export type Config = {
  api: string;
};

export type ConfigType = typeof VALID_CONFIGS[number];

export const configs: Record<ConfigType, Config> = {
  development: {
    api: "http://localhost:8080/api/",
  },
  staging: {
    api: "https://frikanalen.no/api/",
  },
  devcluster: {
    api: "http://fk.dev.local/api/",
  },
  production: {
    api: "https://frikanalen.no/api/",
  },
};

const env = (process.env.NEXT_PUBLIC_ENV || "development") as ConfigType;

if (!VALID_CONFIGS.includes(env)) {
  throw new Error(`Environment "${env}" is not valid. Options are: ${JSON.stringify(VALID_CONFIGS)}`);
}

export default configs[env];
