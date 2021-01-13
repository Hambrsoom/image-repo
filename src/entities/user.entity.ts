import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import { Length } from "class-validator";
import * as bcrypt from "bcryptjs";
import { Image } from "./image.entity";

@Entity()
@Unique(["username"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(8, 100)
    password: string;

    @Column({nullable: true})
    salt: string;

    @OneToMany(()=> Image, image => image.user)
    images: Image[];

    @OneToMany(() => User, user => user.comments)
    comments!: Comment[];

    hashPassword(): void {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): any {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}