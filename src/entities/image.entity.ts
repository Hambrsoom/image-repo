import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Length } from "class-validator";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";

/**
 * @swagger
 *
 * components:
 *      schemas:
 *          Image:
 *               properties:
 *                  description:
 *                      type: string
 *                  isPublic:
 *                      type: boolean
 *                  name:
 *                      type: string
 */

/**
 * @swagger
 *
 * components:
 *      schemas:
 *          ReturnImage:
 *               properties:
 *                  id:
 *                      type: number
 *                  description:
 *                      type: string
 *                  isPublic:
 *                      type: boolean
 *                  name:
 *                      type: string
 *                  user:
 *                      $ref: '#/components/schemas/UserInfo'
 *                  comments:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Comment'  
 */

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