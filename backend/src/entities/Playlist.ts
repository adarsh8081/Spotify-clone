import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Track } from './Track';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  userId: string;

  @Column()
  isPublic: boolean;

  @Column()
  coverImageUrl: string;

  @ManyToMany(() => Track, track => track.playlists)
  @JoinTable({
    name: 'track_playlists',
    joinColumn: {
      name: 'playlist_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'track_id',
      referencedColumnName: 'id'
    }
  })
  tracks: Track[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 