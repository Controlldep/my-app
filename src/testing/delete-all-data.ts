import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('testing')
export class DeleteAllData {
  constructor(
    @InjectConnection() private readonly databaseConnection: Connection,
  ) {}

  @Delete('all-data')
  @HttpCode(204)
  async deleteAll() {
    const collections = await this.databaseConnection.listCollections();

    const promises = collections.map((collection) =>
      this.databaseConnection.collection(collection.name).deleteMany({}),
    );
    return await Promise.all(promises);
  }
}

