import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity("tasks")
export class Task {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({ type: "varchar", length: 100 })
    title!: string;

    @Column({ type: "text" })
    description!: string;

    @Column({ name: "due_date", type: "timestamp" })
    dueDate!: Date;

    @Column({ type: "varchar", length: 20, default: "pendente" })
    status!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;
}