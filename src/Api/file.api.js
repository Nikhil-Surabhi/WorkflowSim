const { default: apiExecute } = require(".")

export const uploadMediaFile = async (file) => {
    let formData = new FormData();
    formData.append('recfile', file);
    return apiExecute(`upload-images`, 'POST', { data: formData, files: true })
}
