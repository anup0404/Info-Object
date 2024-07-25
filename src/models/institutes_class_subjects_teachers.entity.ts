import { Teachers } from "./teachers.entity";
import { InstituteClassToSubjects } from "./institutes_class_subjects.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('institutes_class_subjects_teachers')
export class InstituteClassSubjectsToTeacher {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	inst_class_sub_id: number;

	@Column()
	teacher_id: number;

	@Column()
	is_active: number;

	@ManyToOne(() => InstituteClassToSubjects, (instituteClassSubjects) => instituteClassSubjects.subject)
	@JoinColumn({ name: 'inst_class_sub_id' })
	public instituteClassSubject: InstituteClassToSubjects

	@ManyToOne(() => Teachers)
	@JoinColumn({ name: 'teacher_id' })
	public teacher: Teachers

}

//NOTES: You can omit @JoinColumn in a @ManyToOne / @OneToMany relation. @OneToMany cannot exist without @ManyToOne. If you want to use @OneToMany, @ManyToOne is required. However, the inverse is not required: If you only care about the @ManyToOne relationship, you can define it without having @OneToMany on the related entity. Where you set @ManyToOne - its related entity will have "relation id" and foreign key.