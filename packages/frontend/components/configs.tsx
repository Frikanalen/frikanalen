interface Config {
  api: string;
  atem: string;
  upload: string;
}

const configs: { [key: string]: Config } = {
  development: {
    api: "http://localhost:8080/api/",
    upload: "https://frikanalen.no/api/videos/upload/",
    atem: "https://frikanalen.no/playout/atem/program",
  },
  staging: {
    api: "https://frikanalen.no/api/",
    upload: "https://frikanalen.no/api/videos/upload/",
    atem: "https://frikanalen.no/playout/atem/program",
  },
  devcluster: {
    api: "http://fk.dev.local/api/",
    upload: "http://fk.dev.local/api/videos/upload/",
    atem: "https://frikanalen.no/playout/atem/program",
  },
  production: {
    api: "https://frikanalen.no/api/",
    upload: "https://frikanalen.no/api/videos/upload/",
    atem: "https://frikanalen.no/playout/atem/program",
  },
};

// for some reason, profil.tsx considers it development
const env = process.env.NEXT_PUBLIC_ENV || "production" // ""development";

const environments = Object.keys(configs);
if (!environments.includes(env)) {
  throw new Error(`Environment "${env}" is not valid. Options are: ${JSON.stringify(environments)}`);
}

export default configs[env];
