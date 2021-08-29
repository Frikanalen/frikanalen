interface Config {
  api: string;
}

const configs: Record<string, Config> = {
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

const env = process.env.NEXT_PUBLIC_ENV || "development";

const environments = Object.keys(configs);
if (!environments.includes(env)) {
  throw new Error(`Environment "${env}" is not valid. Options are: ${JSON.stringify(environments)}`);
}

export default configs[env];
