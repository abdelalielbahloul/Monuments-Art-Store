import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToOne,
    ManyToOne,
    Index
  } from "typeorm";
  import { Length, IsNotEmpty, IsEmail, IsInt, Matches } from "class-validator";
  import * as bcrypt from "bcryptjs";
import { UserRole } from "./UserRole";
  @Entity()
  @Unique("Unique keys", ["email"])
  @Index("FK_user_userRole", ["role"])
  export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;
  
    @Column({ nullable: false })
    @Length(4, 60)
    userId: string;

    @Column()
    @Length(3, 255, { message: 'Name must have at least 3 characters'})
    @IsNotEmpty({message: 'Name is required'})
    name: string;

    @Column({ nullable: false })
    @IsEmail()
    @IsNotEmpty({message: 'Email is required'})
    @Length(12, 255, { message: 'Email must have at least 12 characters'})
    email: string;
  
    @Column({ nullable: false})
    @Length(8, 255, { message: 'Password must have at least 8 characters' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.{8,}).*$/, {
      message: 'Password must be at least 8 characters. And has one digit character (0-9), one word character (alphanumeric or underscore), and different of LINE FEED character, and has at least one of special character !@#\$%\^&\* and at least one upper/lower character'
    })
    @IsNotEmpty({message: 'Password is required'})
    password: string;

    @Column({nullable: true})
    userImage: string;
    
    @ManyToOne(() => UserRole, role => role.id)
    @JoinColumn()
    @IsNotEmpty({ message: 'User role is required' })
    role: UserRole;
  
    @Column()
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;
  
    hashPassword() {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }

  }