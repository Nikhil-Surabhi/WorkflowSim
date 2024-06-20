const { default: apiExecute } = require(".")

export const addUpdateFlowchart = async (data) => {
    return apiExecute(`add-update-workflow`, 'POST', {data, auth: true});
}

export const getFlowchart = async (pageId) => {
    return apiExecute(`get-workflows/${pageId}`, 'GET', {auth: true});
}

// module.exports = {
//     addUpdateFlowchart,
//     getFlowchart
// }
