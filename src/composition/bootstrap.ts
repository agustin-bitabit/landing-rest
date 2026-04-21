import { SubmitContactUseCase } from "../application/use-cases/submit-contact.use-case.js";
import { createApp } from "../infrastructure/adapters/http/create-app.js";
import { InMemoryContactRepository } from "../infrastructure/adapters/persistence/in-memory-contact.repository.js";

export function bootstrap() {
  const contactRepository = new InMemoryContactRepository();
  const submitContact = new SubmitContactUseCase(contactRepository);
  const app = createApp(submitContact);
  return { app };
}
