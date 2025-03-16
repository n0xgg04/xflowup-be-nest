import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum Status {
  SUCCESS = 'success',
  ERROR = 'error',
}

registerEnumType(Status, {
  name: 'Status',
});
