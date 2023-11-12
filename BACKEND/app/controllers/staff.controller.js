const ApiError = require("../api-error");
const StaffService = require("../services/staff.service");
const MongoDB = require("../utils/mongodb.util");

// Tao va luu vao csdl thong tin nhan vien moi
exports.create = async(req, res, next) => {
    if (!req.body?.name || !req.body?.phone || !req.body?.password){
        return next(new ApiError(400, "Name, phone and password cannot be empty!"));
    }

    try {
        const staffService = new StaffService(MongoDB.client);

        let documents = await staffService.find({
            "phone": req.body.phone
        });

        if (documents.length != 0) {
            return next(
                new ApiError(400, "This phone number is already been registered!")
            );
        }

        const document = await staffService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the staff info")
        );
    }
};

// Tim kiem toan bo thong tin nhan vien hien co
exports.findAll = async(req, res, next) => {
    let documents = [];

    try {
        const staffService = new StaffService(MongoDB.client);
        const { name } = req.query;

        if (name) {
            documents = await staffService.findByName(name);
        } else {
            documents = await staffService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the staff info")
        );
    } 

    return res.send(documents);
}

// Tim kiem thong tin nhan vien voi id xac dinh
exports.findOne = async(req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Staff not found!"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving staff with id=${req.params.id}`)
        );
    }
}

// Cap nhat thong tin nhan vien voi id xac dinh
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(
            new ApiError(400, "Data to update cannot be empty")
        );
    }

    if (req.body?.password && !req.body?.current_password){
        return next(
            new ApiError(400, "Current password need to change password")
        );
    }

    try {
        const staffService = new StaffService(MongoDB.client);
        
        if (req.body.password){
            const document1 = await staffService.findById(req.params.id);
            if (!document1) {
                return next(
                    new ApiError(404, "Staff not found!")
                );
            }

            const result = await staffService.comparePassword(req.body.current_password, document1.password);

            if (!result){
                return next(
                    new ApiError(400, "Current password is wrong!")
                );
            }
        }
        
        const document = await staffService.update(req.params.id, req.body);
        if (!document) {
            return next(
                new ApiError(404, "Staff not found!")
            );
        }
        return res.send({
            message: "Staff was updated successfully"
        });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating staff with id=${req.params.id}`)
        );
    }
}

//Xoa thong tin nhan vien voi id xac dinh
exports.delete = async (req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.delete(req.params.id);

        if (!document){
            return next(
                new ApiError(404, "Staff not found!")
            );
        }

        return res.send({
            message: "Staff was deleted successfully"
        });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete staff with id=${req.params.id}`)
        );
    }
};

// Xoa toan bo thong tin nhan vien hien co
exports.deleteAll = async(req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const deletedCount = await staffService.deleteAll();

        return res.send({
            message: `${deletedCount} Staffs were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all staffs")
        );
    }
};

exports.validateLogin = async(req, res, next) => {
    if (!req.body?.phone || !req.body?.password){
        return next(
            new ApiError(400, "Phone and password cannot be empty!")
        );
    }

    try {
        const staffService = new StaffService(MongoDB.client);
        let document = await staffService.find({
            phone: req.body.phone
        });

        if (!document[0]){
            return next(
                new ApiError(404, "Staff with this phone not found!")
            );
        }

        const result = await staffService.comparePassword(req.body.password, document[0].password);

        if (!result){
            return next(
                new ApiError(401, "Phone or password is wrong!")
            );
        }

        return res.send({
            message: `Staff with id=${document[0]._id} is validated!`
        });
    } catch (error) {
        return next(
            new ApiError(400, "An error occurred while validating staff!")
        );
    }
}