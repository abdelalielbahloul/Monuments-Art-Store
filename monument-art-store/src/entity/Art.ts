import { IsNotEmpty, Length } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique("Unique_title", ['title'])
export class Art {

    @PrimaryGeneratedColumn("increment")
    id: number;
  
    @PrimaryGeneratedColumn('uuid')
    @Column()
    artId: string;

    @Column({ nullable: false })
    @Length(6, 255, { message: 'Title must have at least 6 characters' })
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @Column({ nullable: false })
    @Length(6, 255, { message: 'Place must have at least 6 characters' })
    @IsNotEmpty({ message: 'Place is required' })
    place: string;

    @Column({nullable: false})
    @IsNotEmpty({ message: 'Image is required' })
    image: string;

    @Column({ nullable: false })
    @IsNotEmpty({ message: 'Price is required' })
    price: number;

    @Column({ nullable: false })
    @IsNotEmpty({ message: 'Available copies is required' })
    availableCopy: number;
  
    @Column()
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
  
    @Column()
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

}
