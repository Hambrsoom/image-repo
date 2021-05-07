import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { getRepository } from "typeorm";

  import { User } from "../entities/user.entity";

  @ValidatorConstraint({ async: true })
  export class IsUsernameAlreadyExistConstraint implements ValidatorConstraintInterface {
    validate(
      username: string
      ) {
        return getRepository(User).findOne({ where: { username } }).then(user => {
          if (user) {
            return false;
          }
          return true;
        });
    }
  }

  export function IsUsernameAlreadyExist(
    validationOptions: ValidationOptions = { message: "username already exists!" }
    ) {
      return function(object: Object, propertyName: string) {
        registerDecorator({
          target: object.constructor,
          propertyName: propertyName,
          options: validationOptions,
          constraints: [],
          validator: IsUsernameAlreadyExistConstraint
        });
      };
  }