
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { InstituteClassSubjectsToTeacher } from '../institutes_class_subjects_teachers.entity';
import { TeacherDto } from '../dtos/teacher.dto';

@Injectable()
export class TeacherProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, InstituteClassSubjectsToTeacher, TeacherDto,
                forMember(destination => destination.teacherId, mapFrom(source => `${source.id}`)),
                forMember(destination => destination.teacherName, mapFrom(source => `${source.teacher?.first_name} ${source.teacher?.last_name}`)),
                forMember(destination => destination.email, mapFrom(source => `${source.teacher?.email}`)),
                forMember(destination => destination.subjectId, mapFrom(source => `${source.inst_class_sub_id}`)),
                forMember(destination => destination.subjectName, mapFrom(source => `${source.instituteClassSubject?.subject?.name}`)),
                forMember(destination => destination.classId, mapFrom(source => `${source.instituteClassSubject?.inst_class_id}`)),
                forMember(destination => destination.className, mapFrom(source => `${source.instituteClassSubject?.instituteClass?.display_name}`)),
                forMember(destination => destination.instituteId, mapFrom(source => `${source.instituteClassSubject?.instituteClass?.institute_id}`)),
                forMember(destination => destination.instituteName, mapFrom(source => `${source.instituteClassSubject?.instituteClass?.institute?.name}`)),
                forMember(destination => destination.stateId, mapFrom(source => `${source.instituteClassSubject?.instituteClass?.institute?.state_id}`)),
                forMember(destination => destination.stateName, mapFrom(source => `${source.instituteClassSubject?.instituteClass?.institute?.state?.name}`))
            )
        };
    }
}