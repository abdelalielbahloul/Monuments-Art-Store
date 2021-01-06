import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { IsUppercase } from "class-validator";
import { User } from "./User";

@Entity()
export class UserRole {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({
        type: "set",
        enum: ["ADMIN", "USER"],
        default: `USER`
    })
    @OneToMany(type => User, user => user.id)
    @IsUppercase()
    name: string;
    
}
