
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { States } from '../state.entity';
import { StateDto } from '../dtos/state.dto';

@Injectable()
export class StateProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, States, StateDto,
                forMember(destination => destination.stateId, mapFrom(source => `${source.id}`)),
                forMember(destination => destination.stateName, mapFrom(source => `${source.name}`)))
        };
    }
}