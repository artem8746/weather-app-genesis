import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TransformErrorPipe implements PipeTransform {
  async transform(
    value: unknown,
    { metatype }: ArgumentMetadata,
  ): Promise<unknown> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (!value) return;

    const object = plainToInstance(metatype, value);

    const errors = await validate(object);

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException({ error: formattedErrors });
    }

    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.some((type) => metatype === type);
  }

  private formatErrors(errors: ValidationError[]): Record<string, string> {
    return errors.reduce((acc, error) => {
      if (error.children) {
        error.children.forEach((child) => {
          if (child.constraints) {
            const firstConstraintMessage = Object.values(child.constraints)[0];
            acc[child.property] = firstConstraintMessage;
          }
        });
      }
      if (error.constraints) {
        const firstConstraintMessage = Object.values(error.constraints)[0];
        acc[error.property] = firstConstraintMessage;
      }
      return acc;
    }, {});
  }
}
