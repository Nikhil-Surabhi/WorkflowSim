import axios from "axios";
import { data } from "jquery";

const apiBaseUrl = '/api/';

const apiExecute = async (url, method = 'GET', params = null) => {
    const getToken = async (url, method = 'GET', params = null) => {
        // console.log('sdfjsdfjdsk');
        // var data = await getTokenApi(id);
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

        if (params && params.auth) {
            let token = localStorage.getItem('token');
            if (!token || token === 'null') {
                token = sessionStorage.getItem('token');
            }
            headers["x-access-token"] = token;
        }

        if (params && params.files) {
            headers["Content-Type"] = "multipart/form-data";
        }

        return axios({
            url: `${apiBaseUrl}${url}`,
            method,
            data: params && params.data ? params.data : null,
            headers
        })
            .then(res => {
                if (res.data.accessToken && typeof res.data.accessToken !== 'undefined') {
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');

                    let token = localStorage.getItem('token');
                    if (!token || token === 'null') {
                        sessionStorage.setItem('token', res.data.accessToken);
                    } else {
                        localStorage.setItem('token', res.data.accessToken);

                    }

                    window.location.reload();
                }
                return { success: 1, data: res.data };
            })
            .catch(err => {
                console.log('err', err.response);


            })
    }
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    if (params && params.auth) {
        let token = localStorage.getItem('token');
        if (!token || token === 'null') {
            token = sessionStorage.getItem('token');
        }
        headers["x-access-token"] = token;
    }


    if (params && params.files) {
        headers["Content-Type"] = "multipart/form-data";
    }


    return axios({
        url: `${apiBaseUrl}${url}`,
        method,
        data: params && params.data ? params.data : null,
        headers
    })
        .then(res => {
            return { success: 1, data: res.data };
        })
        .catch(err => {
            if (err.response.status == 401) {
                let token = localStorage.getItem('token');
                let user = localStorage.getItem('user');
                user = JSON.parse(user);
                if (!token || token === 'null') {
                    token = sessionStorage.getItem('token');
                }
                if (token === 'null') {
                    return { success: 0, data: err.response.data };
                } else {
                    getToken(`gettoken?user_id=${user.id}`);
                }
            } else {
                return { success: 0, data: err.response.data };
            }
        })
}


export default apiExecute;
