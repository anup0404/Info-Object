import { Controller, Get, Query } from "@nestjs/common";
import { GenericService } from "src/services/generic.service";
import { LoggerService } from "src/winston/logger.services";

@Controller('resource')
export class ResourceController {
    constructor(private genericService: GenericService,private readonly logger:LoggerService) { }

    @Get()
    async getResource(@Query('link') link: string) {
        try {
            return await this.genericService.getResource(link);
        } catch (error) {
            this.logger.error('ResourceController','getResource',error);
            throw error
        }
    }
    @Get('list')
    async getResourceList() {
        try {
            return await this.genericService.getResourceList();
        } catch (error) {
            this.logger.error('ResourceController', 'getResourceList',error);
            throw error
        }
    }
}