const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({

    // image: { 
    //     data: Buffer, 
    //     contentType: String 
    // },
    link: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true  
    },
    teaser: {
        type: String,
        required: true
    }, 
    starred: {
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }

});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;