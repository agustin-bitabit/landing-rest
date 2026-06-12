import { createClient } from "contentful";

export class ContentfulTestimonialRepository {
  constructor() {
    const space = process.env.CONTENTFUL_SPACE_ID?.trim();
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN?.trim();
    if (!space || !accessToken) {
      throw new Error(
        "CONTENTFUL_SPACE_ID y CONTENTFUL_ACCESS_TOKEN son obligatorias",
      );
    }
    this.client = createClient({
      space,
      accessToken,
      environment: process.env.CONTENTFUL_ENVIRONMENT?.trim() || "master",
    });
    this.contentType =
      process.env.CONTENTFUL_TESTIMONIAL_CONTENT_TYPE?.trim() || "testimonios";
    this.locale = process.env.CONTENTFUL_LOCALE?.trim() || "en-US";
  }

  async findAll() {
    const { items } = await this.client.getEntries({
      content_type: this.contentType,
      include: 2,
      locale: this.locale,
      order: ["sys.createdAt"],
    });

    return items;
  }
}
