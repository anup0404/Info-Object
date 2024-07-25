import { Controller, Get, Param } from "@nestjs/common";
import { GenericService } from "../services/generic.service";
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { InstituteClassSubjectsToTeacher } from "src/models/institutes_class_subjects_teachers.entity";
import { TeacherDto } from '../models/dtos/teacher.dto';
import { LoggerService } from "src/winston/logger.services";

@Controller('teacher')
export class TeacherController {
	constructor(@InjectMapper() private readonly mapper: Mapper, private genericService: GenericService,private readonly logger:LoggerService) { }

	@Get('/getTeachersBySubject/:subjectId')
	async getTeachersBySubject(@Param('subjectId') subjectId: number) {
		try {
			const result = await this.genericService.getTeachersBySubject(subjectId);
			return this.mapper.mapArray(result, InstituteClassSubjectsToTeacher, TeacherDto);
		} catch (error) {
			this.logger.error(`Error while getting teacher by subject for subject Id : ${subjectId}`,{meta:error})
		}
	}
}