import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { GenericService } from 'src/services/generic.service';
import { BooksAIData } from 'src/models/books_ai_data.entity';
import { AiBookDto } from '../models/dtos/aibook.dto';
import { LoggerService } from 'src/winston/logger.services';

@Controller('aibook')
export class AiBookController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private genericService: GenericService,
    private readonly logger: LoggerService,
  ) {}

  @Get('/getAiDataByBook/:bookId')
  async getBooksBySubject(@Param('bookId') subjectId: number) {
    try {
      const result = await this.genericService.getAiDataByBook(subjectId);
      return this.mapper.mapArray(result, BooksAIData, AiBookDto);
    } catch (error) {
      this.logger.error('AiBookController','getBooksBySubject',error);
      throw error
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadBook(@Req() request) {
    try {
      const date = new Date();
      const payload = JSON.parse(request.body.data);
      const dirPath = `${payload.stateName}/${payload.instituteName}/${payload.className}/${payload.subjectName}/${payload.bookName}/Video/`;
      const fileName = `${payload.startPage}_${payload.endPage}_${this.genericService.getDateTimeWithFormat(date)}_${payload.teacherName}__${request.file.originalname}`;

      const res = await this.genericService.uploadFile(
        request.file,
        dirPath,
        fileName,
      );
      const bookData = {
        teacher_id: payload.teacherId,
        book_id: payload.bookId,
        start_page: payload.startPage,
        end_page: payload.endPage,
        s3_video_url: res.Location,
        status_id: 1,
        is_active: 1,
        createdate: date,
      };
      const result = await this.genericService.saveBookAIData(bookData);
      return this.mapper.map(result, BooksAIData, AiBookDto);
    } catch (error) {
      this.logger.error('AiBookController','uploadBook',error);
      throw error
    }
  }
}
