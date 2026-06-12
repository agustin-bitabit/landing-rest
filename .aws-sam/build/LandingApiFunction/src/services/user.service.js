import bcrypt from "bcrypt";

function withoutPassword(user) {
  if (!user) return null;
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async list() {
    const users = await this.userRepository.findAll();
    return users.map(withoutPassword);
  }

  async getById(id) {
    const user = await this.userRepository.findById(id);
    return withoutPassword(user);
  }

  async create(user) {
    const data = { ...user };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const created = await this.userRepository.create(data);
    return withoutPassword(created);
  }

  async update(id, user) {
    const data = { ...user };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const updated = await this.userRepository.update(id, data);
    return withoutPassword(updated);
  }

  async delete(id) {
    await this.userRepository.delete(id);
  }
}
