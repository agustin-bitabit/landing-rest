import { UserModel } from "./schemas/user.schema.js";

export class UserRepository {
  async findAll() {
    return UserModel.find().lean();
  }

  async findById(id) {
    return UserModel.findById(id).lean();
  }

  async findByEmail(email) {
    return UserModel.findOne({ email }).lean();
  }

  async create(data) {
    const doc = await UserModel.create(data);
    return doc.toObject();
  }

  async update(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id).lean();
  }
}
