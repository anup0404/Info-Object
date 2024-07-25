import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Books } from "./book.entity";

@Entity('books_ai_data')
export class BooksAIData { // class name should be same as the table name
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	teacher_id: number;

	@Column()
	book_id: number;

	@Column()
	start_page: number;

	@Column()
	end_page: number;

	@Column()
	s3_video_url: string;

	@Column()
	s3_gen_summary_url: string;

	@Column()
	status_id: number;

	@Column()
	is_active: number;
	
	@Column()
	createdate: Date;

	@ManyToOne(() => Books, book => book.id)
	@JoinColumn({ name: 'book_id' })
	book: Books
}
