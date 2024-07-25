
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { InstituteClassToSubjects } from '../institutes_class_subjects.entity';
import { SubjectDto } from '../dtos/subject.dto';

@Injectable()
export class SubjectProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, InstituteClassToSubjects, SubjectDto,
                forMember(destination => destination.subjectId, mapFrom(source => `${source.id}`)),
                forMember(destination => destination.subjectName, mapFrom(source => `${source.subject?.name}`)),
                forMember(destination => destination.classId, mapFrom(source => `${source.inst_class_id}`)),
                forMember(destination => destination.className, mapFrom(source => `${source.instituteClass?.display_name}`)),
                forMember(destination => destination.instituteId, mapFrom(source => `${source.instituteClass?.institute_id}`)),
                forMember(destination => destination.instituteName, mapFrom(source => `${source.instituteClass?.institute?.name}`)),
                forMember(destination => destination.stateId, mapFrom(source => `${source.instituteClass?.institute?.state_id}`)),
                forMember(destination => destination.stateName, mapFrom(source => `${source.instituteClass?.institute?.state?.name}`))
            )
        };
    }
}