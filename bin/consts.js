// set up as a ternary so optimizer will optimize out the code that is never run
const uriServer = process.env.NODE_ENV !== 'production' ? (
    "http://localhost:5000"
) : (
    `https://${myDomain}.herokuapp.com` // heroku endpoint
)

module.exports.uriServer = uriServer