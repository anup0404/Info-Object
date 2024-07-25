import { Controller, Get, Param } from "@nestjs/common";
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { GenericService } from "../services/generic.service";
import { InstituteClassToSubjects } from "src/models/institutes_class_subjects.entity";
import { SubjectDto } from '../models/dtos/subject.dto';
import { LoggerService } from "src/winston/logger.services";

@Controller('subject')
export class SubjectController {
	constructor(@InjectMapper() private readonly mapper: Mapper, private genericService: GenericService,private readonly logger:LoggerService) { }

	@Get('/getSubjectsByClass/:classId')
	async getSubjectsByClass(@Param('classId') classId: number) {
		try {
			const result = await this.genericService.getSubjectsByClass(classId);
			return this.mapper.mapArray(result, InstituteClassToSubjects, SubjectDto);
		} catch (error) {
			this.logger.error('SubjectController','getSubjectsByClass',error);
			throw error
		}
	}
}