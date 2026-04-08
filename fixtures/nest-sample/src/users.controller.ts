import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { IsInt, IsOptional, IsString } from "class-validator";

class CreateUserDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsInt()
  age?: number;
}

@Controller("users")
export class UsersController {
  @Get(":id")
  findOne(@Param("id") _id: string, @Query("verbose") _verbose?: string) {
    return { ok: true };
  }

  @Post()
  create(@Body() _body: CreateUserDto) {
    if (typeof _body.age === "number" && _body.age <= 18) {
      throw new Error("age must be above 18");
    }
    return { ok: true };
  }
}
