import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function withoutPassword(user) {
  if (!user) return null;
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

export class LoginService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return {
      token: signToken(user),
      user: withoutPassword(user),
    };
  }

  async createUser(email, password) {
    const hashed = await bcrypt.hash(password, 10);
    const name = email.split("@")[0];

    const user = await this.userRepository.create({
      name,
      email,
      password: hashed,
    });

    return {
      token: signToken(user),
      user: withoutPassword(user),
    };
  }

  async verifyToken(token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await this.userRepository.findById(payload.id);
      return withoutPassword(user);
    } catch {
      return null;
    }
  }

  async logoutUser(token) {
    return this.verifyToken(token);
  }
}
