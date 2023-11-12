const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');

class StaffService {
    constructor(client) {
        this.Staff = client.db().collection("staffs");
    }

    // Cac phuong thuc truy xuat du lieu su dung MongoDB API
    // Trich xuat thong tin nhan vien
    extractStaffData(payload) {
        const staff = {
            name: payload.name,
            password: payload.password,
            position: payload.position,
            address: payload.address,
            phone: payload.phone,
        };

        // Loai bo nhung truong trong
        Object.keys(staff).forEach(
            (key) => staff[key] === undefined && delete staff[key]
        );

        return staff;
    }

    // Hash mat khau
    async hashPassword(plaintextPassword) {
        const hash = await bcrypt.hash(plaintextPassword, 10);
        return hash;
    }

    // Tao va luu thong tin nhan vien vao csdl
    async create(payload){
        const staff = this.extractStaffData(payload);
        
        if (staff.position == undefined)
            staff.position = "staff";
        
        const result = await this.Staff.findOneAndUpdate(
            staff,
            {
                $set: {
                    password: await this.hashPassword(staff.password)
                }
            },
            {
                returnDocument: "after",
                upsert: true
            }
        );

        return result;
    }

    // Tim kiem thong tin nhan vien dua theo dieu kien loc
    async find(filter) {
        const cursor = await this.Staff.find(filter);
        return await cursor.toArray();
    }

    // Tim kiem thong tin nhan vien theo ten
    async findByName(name) {
        return await this.find({
            name: {
                $regex: new RegExp(name),
                $options: "i"
            },
        });
    }

    // Tim kiem thong tin nhan vien dua tren id
    async findById(id) {
        return await this.Staff.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // Tim kiem thong tin nhan vien dua tren so dien thoai
    async findByPhone(phone){
        return await this.find({
            "phone": phone
        });
    }

    // Kiem tra mat khau nhan vien
    async comparePassword(plaintextPassword, hash) {
        const result = await bcrypt.compare(plaintextPassword, hash);
        return result;
    }

    // Cap nhat thong tin nhan vien dua tren id
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = this.extractStaffData(payload);

        if (update.password != undefined)
            update.password = await this.hashPassword(update.password);

        const result = await this.Staff.findOneAndUpdate(
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

    // Xoa thong tin nhan vien dua tren id
    async delete(id) {
        const result = await this.Staff.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });

        return result;
    }

    // Xoa toan bo nhan vien trong csdl
    async deleteAll() {
        const result = await this.Staff.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = StaffService;