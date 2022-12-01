const {ObjectId} = require("mongodb");

class ProductsService {
    constructor(client) {
        this.Products = client.db().collection("products");
    }

    extractProductData(payload) {
        const product = {
            name: payload.name,        
            image: payload.image,
            favorite: payload.favorite,
            price: payload.price,
            description: payload.description,
        };

        Object.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]
        );

        return product;
    }

    async create(payload) {
        const product = this.extractProductData(payload);
        const result = await this.Products.findOneAndUpdate(
            product,
            { $set: product },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async findById(id){
        return await this.Products.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }


    async find(filter){
        const cursor = await this.Products.find(filter);
        return await cursor.toArray();
    }
        
    async findByName(name){
        return await this.find({
            name: {$regex: new RegExp(name), $options: "i"},
        });
    }

   
    async sortByPrice(){
        // const sort = await this.find({});
        const sort = await this.Products.find({}).sort({"price":1})
        return await sort.toArray();
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractProductData(payload);
        const result = await this.Products.findOneAndUpdate(
            filter,
            {$set: update},
            {returnDocument: "after"}
        );
        return result.value;
    }
        
    async delete(id){
        const result = await this.Products.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async findFavorite () {
        return await this.find({favorite: true})
    }

    async deleteAll() {
        const result = await this.Products.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = ProductsService;