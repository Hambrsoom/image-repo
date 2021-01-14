import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Length } from "class-validator";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    @Length(1, 25)
    name!: string;

    @Column({nullable: true})
    description?: string;

    @Column({nullable: false})
    path!: string;

    @Column({default: true})
    isPublic?: boolean;

    @ManyToOne(() => User, user => user.images, { onDelete: "CASCADE" })
    user!: User;

    @OneToMany(()=> Comment, comment => comment.image)
    comments?: Comment[];
}