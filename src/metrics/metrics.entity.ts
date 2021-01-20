import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Metrics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  getCount: number;
  @Column({ default: 0 })
  postCount: number;
  @Column({ default: 0 })
  deleteCount: number;
  @Column({ default: 0 })
  putCount: number;

  constructor() {
    this.putCount = 0;
    this.getCount = 0;
    this.postCount = 0;
    this.deleteCount = 0;
  }
}