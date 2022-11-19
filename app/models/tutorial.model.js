// const { Schema } = require("mongoose")

// module.exports = mongoose => {
//     const tutorial = mongoose.model(
//         "tutorial", 
//         mongoose.Schema(
//             {
//                 title: String,
//                 description: String,
//                 published: Boolean
//             },
//             { timestamps: true }
//         )
//     )

//     return tutorial
// }

// If you use this app with a front-end that needs id field instead of _id, you have to override toJSON method that map default object to a custom object. So the Mongoose model could be modified as following code:

const { Schema } = require("mongoose")

module.exports = (mongoose, mongoosePaginate) => {
    const schema = mongoose.Schema(
        {
            title: String,
            description: String,
            published: Boolean
        },
        { timestamps: true }
    )

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    schema.plugin(mongoosePaginate)

    const Tutorial = mongoose.model("tutorial", schema)
    return Tutorial
}