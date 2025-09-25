import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "varchar", length: 150, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;
}