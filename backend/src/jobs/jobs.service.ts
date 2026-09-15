import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity.js';
import { JobStatus } from './enums/job-status.enum.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateJobStatusDto } from './dto/update-job-status.dto.js';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobsRepository.create({
      ...createJobDto,
      status: JobStatus.PENDING,
    });
    return this.jobsRepository.save(job);
  }

  async findAll(): Promise<Job[]> {
    return this.jobsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateStatus(id: string, updateJobStatusDto: UpdateJobStatusDto): Promise<Job> {
    const newStatus = updateJobStatusDto.status;
    
    // Determine expected current status based on allowed transitions
    let expectedStatus: JobStatus;
    if (newStatus === JobStatus.RUNNING) {
      expectedStatus = JobStatus.PENDING;
    } else if (newStatus === JobStatus.COMPLETED || newStatus === JobStatus.FAILED) {
      expectedStatus = JobStatus.RUNNING;
    } else {
      throw new ConflictException(`Invalid target status ${newStatus}`);
    }

    // Attempt atomic conditional update
    const updateResult = await this.jobsRepository.update(
      { id, status: expectedStatus },
      { status: newStatus }
    );

    // If no row was updated, it means either the job doesn't exist, or the status wasn't what we expected
    if (updateResult.affected === 0) {
      const job = await this.jobsRepository.findOne({ where: { id } });
      if (!job) {
        throw new NotFoundException(`Job with ID ${id} not found`);
      }
      // If it exists but wasn't updated, the transition was invalid (possibly due to concurrent modification or bad request state)
      throw new ConflictException(`Cannot transition job from ${job.status} to ${newStatus}`);
    }

    return this.jobsRepository.findOneOrFail({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    const result = await this.jobsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }
}
