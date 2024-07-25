import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Institutes } from "./institute.entity";

@Entity()
export class States { // class name should be same as the table name
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	is_active: number;

	@OneToMany(() => Institutes, (institute) => institute.state)
	institutes: Institutes[]
}

//NOTES: You can omit @JoinColumn in a @ManyToOne / @OneToMany relation. @OneToMany cannot exist without @ManyToOne. If you want to use @OneToMany, @ManyToOne is required. However, the inverse is not required: If you only care about the @ManyToOne relationship, you can define it without having @OneToMany on the related entity. Where you set @ManyToOne - its related entity will have "relation id" and foreign key.