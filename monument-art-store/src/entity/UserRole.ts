import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique} from "typeorm";
import { IsUppercase } from "class-validator";
import { User } from "./User";

@Entity()
@Unique("unique_name", ["name"])
export class UserRole {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({
        // type: "set",
        // enum: ["ADMIN", "USER"],
        default: `USER`
    })
    @OneToMany(() => User, user => user.id)
    @IsUppercase()
    name: string;
    
}
