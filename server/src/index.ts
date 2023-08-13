import Express from 'express'
import { Server } from 'http'
import Knex from 'knex'
import Config from './config'
import  NewGraphQLServer from './protocols/graphql'
import { NewRestServer } from './protocols/rest'
import { ProductsStore, SessionsStore, UsersStore } from './stores'
import pg from 'pg'
import cors from 'cors'

const config = Config()
const knex = Knex({
    client: 'pg',
    connection: config.postgres.dsn,
})

// Override the default behaviour when parsing doubles from postgres
// Do not do this in a production app unless you know all doubles can be handled by js
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
    return parseFloat(value)
})

const stores = {
    users: new UsersStore(knex),
    sessions: new SessionsStore(knex),
    products: new ProductsStore(knex),
}

const app = Express()
app.use(cors());

app.disable('x-powered-by')

async function main() {
    console.info('Server starting...')
    const graphQLServer = await NewGraphQLServer({ stores })
    graphQLServer.applyMiddleware({ path: '/graphql', app })

    const restServer = NewRestServer({ stores })
    app.use('/api', restServer)

    const server = app.listen(config.port, () => {
        console.info(`server listing on ${config.port}`)
    })

    process.on('SIGTERM', async function () {
        console.info('shutting down...')
        await terminateServer(server)
        await graphQLServer.stop()
        console.info('Goodbye.')
    })
}

main()

function terminateServer(server: Server): Promise<void> {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })
    })
}
