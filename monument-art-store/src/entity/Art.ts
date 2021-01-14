import { IsNotEmpty, Length, Min } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./User";

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

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: false })
    @Length(6, 255, { message: 'Place must have at least 6 characters' })
    @IsNotEmpty({ message: 'Place is required' })
    place: string;

    @Column({nullable: false})
    @IsNotEmpty({ message: 'Image is required' })
    image: string;

    @Column({ nullable: false })
    @IsNotEmpty({ message: 'Price is required' })
    price: string;

    @Column({ nullable: false })
    @IsNotEmpty({ message: 'Available copies is required' })
    @Min(5, { message: 'Minimum number of copies is 5!'})
    availableCopy: number;

    @Column({ nullable: false })
    @IsNotEmpty({ message: 'User is required' })
    userId: string;
  
    @Column()
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
  
    @Column()
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    toCurrency(price, currencyCode, lang = undefined) {
        return Intl.NumberFormat(lang, { style: 'currency', currency: currencyCode}).format(price);
    }

}
