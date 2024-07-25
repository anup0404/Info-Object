
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Institutes } from '../institute.entity';
import { InstituteDto } from '../dtos/institute.dto';

@Injectable()
export class InstituteProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, Institutes, InstituteDto,
                forMember(destination => destination.instituteId, mapFrom(source => `${source.id}`)),
                forMember(destination => destination.instituteName, mapFrom(source => `${source.name}`)),
                forMember(destination => destination.stateId, mapFrom(source => `${source.state_id}`)),
                forMember(destination => destination.stateName, mapFrom(source => `${source.state?.name}`)))
        };
    }
}