import { Knex } from 'knex'
import { Session } from '../domains'

const TABLE_NAME = 'sessions'

interface Row {
    id: number
    user_id: number
    access_token: string
    refresh_token: string
    expires_at: Date
}

interface CreateInput {
    userID: number
    accessToken: string
    refreshToken: string
    expiresAt: Date
}

interface UpdateInput {
    accessToken?: string
    refreshToken?: string
    expiresAt?: Date
}

class SessionsStore {
    private knex: Knex
    constructor(knex: Knex) {
        this.knex = knex
    }

    async create(session: CreateInput): Promise<Session> {
        const [row] = await this.knex<Row>(TABLE_NAME)
            .insert({
                user_id: session.userID,
                access_token: session.accessToken,
                refresh_token: session.refreshToken,
                expires_at: session.expiresAt,
            })
            .returning('*')
        return row && this.toDomain(row)
    }

    async update(id: number, input: UpdateInput) {
        const [row] = await this.knex<Row>(TABLE_NAME)
            .update({
                access_token: input.accessToken,
                refresh_token: input.refreshToken,
                expires_at: input.expiresAt,
            })
            .where({ id })
            .returning('*')
        return row && this.toDomain(row)
    }

    async findByAccessToken(token: string): Promise<Session | undefined> {
        const row = await this.knex<Row>(TABLE_NAME).where({ access_token: token }).first()
        console.log(row);
        return row && this.toDomain(row)
    }

    private toDomain(row: Row): Session {
        return {
            id: row.id,
            accessToken: row.access_token,
            refreshToken: row.refresh_token,
            expiresAt: row.expires_at,
            userID: row.user_id,
        }
    }
}

export default SessionsStore
