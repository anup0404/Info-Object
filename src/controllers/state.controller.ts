import { Controller, Get } from "@nestjs/common";
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { GenericService } from "../services/generic.service";
import { States } from "src/models/state.entity";
import { StateDto } from '../models/dtos/state.dto';
import { LoggerService } from "src/winston/logger.services";

@Controller('states')
export class StateController {
	constructor(@InjectMapper() private readonly mapper: Mapper, private genericService: GenericService,private readonly logger:LoggerService) { }

	@Get()
	async getAllStates(): Promise<StateDto[]> {
		try {
			const result = await this.genericService.getAllStates(false);
			return this.mapper.mapArray(result, States, StateDto);
		} catch (error) {
			this.logger.error('StateController',' getAllStates',error);
			throw error
		}
	}
}