import { createApp } from "./routes/index.js";
import { InMemoryLeadRepository } from "./models/lead.repository.js";
import { LeadService } from "./services/lead.service.js";

export function bootstrap() {
  const leadRepository = new InMemoryLeadRepository();
  const leadService = new LeadService(leadRepository);
  const app = createApp(leadService);
  return { app };
}
