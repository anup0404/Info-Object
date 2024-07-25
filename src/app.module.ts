/** Modules */
import { Module } from '@nestjs/common';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from "@nestjs/config";

/** Services */
import { AppService } from './app.service';
import { GenericService } from "./services/generic.service";

/** Controllers */
import { AppController } from './app.controller';
import { ClassController } from './controllers/class.controller';
import { ResourceController } from "./controllers/resource.controller";
import { StateController } from "./controllers/state.controller";
import { TeacherController } from './controllers/teacher.controller';
import { SubjectController } from './controllers/subject.controller';
import { InstituteController } from "./controllers/institute.controller";
import { BookController } from "./controllers/book.controller";
import { AiBookController } from "./controllers/book_ai_data.controller";


/** Entities */
import { States } from "./models/state.entity";
import { Classes } from './models/class.entity';
import { Subjects } from './models/subjects.entity';
import { Teachers } from './models/teachers.entity';
import { Institutes } from './models/institute.entity';
import { Books } from './models/book.entity';
import { BooksAIData } from "./models/books_ai_data.entity";
import { InstitutesToClasses } from './models/institute_classes.entity';
import { InstituteClassToSubjects } from './models/institutes_class_subjects.entity';
import { InstituteClassSubjectsToTeacher } from './models/institutes_class_subjects_teachers.entity';



/*Automapper Profiles*/
import { StateProfile } from "./models/profiles/state.profile"
import { InstituteProfile } from "./models/profiles/institute.profile"
import { ClassProfile } from "./models/profiles/class.profile"
import { SubjectProfile } from "./models/profiles/subject.profile"
import { TeacherProfile } from "./models/profiles/teacher.profile"
import { BookProfile } from "./models/profiles/book.profile"
import { AiBookProfile } from "./models/profiles/aibook.profile";
import {LoggerService}  from './winston/logger.services';



const sslPrivateKey = `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUNLbx5W9/3M3gOhJ0GO8KY3B6rOMwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvODA0NDIwOTAtOGMwMi00YzJlLWEzMDktZjBhMzUyZDYy
MDdmIFByb2plY3QgQ0EwHhcNMjQwNzA5MTg1MDQ0WhcNMzQwNzA3MTg1MDQ0WjA6
MTgwNgYDVQQDDC84MDQ0MjA5MC04YzAyLTRjMmUtYTMwOS1mMGEzNTJkNjIwN2Yg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAJ3CH2vn
VNCRr2aT9IjTbaoW+akcCVNzW4tbygyX2iJRwE2IaZBER/CrD/motDP6EBGjh//N
8zebqIiEuAXLNyZHlYscTOd254Vq3LRslS45Bbkx4YuPy3X4vz0O4MXjjCd/d1MA
FS69IvwdaUj6wHuNYlq3Fn/+lvswgfDT9PANEklGojyRElEuT2dw8SI6XMm26Yg8
fiOry/xlInxI1Fq/NBnn8S4RJcgc0OrfKgcXJMZAyL19Y2YxFqTmCC1XcQnmIdKk
IZ4bGRjRIu/4dKXbHSnZkJg2Rhh+rQnQVEOe4j+Wvsq14Sd1H5BAiLWYekB3Csey
/8sDRbMGRnbIZun9l9OPwp3+IzRFgkjIyHDJxKGcNMWqnU3CxOxeHKYhzoVqlgvc
gbdJmeo8WllmEJQQmIo3wqiQFUK+4vZHqlbpAJNmdcqEo/4Xdsa8PAINAsU+vVHd
MTZl0YuE/+NumHpO7GoQkclKDHfEymIFuYItpy9JDx1VCa1Hps3j2VptxwIDAQAB
oz8wPTAdBgNVHQ4EFgQU+eSpVvV2dqV3QGT5PsUHLOAdGi8wDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBADYHIwmW2u36fhW7
JBBe/ri1XeItewm2l2aMoR4EEkkwnhs7IbhuQ0+NY8S8uQ/dUVtX99BTFoYJ/Jhu
p2LLpn35FOvDY5LWACBDb10FNfAP0Xt6+aELpC21t8eOfx/LxtufnG9vWRwa4rDe
0LZ4wP8wakNAKWHtkXoblJW4dQX3hmNN/Rcp7PtwVIW9R+uPGbZ9TlhS9twlVFAC
1xzVUTDqj8VN2sumflMLV0Z/UVM7i54oresODak5pIAHa61IWfYmd3+CMTp1+gFq
tZpC8a5EhA4tWdNnUUoi1c1gGkJhqNtME8RnrxCUTLx3b9VVR/WhW3FiPe6eV4ou
ykyrGhvnkCdz309DvE/zkyPBfMv999Syw9+GG3fqnxpwVvYl96qR5webib5/tskX
Bb7uO06PtuJ+ZNaF9udxenHGzXOTdT3eo3NopHgHPj7l8YkVnzOhonWxeY5oHJHQ
sZ3H7mWE9Yo5CD0uQxVFM1QtDsgDmt+4WH+T+oZsPSzTzi21vg==
-----END CERTIFICATE-----`;


@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DB_HOST'),
				port: +configService.get<number>('DB_PORT'),
				username: configService.get('DB_USERNAME'),
				password: configService.get('DB_PASSWORD'),
				database: configService.get('DB_DATABASE'),
				schema: configService.get('DB_SCHEMA'),
				entities: [
					States,
					Institutes,
					Classes,
					Books,
					BooksAIData,
					InstitutesToClasses,
					InstituteClassToSubjects,
					Subjects,
					Teachers,
					InstituteClassSubjectsToTeacher
				],
				// ssl: false
				ssl: {
					ca: sslPrivateKey
				}
			})
		}),
		TypeOrmModule.forFeature([
			States,
			Institutes,
			Classes,
			Subjects,
			Teachers,
			InstitutesToClasses,
			InstituteClassToSubjects,
			InstituteClassSubjectsToTeacher,
			Books,
			BooksAIData
		]),
		AutomapperModule.forRoot({
			strategyInitializer: classes(),
		}),
	],
	controllers: [
		AppController,
		ClassController,
		ResourceController,
		StateController,
		SubjectController,
		TeacherController,
		InstituteController,
		BookController,
		AiBookController
	],
	providers: [AppService, GenericService, InstituteProfile, ClassProfile, SubjectProfile, TeacherProfile, BookProfile, AiBookProfile, StateProfile,LoggerService],
})
export class AppModule { }
