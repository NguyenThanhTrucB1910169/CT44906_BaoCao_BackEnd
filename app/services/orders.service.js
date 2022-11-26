const {ObjectId} = require("mongodb");

class OrdersService {
    constructor(client) {
        this.Order = client.db().collection("orders");
    }

    extractOrderData(payload) {
        const order = {
            name: payload.name,        
            phone: payload.phone,
            address: payload.address,
            total: payload.total,
            products: payload.products,
        };

        Object.keys(order).forEach(
            (key) => order[key] === undefined && delete order[key]
        );

        return order;
    }

    async create(payload) {
        const order = this.extractOrderData(payload);
        const result = await this.Order.findOneAndUpdate(
            order,
            { $set: order },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async findById(id){
        return await this.Order.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }


    async find(filter){
        const cursor = await this.Order.find(filter);
        return await cursor.toArray();
    }
        
    async findByName(name){
        return await this.find({
            name: {$regex: new RegExp(name), $options: "i"},
        });
    }

   

    // async update(id, payload){
    //     const filter = {
    //         _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    //     };
    //     const update = this.extractConactData(payload);
    //     const result = await this.Contact.findOneAndUpdate(
    //         filter,
    //         {$set: update},
    //         {returnDocument: "after"}
    //     );
    //     return result.value;
    // }
        
    // async delete(id){
    //     const result = await this.Contact.findOneAndDelete({
    //         _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    //     });
    //     return result.value;
    // }

    // async findFavorite () {
    //     return await this.find({favorite: true})
    // }

    // async deleteAll() {
    //     const result = await this.Contact.deleteMany({});
    //     return result.deletedCount;
    // }
}


module.exports = OrdersService;