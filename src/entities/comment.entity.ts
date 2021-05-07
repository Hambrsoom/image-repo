import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Length } from "class-validator";
import { User } from "./user.entity";
import { Image } from "./image.entity";

/**
 * @swagger
 *
 * components:
 *      schemas:
 *          Comment:
 *               properties:
 *                  id:
 *                      type: number
 *                  description:
 *                      type: string
 *                  isPublic:
 *                      type: boolean
 *                  user:
 *                      $ref: '#/components/schemas/UserInfo'
 *                  createdAt:
 *                      type: timestamp 
 *                      example: 1995-09-07T10:40:52Z,
 *                      format: date-time
 *                  updatedAt:
 *                      type: timestamp 
 *                      example: 1995-09-07T10:40:52Z,
 *                      format: date-time
 */

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