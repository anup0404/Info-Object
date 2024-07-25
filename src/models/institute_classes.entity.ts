import { Classes } from "./class.entity";
import { Institutes } from "./institute.entity";
import { InstituteClassToSubjects } from "./institutes_class_subjects.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('institutes_classes')
export class InstitutesToClasses { // class name should be same as the table name
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	institute_id: number;

	@Column()
	class_id: number;

	@Column()
	display_name: string;

	@Column()
	is_active: number;

	@ManyToOne(() => Classes, (classes) => classes.classInstitutes)
	@JoinColumn({ name: 'class_id' })
	public class: Classes

	@ManyToOne(() => Institutes, (institutes) => institutes.InstituteClasses)
	@JoinColumn({ name: 'institute_id' })
	public institute: Institutes

	@OneToMany(() => InstituteClassToSubjects, (instituteClassToSubject) => instituteClassToSubject.instituteClass)
	instituteClassSubjects: InstituteClassToSubjects[]
}

//NOTES: You can omit @JoinColumn in a @ManyToOne / @OneToMany relation. @OneToMany cannot exist without @ManyToOne. If you want to use @OneToMany, @ManyToOne is required. However, the inverse is not required: If you only care about the @ManyToOne relationship, you can define it without having @OneToMany on the related entity. Where you set @ManyToOne - its related entity will have "relation id" and foreign key.