import { Module } from '@nestjs/common';
import { TestingController } from './delete-all-data-sql';

@Module({
  imports: [],
  controllers: [TestingController],
})
export class TestingModule {}
