const { default: apiExecute } = require(".")

export const ViewShapeApi = async (query = '') => {
    return apiExecute(`shape/?${query}`)
}

// module.exports = {
//     ViewShapeApi
// }
