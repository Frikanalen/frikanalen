const env = process.env.NEXT_PUBLIC_ENV || "development";

const configs = {
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
}[env];

export default configs;
