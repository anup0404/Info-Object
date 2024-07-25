import { InstituteClassToSubjects } from "./institutes_class_subjects.entity";
import { Teachers } from "./teachers.entity";
import { BooksAIData } from "./books_ai_data.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";

@Entity()
export class Books { // class name should be same as the table name
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	inst_class_sub_id: number;

	@Column()
	teacher_id: number;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	version: number;

	@Column()
	s3_pdf_url: string;

	@Column()
	page_count: number;

	@Column()
	is_active: number;

	@Column()
	createdate: Date;

	@ManyToOne(() => InstituteClassToSubjects, (classToSubjects) => classToSubjects.books)
	@JoinColumn({ name: 'inst_class_sub_id' })
	public InstituteClassSubject: InstituteClassToSubjects

	@ManyToOne(() => Teachers, teacher => teacher.books)
	@JoinColumn({ name: 'teacher_id' })
	teacher: Teachers

	@OneToMany(() => BooksAIData, (booksAiData) => booksAiData.book)
	booksAIData: BooksAIData[]

}
