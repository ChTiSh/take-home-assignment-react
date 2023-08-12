import { ContextFunction } from 'apollo-server-core'
import { ApolloError, ApolloServer, ExpressContext } from 'apollo-server-express'
import { Request } from 'express'
import { Session, SessionExpiredError, UnauthenticatedError } from '../../domains'
import { ProductsStore, SessionsStore, UsersStore } from '../../stores'
import * as usecases from '../../usecases'
import makeSchema from './schema'

interface Stores {
    sessions: SessionsStore
    users: UsersStore
    products: ProductsStore
}

interface Options {
    stores: Stores
}

const NewGraphQLServer = async ({ stores }: Options) => {
    const server = new ApolloServer({
        schema: makeSchema(),
        context: createContext({ stores }),
        introspection: true,
    })

    await server.start()

    return server
}

async function prepareSessionContext(req: Request, stores: Stores) {
    const authorization = req.headers.authorization
    const match = authorization && authorization.match(/Bearer (.*)/)
    if (match) {
        try {
            return await usecases.auth.AuthenticateSession(stores)(match[1])
        } catch (err) {
            if (err instanceof SessionExpiredError || err instanceof UnauthenticatedError) {
                throw new ApolloError(err.message, err.code)
            }
            throw err
        }
    }
}

interface AppContext {
    stores: Stores
    session?: Session
}

interface CreateContextInput {
    stores: Stores
}

const createContext = ({ stores }: CreateContextInput): ContextFunction<ExpressContext> => {
    return async ({ req }: { req: any }): Promise<AppContext> => {
        const context: AppContext = {
            stores,
        }

        if (req) {
            const session = await prepareSessionContext(req, stores)
            context.session = session
        }

        return context
    }
}

export default NewGraphQLServer;