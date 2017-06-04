/**
 * Created by Huangliang on 2017/5/16.
 */
let dbModels = {};

dbModels.user = {
    userName    : { type : String , default : '' },
    password    : { type : String , default : '' }
}

dbModels.md5  = {
    type    : { type : String , default : '' },
    md5     : { type : String , default : '' },

}

dbModels.version = {
    name            : { type : String , default : '' },
    versionName     : { type : String , default : '' },
    versionCode     : { type : String , default : '' },
    size            : { type : String , default : '' },
    url             : { type : String , default : '' },
    md5             : { type : String , default : '' },
    lastModified    : { type : String , default : '' }
}

module.exports = dbModels;


