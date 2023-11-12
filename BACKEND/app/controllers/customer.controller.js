const ApiError = require("../api-error");
const CustomerService = require("../services/customer.service");
const MongoDB = require("../utils/mongodb.util");

// Tao va luu vao csdl thong tin khach hang moi
exports.create = async(req, res, next) => {
    if (!req.body?.name || !req.body?.phone || !req.body?.password){
        return next(new ApiError(400, "Name, phone and password cannot be empty!"));
    }

    try {
        const customerService = new CustomerService(MongoDB.client);

        let documents = await customerService.find({
            "phone": req.body.phone
        });

        if (documents.length != 0) {
            return next(
                new ApiError(400, "This phone number is already been registered!")
            );
        }

        const document = await customerService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the customer info")
        );
    }
};

// Tim kiem toan bo thong tin khach hang hien co
exports.findAll = async(req, res, next) => {
    let documents = [];

    try {
        const customerService = new CustomerService(MongoDB.client);
        const { name } = req.query;

        if (name) {
            documents = await customerService.findByName(name);
        } else {
            documents = await customerService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the customer info")
        );
    } 

    return res.send(documents);
}

// Tim kiem thong tin khach hang voi id xac dinh
exports.findOne = async(req, res, next) => {
    try {
        const customerService = new CustomerService(MongoDB.client);
        const document = await customerService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Customer not found!"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving customer with id=${req.params.id}`)
        );
    }
}

// Cap nhat thong tin khach hang voi id xac dinh
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
        const customerService = new CustomerService(MongoDB.client);
        
        if (req.body.password){
            const document1 = await customerService.findById(req.params.id);
            if (!document1) {
                return next(
                    new ApiError(404, "Customer not found!")
                );
            }

            const result = await customerService.comparePassword(req.body.current_password, document1.password);

            if (!result){
                return next(
                    new ApiError(400, "Current password is wrong!")
                );
            }
        }
        
        const document = await customerService.update(req.params.id, req.body);
        if (!document) {
            return next(
                new ApiError(404, "Customer not found!")
            );
        }
        return res.send({
            message: "Customer was updated successfully"
        });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating customer with id=${req.params.id}`)
        );
    }
}

//Xoa thong tin khach hang voi id xac dinh
exports.delete = async (req, res, next) => {
    try {
        const customerService = new CustomerService(MongoDB.client);
        const document = await customerService.delete(req.params.id);

        if (!document){
            return next(
                new ApiError(404, "Customer not found!")
            );
        }

        return res.send({
            message: "Customer was deleted successfully"
        });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete customer with id=${req.params.id}`)
        );
    }
};

// Xoa toan bo thong tin khach hang hien co
exports.deleteAll = async(req, res, next) => {
    try {
        const customerService = new CustomerService(MongoDB.client);
        const deletedCount = await customerService.deleteAll();

        return res.send({
            message: `${deletedCount} customers were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all customers")
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
        const customerService = new CustomerService(MongoDB.client);
        let document = await customerService.find({
            phone: req.body.phone
        });

        if (!document[0]){
            return next(
                new ApiError(404, "Customer with this phone not found!")
            );
        }

        const result = await customerService.comparePassword(req.body.password, document[0].password);

        if (!result){
            return next(
                new ApiError(401, "Phone or password is wrong!")
            );
        }

        return res.send({
            message: `Customer with id=${document[0]._id} is validated!`
        });
    } catch (error) {
        return next(
            new ApiError(400, "An error occurred while validating customer!")
        );
    }
}