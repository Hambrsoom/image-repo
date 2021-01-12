import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Length } from "class-validator";
import { User } from "./user.entity";
import { Image } from "./image.entity";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({nullable: false})
    @Length(10,150)
    description?: string;

    @Column({default: 0})
    likes: number;

    @ManyToOne(() => Image, image => image.comments)
    comments?: Comment[];
}