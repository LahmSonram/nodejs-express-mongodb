const db = require("../models")
const Tutorial = db.tutorials

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!"})
        return
    }

    const tutorial = new Tutorial({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    })

    tutorial
        .save(tutorial)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: 
                err.message || "Some error occurred while creating the Tutorial."
            })
        })
}

const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const offset = page ? page * limit : 0

    return { limit, offset }
}

exports.findAll = (req, res) => {
    const { page, size, title} = req.query
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {}

    const { limit, offset } = getPagination(page, size)

    Tutorial.paginate(condition, { offset, limit})
        .then(data => {
            res.send({
                totalItem: data.totalDocs,
                tutorials: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page - 1
            })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Tutorial."
            })
        })
}

exports.findOne = (req, res) => {
    const id = req.params.id

    Tutorial.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Tutotial with id " + id})
            else res.send(data)
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Tutoriak with id=" + id})
        })
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        })
    }

    const id = req.params.id

    Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
                })
            } else res.send({ message: "Tutorial was updated successfully."})
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id

    Tutorial.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not fount!`
                })
            } else {
                res.send({
                    message: "Tutorial was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "could not delete Tutorial with id=" + id
            })
        })
}

exports.deleteAll = (req, res) => {
    Tutorial.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Tutorials were deleted successfully!`
            })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            })
        })
}

exports.findAllPublished = (req, res) => {
    const { page, size } = req.query
    const { limit, offset } = getPagination(page, size)

    Tutorial.paginate({ published: true }, { offset, limit })
        .then(data => {
            res.send({
                totalItems: data.totalDocs,
                tutorials: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page - 1,
            })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            })
        })
}

