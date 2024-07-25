import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { States } from "src/models/state.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Institutes } from "src/models/institute.entity";
import { InstitutesToClasses } from "src/models/institute_classes.entity";
import { InstituteClassToSubjects } from "src/models/institutes_class_subjects.entity";
import { InstituteClassSubjectsToTeacher } from "src/models/institutes_class_subjects_teachers.entity";
import { Books } from "src/models/book.entity";
import { BooksAIData } from "src/models/books_ai_data.entity";
import * as AWS from 'aws-sdk';
import { LoggerService } from "src/winston/logger.services";

@Injectable()
export class GenericService {
	constructor(
		@InjectRepository(States) private stateRepository: Repository<States>,
		@InjectRepository(Institutes) private instituteRepository: Repository<Institutes>,
		@InjectRepository(InstituteClassToSubjects) private classToSubjectsRepository: Repository<InstituteClassToSubjects>,
		@InjectRepository(InstituteClassSubjectsToTeacher) private subjectsToTeacherRepository: Repository<InstituteClassSubjectsToTeacher>,
		@InjectRepository(InstitutesToClasses) private instituteToClassesRepository: Repository<InstitutesToClasses>,
		@InjectRepository(Books) private bookRepository: Repository<Books>,
		@InjectRepository(BooksAIData) private bookAIDataRepository: Repository<BooksAIData>,
		private readonly logger:LoggerService
	) { }

	async getAllStates(withInstitute: boolean) {
		return this.stateRepository.find({
			relations: {
				institutes: withInstitute
			},
			where: {
				is_active: 1
			}
		});
	}

	async getInstituteByState(stateId: number) {
		return this.instituteRepository.find({
			select: {
				state: {
					name: true,
					id: true
				}
			},
			where: {
				state_id: stateId,
				is_active: 1
			},
			relations: {
				state: true
			}
		});
	}


	async getClassesByInstitute(instituteId: number) {
		return this.instituteToClassesRepository.find({
			where: {
				institute_id: instituteId,
				is_active: 1
			},
			relations: {
				institute: {
					state: true
				},
				class: true
			}
		})
	}

	async getSubjectsByClass(InstClassId: number) {
		return this.classToSubjectsRepository.find({
			where: {
				inst_class_id: InstClassId,
				is_active: 1
			},
			relations: {
				subject: true,
				instituteClass: {
					class: true,
					institute: {
						state: true
					},
				}
			}
		})
	}
	async getTeachersBySubject(InstClassSubId) {
		return this.subjectsToTeacherRepository.find({
			where: {
				inst_class_sub_id: InstClassSubId,
				is_active: 1
			},
			relations: {
				teacher: true,
				instituteClassSubject: {
					subject: true,
					instituteClass: {
						class: true,
						institute: {
							state: true
						},
					}
				}
			}
		});
	}

	async getBooksBySubject(InstClassSubId) {
		return this.bookRepository.find({
			where: {
				inst_class_sub_id: InstClassSubId,
				is_active: 1
			},
			relations: {
				teacher: true,
				InstituteClassSubject: {
					subject: true,
					instituteClass: {
						class: true,
						institute: {
							state: true
						},
					}
				}
			}
		});
	}

	async getAiDataByBook(bookId) {
		return this.bookAIDataRepository.find({
			where: {
				book_id: bookId,
				is_active: 1
			},
			relations: {
				book: {
					teacher: true,
					InstituteClassSubject: {
						subject: true,
						instituteClass: {
							class: true,
							institute: {
								state: true
							},
						}
					}
				},
			}
		});
	}


	async getBookById(bookId) {
		return this.bookRepository.findOne({
			where: {
				id: bookId,
				is_active: 1
			},
			relations: {
				teacher: true,
				InstituteClassSubject: {
					subject: true,
					instituteClass: {
						class: true,
						institute: {
							state: true
						},
					}
				}
			}
		});
	}

	async getAiBookById(aiBookId) {
		return this.bookAIDataRepository.findOne({
			where: {
				id: aiBookId,
				is_active: 1
			},
			relations: {
				book: {
					teacher: true,
					InstituteClassSubject: {
						subject: true,
						instituteClass: {
							class: true,
							institute: {
								state: true
							},
						}
					}
				},
			}
		});
	}


	async uploadFile(file, path, fileName) {
		const s3 = new AWS.S3({
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_ACCESS,
		});


		const params = {
			Bucket: process.env.S3_BUCKET_NAME,
			Key: path + fileName,
			Body: file.buffer,
			// ACL: 'public-read',
			ContentType: file.mimetype,
			ContentDisposition: 'inline',
			// CreateBucketConfiguration: {
			// 	LocationConstraint: process.env.S3_LOCATION,
			// }
		};

		try {
			return await s3.upload(params).promise();
		} catch (error) {
			this.logger.error('It is a generic service','uploadFile',error);
			throw error
		}
	}

	async getResource(link) {
		const s3 = new AWS.S3({
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_ACCESS,
			signatureVersion: 'v4',
			region: process.env.S3_REGION
		});

		const downloadResult = await s3.getSignedUrlPromise("getObject", {
			Bucket: process.env.S3_BUCKET_NAME,
			Key: `${decodeURIComponent(link)}`,
			Expires: parseInt(process.env.S3_EXPIRES),
		});
		if (!downloadResult) {
			throw { message: "Donwload file not available" };
		}
		return downloadResult;
	}

	async getResourceList() {
		const s3 = new AWS.S3({
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_ACCESS,
			region: process.env.S3_REGION
		});

		const params = {
			Bucket: process.env.S3_BUCKET_NAME
		};
		const resList = [];
		s3.listObjectsV2(params, (err, data) => {
			if (err) {
				console.error(err);
			} else {
				data.Contents.forEach((item) => {
					resList.push(item.Key);
				});
			}
		});

		return resList;
	}

	async saveBook(data) {
		const result = await this.bookRepository.save(data);
		return this.getBookById(result.id);
	}

	async saveBookAIData(data) {
		const result = await this.bookAIDataRepository.save(data);
		return this.getAiBookById(result.id);
	}

	getDateTimeWithFormat(date) {
		const pad = (number) => number.toString().padStart(2, '0');

		const day = pad(date.getDate());
		const month = pad(date.getMonth() + 1); // Months are zero-based in JavaScript
		const year = date.getFullYear();
		const hours = pad(date.getHours());
		const minutes = pad(date.getMinutes());
		const seconds = pad(date.getSeconds());

		return `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
	}
}