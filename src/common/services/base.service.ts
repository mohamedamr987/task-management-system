/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FindOneOptions, Repository, DeepPartial } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { NotFoundException } from '@nestjs/common';
import { PaginationResult } from '../interfaces/pagination-result.interface';

export abstract class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findAll(query: any): Promise<PaginationResult<T>> {
    const {
      limit = 10,
      page = 1,
      sort = 'id',
      order = 'ASC',
      filter,
      populate = [], // Added populate parameter
      ...filters
    } = query;

    const qb = this.repo.createQueryBuilder('entity');

    const entityColumns = this.repo.metadata.columns.map(
      (col) => col.propertyName,
    );

    for (const [key, value] of Object.entries(filters)) {
      if (
        value !== undefined &&
        value !== '' &&
        entityColumns.includes(key) &&
        typeof value === 'string' &&
        // doesn't contain id in key
        !key.toLowerCase().includes('id')
      ) {
        qb.andWhere(`entity.${key} ILIKE :${key}`, {
          [key]: `%${value}%`,
        });
      }
      if (key.toLowerCase().includes('id')) {
        const ids = (value as string)
          .split(',')
          .map((id: string) => Number(id.trim()));
        qb.andWhere(`entity.${key} IN (:...ids)`, { ids });
      }
    }

    // Apply sorting
    qb.orderBy(
      `entity.${sort}`,
      (order as string).toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
    );

    // Pagination
    qb.take(Number(limit)).skip((Number(page) - 1) * Number(limit));

    // Apply selected fields using filter=name,email,...
    if (filter && typeof filter === 'string') {
      const selectedFields = filter
        .split(',')
        .filter((field) => entityColumns.includes(field.trim()));

      if (selectedFields.length > 0) {
        qb.select(selectedFields.map((field) => `entity.${field}`));
      }
    }

    // Apply population (eager loading)
    if (populate && populate.length > 0) {
      (populate as [string]).forEach((field) => {
        qb.leftJoinAndSelect(`entity.${field}`, field);
      });
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      limit: Number(limit),
      page: Number(page),
    };
  }

  async findOneById(id: number, populate: string[] = []): Promise<T> {
    const qb = this.repo.createQueryBuilder('entity').where('entity.id = :id', {
      id,
    });
    if (populate && populate.length > 0) {
      (populate as [string]).forEach((field) => {
        qb.leftJoinAndSelect(`entity.${field}`, field);
      });
    }
    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`Item with ID ${id} not found`);
    return entity;
  }

  async findOne(options?: FindOneOptions<T>): Promise<T> {
    const entity = await this.repo.findOne({
      ...options,
    });
    if (!entity) throw new NotFoundException(`Item  not found`);
    return entity;
  }

  async update(id: number, data: DeepPartial<T>): Promise<T> {
    const entity = await this.findOneById(id);
    const updated = this.repo.merge(entity, data);
    return this.repo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOneById(id);
    await this.repo.remove(entity);
  }
}
