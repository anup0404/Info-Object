import { Controller, Get, Param } from "@nestjs/common";
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { GenericService } from "src/services/generic.service";
import { Institutes } from "src/models/institute.entity";
import { InstituteDto } from '../models/dtos/institute.dto';
import { LoggerService } from "src/winston/logger.services";

@Controller('institute')
export class InstituteController {
	constructor(@InjectMapper() private readonly mapper: Mapper, private genericService: GenericService,private readonly logger:LoggerService) { }

	@Get('/getInstituteByState/:id')
	async getInstituteByState(@Param('id') stateId: number): Promise<InstituteDto[]> {
		try {
			const result = await this.genericService.getInstituteByState(stateId);
			return this.mapper.mapArray(result, Institutes, InstituteDto);
		} catch (error) {
			this.logger.error(`Faild to get Institute by state for ID : ${stateId}`,{meta:error})
		}
	}
}