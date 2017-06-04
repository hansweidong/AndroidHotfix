/**
 * Created by Huangliang on 2017/5/16.
 */

var mongoose = require('mongoose');
var models   = require('./model.js');
var Schema   = mongoose.Schema;

/**
 * 根据已经规划好的数据库模型表定义各种数据库模型，传入必要的模型骨架Schema和模型名（类型）
 */
for( var modelName in models ){
	mongoose.model( modelName , new Schema( models[ modelName ] ));
}

/**
 * 传入模型名（类型）获取到相应的模型
 */
module.exports={
	getModel : function( modelName ){
		return _getModel( modelName );
	}
};

var _getModel=function( modelName ){
	return mongoose.model( modelName );
}

