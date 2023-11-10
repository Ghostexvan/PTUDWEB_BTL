exports.create = (req, res) => {
    res.send({
        message: "[customer] create handler"
    });
};

exports.findAll = (req, res) => {
    res.send({
        message: "[customer] findAll handler"
    });
};

exports.findOne = (req, res) => {
    res.send({
        message: "[customer] findOne handler"
    });
};

exports.update = (req, res) => {
    res.send({
        message: "[customer] delete handler"
    });
};

exports.deleteAll = (req, res) => {
    res.send({
        message: "[customer] deleteAll handler"
    });
};