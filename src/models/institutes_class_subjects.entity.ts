import { Subjects } from "./subjects.entity";
import { InstitutesToClasses } from "./institute_classes.entity";
import { InstituteClassSubjectsToTeacher } from "./institutes_class_subjects_teachers.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Books } from "./book.entity";

@Entity('institutes_class_subjects')
export class InstituteClassToSubjects {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	inst_class_id: number;

	@Column()
	subject_id: number;

	@Column()
	is_active: number;

	@ManyToOne(() => InstitutesToClasses, (instituteToClasses) => instituteToClasses.instituteClassSubjects)
	@JoinColumn({ name: 'inst_class_id' })
	public instituteClass: InstitutesToClasses

	@ManyToOne(() => Subjects)
	@JoinColumn({ name: 'subject_id' })
	public subject: Subjects

	@OneToMany(() => InstituteClassSubjectsToTeacher, (instituteClassSubjectsTeacher) => instituteClassSubjectsTeacher.instituteClassSubject)
	teachers: InstituteClassSubjectsToTeacher[]

	@OneToMany(() => Books, (book) => book.InstituteClassSubject)
	books: Books[]
}

//NOTES: You can omit @JoinColumn in a @ManyToOne / @OneToMany relation. @OneToMany cannot exist without @ManyToOne. If you want to use @OneToMany, @ManyToOne is required. However, the inverse is not required: If you only care about the @ManyToOne relationship, you can define it without having @OneToMany on the related entity. Where you set @ManyToOne - its related entity will have "relation id" and foreign key.