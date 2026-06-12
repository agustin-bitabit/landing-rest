function val(raw, locale) {
  if (raw == null) return undefined;
  if (typeof raw === "string" || typeof raw === "number") return raw;
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw[locale] ?? raw["en-US"] ?? Object.values(raw)[0];
  }
  return undefined;
}

function mapEntry(fields, locale, id) {
  const name = String(val(fields.name, locale) ?? "");
  const subtitle = String(val(fields.subtitle, locale) ?? "");
  const q = val(fields.quote, locale);
  const quote = q == null || q === "" ? null : String(q);
  const r = val(fields.rating, locale);
  const rating = typeof r === "number" && !Number.isNaN(r) ? r : null;

  let avatar_url = null;
  const av = fields.avatar;
  if (av?.sys?.type === "Asset" && av.fields?.file) {
    const file = val(av.fields.file, locale);
    const u = file?.url;
    if (u) avatar_url = u.startsWith("//") ? `https:${u}` : u;
  }

  return { id, name, subtitle, quote, avatar_url, rating };
}

export class TestimonialService {
  constructor(testimonialRepository) {
    this.testimonialRepository = testimonialRepository;
    this.locale = testimonialRepository.locale;
  }

  async list() {
    const items = await this.testimonialRepository.findAll();
    return items.map((entry) =>
      mapEntry(entry.fields, this.locale, entry.sys.id),
    );
  }
}
