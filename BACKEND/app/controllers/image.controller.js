const ApiError = require("../api-error");
const ImageService = require("../services/image.service");
const MongoDB = require("../utils/mongodb.util");

// Tao va luu vao csdl hinh anh moi
exports.create = async(req, res, next) => {
    if (!req.body?.imageUrl){
        return next(new ApiError(400, "Image url cannot be empty!"));
    }

    try {
        const imageService = new ImageService(MongoDB.client);

        const document = await imageService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating new image!")
        );
    }
};

// Tim kiem toan bo hinh anh hien co
exports.findAll = async(req, res, next) => {
    let documents = [];

    try {
        const imageService = new ImageService(MongoDB.client);
        documents = await imageService.find({});
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the image info")
        );
    }

    return res.send(documents);
}

// Tim kiem thong tin hinh anh voi id xac dinh
exports.findOne = async(req, res, next) => {
    try {
        const imageService = new ImageService(MongoDB.client);
        const document = await imageService.findById(req.params.id);
        if (!document) {
            return next(
                new ApiError(404, "Image not found!")
            );
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving image with id=${req.params.id}`)
        );
    }
}

// Xoa thong tin anh voi id xac dinh
exports.delete = async(req, res, next) => {
    try {
        const imageService = new ImageService(MongoDB.client);
        const document = await imageService.delete(req.params.id);

        if (!document){
            return next(
                new ApiError(404, "Image not found!")
            );
        }

        return res.send({
            message: "Image was deleted successfully"
        });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete image with id=${req.params.id}`)
        );
    }
}

// Xoa toan bo hinh anh hien co
exports.deleteAll = async(req, res, next) => {
    try {
        const imageService = new ImageService(MongoDB.client);
        const deletedCount = await imageService.deleteAll();

        return res.send({
            message: `${deletedCount} images were deleted successfully`,
        });
    } catch (error){
        return next(
            new ApiError(500, "An error occurred while removing all images")
        );
    }
}