import { ForbiddenError, NotFoundError, SessionExpiredError, UnauthenticatedError } from '../domains'
import { SessionsStore, UsersStore } from '../stores'
import { generateToken } from './util'

const DAY = 1000 * 60 * 60 * 24

interface AuthenticateSessionStores {
    sessions: SessionsStore
}

export const AuthenticateSession = ({ sessions }: AuthenticateSessionStores) => {
    return async (accessToken: string) => {
        const session = await sessions.findByAccessToken(accessToken)
        console.log(session);
        if (!session) {
            throw new UnauthenticatedError()
        }

        if (session.expiresAt < new Date()) {
            throw new SessionExpiredError()
        }

        return session
    }
}

interface RefreshSessionStores {
    sessions: SessionsStore
}

export const RefreshSession = ({ sessions }: RefreshSessionStores) => {
    return async (accessToken: string, refreshToken: string) => {
        const session = await sessions.findByAccessToken(accessToken)
        if (!session) {
            throw new NotFoundError('session not found')
        }

        if (session.refreshToken !== refreshToken) {
            throw new ForbiddenError('refresh token does not match')
        }

        // Expire the current session
        await sessions.update(session.id, { expiresAt: new Date() })

        // Generate a new session
        const nextAccessToken = generateToken()
        const nextRefreshToken = generateToken()
        const expiresAt = new Date(Date.now() + DAY)

        return await sessions.create({
            accessToken: nextAccessToken,
            refreshToken: nextRefreshToken,
            expiresAt,
            userID: session.userID,
        })
    }
}

interface AuthenticateUserStores {
    sessions: SessionsStore
    users: UsersStore
}

export const AuthenticateUser = ({ sessions, users }: AuthenticateUserStores) => {
    return async (email: string, password: string) => {
        const user = await users.findByEmail(email)
        if (!user) {
            throw new NotFoundError('email not found')
        }

        if (user.password !== password) {
            // descriptions to help debug never do this in production app as you leak information about which users exist
            // within your system. Same with the error above.
            throw new UnauthenticatedError('Invalid password')
        }

        // Email and password has matched a user create a session
        const accessToken = generateToken()
        const refreshToken = generateToken()
        const expiresAt = new Date(Date.now() + DAY)

        return await sessions.create({ accessToken, refreshToken, expiresAt, userID: user.id })
    }
}
