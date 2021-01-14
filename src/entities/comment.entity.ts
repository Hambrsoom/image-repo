import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
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

    @ManyToOne(() => Image, image => image.comments, { onDelete: "CASCADE" })
    image!: Image;

    @ManyToOne(() => User, user => user.comments, { onDelete: "CASCADE" })
    user!: User;

    @CreateDateColumn({type: "timestamp"})
    createdAt?: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt?: Date;
}