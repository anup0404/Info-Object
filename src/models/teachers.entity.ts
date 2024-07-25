import { Books } from "./book.entity";
import { InstituteClassToSubjects } from "./institutes_class_subjects.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Teachers {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	initial: string;

	@Column()
	first_name: string;

	@Column()
	middle_name: string;

	@Column()
	last_name: string;

	@Column()
	dob: Date;

	@Column()
	email: string;

	@Column()
	is_active: number;

	@OneToMany(() => InstituteClassToSubjects, instituteClassSubjects => instituteClassSubjects.teachers)
	public InstituteClassSubjects: InstituteClassToSubjects[];

	@OneToMany(() => Books, (book) => book.teacher)
	books: Books[]

}

//NOTES: You can omit @JoinColumn in a @ManyToOne / @OneToMany relation. @OneToMany cannot exist without @ManyToOne. If you want to use @OneToMany, @ManyToOne is required. However, the inverse is not required: If you only care about the @ManyToOne relationship, you can define it without having @OneToMany on the related entity. Where you set @ManyToOne - its related entity will have "relation id" and foreign key.