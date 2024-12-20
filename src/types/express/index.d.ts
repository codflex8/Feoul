import { User } from "../../entities/User.model";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
