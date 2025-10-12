export interface AppConfig {
    port: number
    host: string
    environment: 'development' | 'staging' | 'production'
    isDevelopment: boolean
    logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
    apiBaseUrl: string
    allowedOrigins: string[] | boolean

    auth: {
        jwtSecret: string
        jwtExpiresIn: string
        apiKeySecret: string
        refreshTokenExpiresIn: string
        passwordSaltRounds: number
    }

    rateLimit: {
        max: number
        timeWindow: string
    }

    firebase: {
        projectId: string
        privateKey?: string
        clientEmail?: string
    }

    database: {
        connectionString?: string // For future database migrations
    }
}

export function createConfig(): AppConfig {
    const environment = (process.env.NODE_ENV ||
        'development') as AppConfig['environment']
    const isDevelopment = environment === 'development'

    return {
        port: parseInt(process.env.PORT || '3000', 10),
        host: process.env.HOST || '0.0.0.0',
        environment,
        isDevelopment,
        logLevel:
            (process.env.LOG_LEVEL as AppConfig['logLevel']) ||
            (isDevelopment ? 'debug' : 'info'),
        apiBaseUrl:
            process.env.API_BASE_URL ||
            `http://localhost:${process.env.PORT || 3000}`,
        allowedOrigins: isDevelopment
            ? true
            : process.env.ALLOWED_ORIGINS?.split(',') || [
                  'https://openfeedback.io',
              ],

        auth: {
            jwtSecret:
                process.env.JWT_SECRET ||
                'your-super-secret-jwt-key-change-in-production',
            jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
            apiKeySecret:
                process.env.API_KEY_SECRET ||
                'your-super-secret-api-key-change-in-production',
            refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
            passwordSaltRounds: parseInt(
                process.env.PASSWORD_SALT_ROUNDS || '12',
                10
            ),
        },

        rateLimit: {
            max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
            timeWindow: process.env.RATE_LIMIT_WINDOW || '1 minute',
        },

        firebase: {
            projectId:
                process.env.FIREBASE_PROJECT_ID ||
                process.env.GCLOUD_PROJECT ||
                '',
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        },

        database: {
            connectionString: process.env.DATABASE_URL,
        },
    }
}
