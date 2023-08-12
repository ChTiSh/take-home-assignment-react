export default () => ({
    port: parseInt(process.env.PORT || '') || 8080,
    postgres: {
       //dsn: process.env.POSTGRES_DSN,
       dsn: required('POSTGRES_DSN'),
    },
    env: {
        value: process.env.NODE_ENV,
        isProduction: process.env.NODE_ENV === 'production',
    },
})

function required(env: string): string {
    const val = process.env[env]
    if (val === null || val === undefined) {
        throw Error(`Missing required environment variable. '${env}'`)
    }
    return val
}
