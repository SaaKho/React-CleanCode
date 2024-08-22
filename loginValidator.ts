//This is the Chain of Command Design Pattern used to make a chanin of command
//and to ensure Single Responsibility Principle

interface LoginValidator {
  validate(email: string, password: string): boolean;
}

export class RequiredValidator implements LoginValidator {
  constructor(private next: LoginValidator | null = null) {}

  validate(email: string, password: string): boolean {
    if (email && password) {
      return true;
    }
    return false;
  }
}
