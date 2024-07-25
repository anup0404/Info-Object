import { States } from "./state.entity";
import { InstitutesToClasses } from "./institute_classes.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Institutes { // class name should be same as the table name
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	is_active: number;

	@Column()
	state_id: number

	@ManyToOne(() => States, state => state.name)
	@JoinColumn({ name: 'state_id' })
	state: States

	@OneToMany(() => InstitutesToClasses, instituteToClasses => instituteToClasses.institute)
	public InstituteClasses: InstitutesToClasses[];

}

//NOTES: You can omit @JoinColumn in a @ManyToOne / @OneToMany relation. @OneToMany cannot exist without @ManyToOne. If you want to use @OneToMany, @ManyToOne is required. However, the inverse is not required: If you only care about the @ManyToOne relationship, you can define it without having @OneToMany on the related entity. Where you set @ManyToOne - its related entity will have "relation id" and foreign key.