const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema ({
    headline: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      summary: string,
      saved: {
          type: Boolean,
          default: false
      },
      note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
      }

})

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;