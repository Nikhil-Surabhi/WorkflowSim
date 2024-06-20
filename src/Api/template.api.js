const { default: apiExecute } = require(".")

export const addUpdateChart = async (params) => {
    return apiExecute('add-update-chart', 'post', {
        data: params,
        auth: true
    })
}

export const getCharts = async () => {
    return apiExecute('get-charts', 'get', { auth: true })
}

export const getChartInfo = async (id, pageNum = 1) => {
    return apiExecute(`get-chart-details/${id}/${pageNum}`, 'get', { auth: true })
}

export const addUpdateChartAccess = async (data) => {
    return apiExecute('add-update-chart-access', 'post', { data, auth: true })
}

export const getChartAccess = async (chartId) => {
    return apiExecute(`get-access-details/${chartId}`, 'get', { auth: true });
}


export const addUpdateTemplets = async (data) => {
    return apiExecute('add-update-template', 'post', { data, auth: true })
}

export const getTemplets = async () => {
    return apiExecute('get-templates?product=FC', 'get', { auth: true })
}
