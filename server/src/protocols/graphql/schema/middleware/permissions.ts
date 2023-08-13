import { ForbiddenError } from 'apollo-server-express'
import { rule, shield } from 'graphql-shield'

const isAuthenticated = rule({ cache: 'contextual' })(async (parent, args, context) => {
    return !!context.session;
})

const permissions = shield(
    {
        Query: {
            user: isAuthenticated,
            products: isAuthenticated,
        },
        Mutation: {},
    },
    {
        fallbackError: new ForbiddenError('You do not have permission to perform this action.'),
        allowExternalErrors: true,
    }
)
export default permissions