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

    @Column({default: 0})
    like?: number;

    @ManyToOne(() => Image, image => image.comments)
    image!: Image;

    @ManyToOne(() => User, user => user.comments)
    user!: User;

    @CreateDateColumn({type: "timestamp"})
    createdAt?: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt?: Date;
}