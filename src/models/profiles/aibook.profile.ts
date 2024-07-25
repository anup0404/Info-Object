
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { BooksAIData } from '../books_ai_data.entity';
import { AiBookDto } from '../dtos/aibook.dto';

@Injectable()
export class AiBookProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, BooksAIData, AiBookDto,
                forMember(destination => destination.aiBookDataId, mapFrom(source => `${source.id}`)),
                forMember(destination => destination.startPage, mapFrom(source => `${source.start_page}`)),
                forMember(destination => destination.endPage, mapFrom(source => `${source.end_page}`)),
                forMember(destination => destination.s3VideoURL, mapFrom(source => `${source.s3_video_url}`)),
                forMember(destination => destination.s3GenSummaryURL, mapFrom(source => `${source.s3_gen_summary_url}`)),
                forMember(destination => destination.createDate, mapFrom(source => `${source.createdate ? moment(source.createdate).format("DD/MM/YYYY HH:mm:ss") : ""}`)),
                forMember(destination => destination.statusId, mapFrom(source => `${source.status_id}`)),
                forMember(destination => destination.bookId, mapFrom(source => `${source.book_id}`)),
                forMember(destination => destination.bookName, mapFrom(source => `${source.book?.title}`)),
                forMember(destination => destination.teacherId, mapFrom(source => `${source.teacher_id}`)),
                forMember(destination => destination.teacherName, mapFrom(source => `${source.book?.teacher?.first_name} ${source.book.teacher.last_name}`)),
                forMember(destination => destination.subjectId, mapFrom(source => `${source.book?.InstituteClassSubject?.id}`)),
                forMember(destination => destination.subjectName, mapFrom(source => `${source.book?.InstituteClassSubject?.subject?.name}`)),
                forMember(destination => destination.classId, mapFrom(source => `${source.book?.InstituteClassSubject?.inst_class_id}`)),
                forMember(destination => destination.className, mapFrom(source => `${source.book?.InstituteClassSubject?.instituteClass?.display_name}`)),
                forMember(destination => destination.instituteId, mapFrom(source => `${source.book?.InstituteClassSubject?.instituteClass?.institute_id}`)),
                forMember(destination => destination.instituteName, mapFrom(source => `${source.book?.InstituteClassSubject?.instituteClass?.institute?.name}`)),
                forMember(destination => destination.stateId, mapFrom(source => `${source.book?.InstituteClassSubject?.instituteClass?.institute?.state_id}`)),
                forMember(destination => destination.stateName, mapFrom(source => `${source.book?.InstituteClassSubject?.instituteClass?.institute?.state?.name}`))
            )
        };
    }
}