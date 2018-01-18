import * as mongoose from 'mongoose';

class ChatModel {
    _model:mongoose.Model;
    constructor() {
        this._model = mongoose.connection.model('ChatGroup', this.getSchema());
    }
    insert(message, callback):void {
        let model = this._model;
        model.message = message;
        model.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                callback();
            }
        })
    }
    getSchema():mongoose.Schema {
        return mongoose.Schema({userId:String, message:String, date:{type:Date, default:Date.now}})
    }
}

var chatmodel = new ChatModel();

export {chatmodel}