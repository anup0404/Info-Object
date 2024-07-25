
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { InstitutesToClasses } from '../institute_classes.entity';
import { ClassDto } from '../dtos/class.dto';

@Injectable()
export class ClassProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, InstitutesToClasses, ClassDto,
                forMember(destination => destination.classId, mapFrom(source => `${source.id}`)),
                forMember(destination => destination.className, mapFrom(source => `${source.class?.name}`)),
                forMember(destination => destination.classDisplayName, mapFrom(source => `${source.display_name}`)),
                forMember(destination => destination.instituteId, mapFrom(source => `${source.institute_id}`)),
                forMember(destination => destination.instituteName, mapFrom(source => `${source.institute?.name}`)))
        };
    }
}