export type ContactProps = {
  id: string;
  email: string;
  message: string;
  createdAt: Date;
};

export class Contact {
  readonly id: string;
  readonly email: string;
  readonly message: string;
  readonly createdAt: Date;

  private constructor(props: ContactProps) {
    this.id = props.id;
    this.email = props.email;
    this.message = props.message;
    this.createdAt = props.createdAt;
  }

  static create(input: { email: string; message: string }): Contact {
    const email = input.email.trim();
    const message = input.message.trim();
    if (!email) {
      throw new Error("email es obligatorio");
    }
    if (!message) {
      throw new Error("message es obligatorio");
    }
    return new Contact({
      id: crypto.randomUUID(),
      email,
      message,
      createdAt: new Date(),
    });
  }
}
