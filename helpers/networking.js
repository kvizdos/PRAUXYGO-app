export const DEFAULTNETWORKINGURL = "https://api.go.prauxy.app"
export const CREATENETWORKURL = (app) => `https://${app}.go.prauxy.app`;

export const makeRequest = async (url, params = { method: "GET", headers: { Accept: "application/json", 'Content-Type': "application/json" } }, preURL = DEFAULTNETWORKINGURL) => {
    return new Promise((resolve, reject) => {
        fetch(`${preURL}${url.indexOf("http") == -1 ? url : ""}`, params).then(r => r.json()).then(r => {
            resolve(r);    
        }).catch(e => reject(e));
    })
}