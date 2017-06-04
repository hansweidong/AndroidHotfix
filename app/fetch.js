var FetchData = {}

FetchData.getCurrentVersion = () => {
    return new Promise((resolve,reject)=>{
        fetch('/andfix/present').then((response)=>{
                resolve(response.json());
            }).catch((err)=>{
                reject(err);
        })
    })
}

FetchData.fileNameSplit = (filename) => {
    let [arr1,arr2,code] = [filename.lastIndexOf("."),filename.length,filename.split('_')]
    return {
        suffix      : filename.substring( arr1+1, arr2),
        versionName : parseInt(code[1]),
        versionCode : parseInt(code[2].split('.')[0])
    }
}


export default FetchData

