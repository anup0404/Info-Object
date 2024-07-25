import { Controller, Get, Param } from "@nestjs/common";
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { GenericService } from "src/services/generic.service";
import { InstitutesToClasses } from "src/models/institute_classes.entity";
import { ClassDto } from '../models/dtos/class.dto';
import { LoggerService } from "src/winston/logger.services";

@Controller('class')
export class ClassController {
	constructor(@InjectMapper() private readonly mapper: Mapper, private genericService: GenericService,private readonly logger:LoggerService) { }

	@Get('/getClassesByInstitute/:instituteId')
	async getClassesByInstitute(@Param('instituteId') instituteId: number) {
		try {
			const result = await this.genericService.getClassesByInstitute(instituteId);
			return this.mapper.mapArray(result, InstitutesToClasses, ClassDto);
		} catch (error) {
			this.logger.error(`Faild to get class by Institute by institute ID : ${instituteId}`,{meta:error})
		}
	}
}