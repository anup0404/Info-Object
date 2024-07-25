
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Books } from '../book.entity';
import { BookDto } from '../dtos/book.dto';

@Injectable()
export class BookProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, Books, BookDto,
                forMember(destination => destination.bookId, mapFrom(source => `${source.id}`)),
                forMember(destination => destination.bookName, mapFrom(source => `${source.title}`)),
                forMember(destination => destination.version, mapFrom(source => `${source.version}`)),
                forMember(destination => destination.pageCount, mapFrom(source => `${source.page_count}`)),
                forMember(destination => destination.s3PdfURL, mapFrom(source => `${source.s3_pdf_url}`)),
                forMember(destination => destination.createDate, mapFrom(source => `${source.createdate ? moment(source.createdate).format("DD/MM/YYYY HH:mm:ss") : ""}`)),
                forMember(destination => destination.teacherId, mapFrom(source => `${source.teacher_id}`)),
                forMember(destination => destination.teacherName, mapFrom(source => `${source.teacher?.first_name} ${source.teacher?.last_name}`)),
                forMember(destination => destination.subjectId, mapFrom(source => `${source.InstituteClassSubject?.id}`)),
                forMember(destination => destination.subjectName, mapFrom(source => `${source.InstituteClassSubject?.subject?.name}`)),
                forMember(destination => destination.classId, mapFrom(source => `${source.InstituteClassSubject?.inst_class_id}`)),
                forMember(destination => destination.className, mapFrom(source => `${source.InstituteClassSubject?.instituteClass?.display_name}`)),
                forMember(destination => destination.instituteId, mapFrom(source => `${source.InstituteClassSubject?.instituteClass?.institute_id}`)),
                forMember(destination => destination.instituteName, mapFrom(source => `${source.InstituteClassSubject?.instituteClass?.institute?.name}`)),
                forMember(destination => destination.stateId, mapFrom(source => `${source.InstituteClassSubject?.instituteClass?.institute?.state_id}`)),
                forMember(destination => destination.stateName, mapFrom(source => `${source.InstituteClassSubject?.instituteClass?.institute?.state?.name}`)))
        };
    }
}