export class InactiveUserError extends Error {
  public readonly name: string;

  constructor(message: string) {
    super(message);

    this.name = 'InactiveUserError';
  }
}
