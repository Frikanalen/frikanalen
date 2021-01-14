interface Config {
  api: string;
  atem: string;
}

const configs: { [key: string]: Config } = {
  development: {
    api: "http://localhost:8080/api/",
    atem: "https://frikanalen.no/playout/atem/program",
  },
  staging: {
    api: "https://frikanalen.no/api/",
    atem: "https://frikanalen.no/playout/atem/program",
  },
  production: {
    api: "https://frikanalen.no/api/",
    atem: "https://frikanalen.no/playout/atem/program",
  },
};

const env = process.env.NEXT_PUBLIC_ENV || "development";

const environments = Object.keys(configs);
if (!environments.includes(env)) {
  throw new Error(`Environment "${env}" is not valid. Options are: ${JSON.stringify(environments)}`);
}

export default configs[env];
