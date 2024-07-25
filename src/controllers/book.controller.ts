import { Controller, Get, Post, Param, Req, UseInterceptors } from "@nestjs/common";
import { GenericService } from "../services/generic.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { Books } from "src/models/book.entity";
import { BookDto } from '../models/dtos/book.dto';
import { PDFDocument } from "pdf-lib";
import { LoggerService } from "src/winston/logger.services";

@Controller('book')
export class BookController {
    constructor(@InjectMapper() private readonly mapper: Mapper, private genericService: GenericService, private readonly logger: LoggerService,) { }

    @Get('/getBooksBySubject/:subjectId')
    async getBooksBySubject(@Param('subjectId') subjectId: number) {
        try {
            const result = await this.genericService.getBooksBySubject(subjectId);
            return this.mapper.mapArray(result, Books, BookDto);
        } catch (error) {
            this.logger.error(`Failed to fetch book for subject ID: ${subjectId}`, {
                meta: error,
              });
        }
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async addBook(@Req() request) {
        try {
            const date = new Date();
            const payload = JSON.parse(request.body.data);
            const dirPath = `${payload.stateName}/${payload.instituteName}/${payload.className}/${payload.subjectName}/${payload.bookName}/Pdf/`;
            const fileName = `${this.genericService.getDateTimeWithFormat(date)}_${payload.teacherName}__${request.file.originalname}`;
            const res = await this.genericService.uploadFile(request.file, dirPath, fileName);

            const pdf = await PDFDocument.load(request.file.buffer);

            const bookData = {
                inst_class_sub_id: payload.subjectId,
                title: payload.bookName,
                description: payload.description || payload.bookName,
                version: payload.version || 1,
                teacher_id: payload.teacherId,
                s3_pdf_url: res.Location,
                page_count: pdf.getPageCount(),
                is_active: 1,
                createdate: date
            }
            const result = await this.genericService.saveBook(bookData);
            return this.mapper.map(result, Books, BookDto);
        } catch (error) {
            this.logger.error(`Failed to add book : ${error.message}`, {
                meta: error,
              });
        }
    }
}