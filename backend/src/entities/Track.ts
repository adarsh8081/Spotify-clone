import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Playlist } from './Playlist';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column()
  album: string;

  @Column()
  duration: number;

  @Column()
  genre: string;

  @Column()
  releaseYear: number;

  @Column()
  audioUrl: string;

  @Column()
  coverImageUrl: string;

  @ManyToMany(() => Playlist, playlist => playlist.tracks)
  @JoinTable({
    name: 'track_playlists',
    joinColumn: {
      name: 'track_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'playlist_id',
      referencedColumnName: 'id'
    }
  })
  playlists: Playlist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 