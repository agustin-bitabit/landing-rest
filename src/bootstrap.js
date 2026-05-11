import { createApp } from "./app.js";
import { ContentfulTestimonialRepository } from "./models/testimonial.repository.js";
import { TestimonialService } from "./services/testimonial.service.js";

export function bootstrap() {
  const testimonialRepository = new ContentfulTestimonialRepository();
  const testimonialService = new TestimonialService(testimonialRepository);
  const app = createApp(testimonialService);
  return { app };
}
