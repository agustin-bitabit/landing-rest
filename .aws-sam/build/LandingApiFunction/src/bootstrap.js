import { createApp } from "./app.js";
import { ContentfulTestimonialRepository } from "./models/testimonial.repository.js";
import { TestimonialService } from "./services/testimonial.service.js";
import { UserRepository } from "./models/user.repository.js";
import { UserService } from "./services/user.service.js";
import { LoginService } from "./services/login.service.js";

export function bootstrap() {
  const testimonialRepository = new ContentfulTestimonialRepository();
  const testimonialService = new TestimonialService(testimonialRepository);

  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const loginService = new LoginService(userRepository);

  const app = createApp(testimonialService, userService, loginService);
  return { app };
}
