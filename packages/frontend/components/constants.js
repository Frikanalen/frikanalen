console.log(process.env.API_BASE_URL)
console.log(process.env.GRAPHQL_URL)
export const API_BASE_URL = process.env.API_BASE_URL || 'https://forrige.frikanalen.no/api/'
export const GRAPHQL_URL = process.env.GRAPHQL_URL || 'https://forrige.frikanalen.no/graphql'
