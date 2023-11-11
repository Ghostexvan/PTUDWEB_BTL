const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');

class CustomerService {
    constructor(client) {
        this.Customer = client.db().collection("customers");
    }

    // Cac phuong thuc truy xuat du lieu su dung MongoDB API
    // Trich xuat thong tin khach hang
    extractCustomerData(payload) {
        const customer = {
            name: payload.name,
            password: payload.password,
            address: payload.address,
            phone: payload.phone,
        };

        // Loai bo nhung truong trong
        Object.keys(customer).forEach(
            (key) => customer[key] === undefined && delete customer[key]
        );

        return customer;
    }

    // Hash mat khau
    async hashPassword(plaintextPassword) {
        const hash = await bcrypt.hash(plaintextPassword, 10);
        return hash;
    }

    // Tao va luu thong tin khach hang vao csdl
    async create(payload){
        const customer = this.extractCustomerData(payload);
        const result = await this.Customer.findOneAndUpdate(
            customer,
            {
                $set: {
                    password: await this.hashPassword(customer.password)
                }
            },
            {
                returnDocument: "after",
                upsert: true
            }
        );

        return result;
    }

    // Tim kiem thong tin khach hang dua theo dieu kien loc
    async find(filter) {
        const cursor = await this.Customer.find(filter);
        return await cursor.toArray();
    }

    // Tim kiem thong tin khach hang theo ten
    async findByName(name) {
        return await this.find({
            name: {
                $regex: new RegExp(name),
                $options: "i"
            },
        });
    }

    // Tim kiem thong tin khach hang dua tren id
    async findById(id) {
        return await this.Customer.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // Kiem tra mat khau khach hang
    async comparePassword(plaintextPassword, hash) {
        const result = await bcrypt.compare(plaintextPassword, hash);
        return result;
    }

    // Cap nhat thong tin khach hang dua tren id
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = this.extractCustomerData(payload);

        if (update.password != undefined)
            update.password = await this.hashPassword(update.password);

        const result = await this.Customer.findOneAndUpdate(
            filter,
            {
                $set: update
            },
            {
                returnDocument: "after"
            }
        );
        return result;
    }

    // Xoa toan bo khach hang trong csdl
    async deleteAll() {
        const result = await this.Customer.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = CustomerService;