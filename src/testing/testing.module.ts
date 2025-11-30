import { Module } from '@nestjs/common';
import { DeleteAllData } from './delete-all-data';

@Module({
  imports: [],
  controllers: [DeleteAllData],
})
export class TestingModule {}
