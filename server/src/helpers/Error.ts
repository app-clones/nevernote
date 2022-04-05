import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Error {
    @Field(() => String)
    message: string;
}
