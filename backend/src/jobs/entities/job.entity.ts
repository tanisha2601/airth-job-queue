import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { JobStatus } from '../enums/job-status.enum.js';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column({
    type: 'varchar',
    default: JobStatus.PENDING,
  })
  status: JobStatus;

  @CreateDateColumn()
  createdAt: Date;
}
