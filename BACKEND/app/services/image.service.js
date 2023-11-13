const { ObjectId } = require("mongodb");

class ImageService{
    constructor(client) {
        this.Image = client.db().collection("images");
    }

    // Cac phuong thuc truy xuat du lieu su dung MongoDB API
    // Trich xuat thong tin anh
    extractImageData(payload) {
        const image = {
            imageUrl: payload.imageUrl,
        };

        // Loai bo nhung truong trong
        Object.keys(image).forEach(
            (key) => image[key] === undefined && delete image[key]
        );

        return image;
    }

    // Tao va luu thong tin anh vao csdl
    async create(payload){
        const image = this.extractImageData(payload);

        const result = await this.Image.findOneAndUpdate(
            image,
            {
                $set: {
                    // image
                }
            },
            {
                returnDocument: "after",
                upsert: true
            }
        );

        return result;
    }

    // Tim kiem thong itn anh dua theo dieu kien loc
    async find(filter) {
        const cursor = await this.Image.find(filter);
        return await cursor.toArray();
    }

    // Tim kiem thong tin anh dua tren id
    async findById(id) {
        return await this.Image.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // Xoa thong tin anh dua tren id
    async delete(id) {
        const result = await this.Image.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });

        return result;
    }

    // Xoa toan bo anh trong csdl
    async deleteAll() {
        const result = await this.Image.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = ImageService;