export class TestimonialService {
  constructor(testimonials) {
    this.testimonials = testimonials;
  }

  async list() {
    return this.testimonials.findAll();
  }
}
