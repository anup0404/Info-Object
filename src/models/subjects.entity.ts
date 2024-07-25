import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InstituteClassToSubjects } from "./institutes_class_subjects.entity";

@Entity()
export class Subjects {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	is_active: number;

	@OneToMany(() => InstituteClassToSubjects, instituteClassSubjects => instituteClassSubjects.subject)
	public instituteClassSubjects: InstituteClassToSubjects[];

}

//NOTES: You can omit @JoinColumn in a @ManyToOne / @OneToMany relation. @OneToMany cannot exist without @ManyToOne. If you want to use @OneToMany, @ManyToOne is required. However, the inverse is not required: If you only care about the @ManyToOne relationship, you can define it without having @OneToMany on the related entity. Where you set @ManyToOne - its related entity will have "relation id" and foreign key.