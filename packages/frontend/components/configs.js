const env = process.env.ENV || 'development';

const configs = {
  development: {
    api: 'https://localhost:8000/api/',
    graphql: 'https://frikanalen.no/graphql',
    atem: 'https://frikanalen.no/playout/atem/program'
  },
  staging: {
    api: 'https://frikanalen.no/api/',
    graphql: 'https://frikanalen.no/graphql',
    atem: 'https://frikanalen.no/playout/atem/program'
  },
  production: {
    api: 'https://frikanalen.no/api/',
    graphql: 'https://frikanalen.no/graphql',
    atem: 'https://frikanalen.no/playout/atem/program'
  },
}[env];

export default configs;
