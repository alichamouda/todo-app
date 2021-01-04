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

}