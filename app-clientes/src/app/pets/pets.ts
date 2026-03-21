import { Component } from '@angular/core';
import {
  PoAvatarModule,
  PoButtonModule,
  PoDividerModule,
  PoPageModule,
  PoTagModule,
  PoTagType,
  PoWidgetModule,
} from '@po-ui/ng-components';

interface PetPost {
  id: number;
  petName: string;
  ownerName: string;
  avatarSrc: string;
  photoSrc: string;
  descricao: string;
  especie: string;
  raca: string;
  curtidas: number;
  comentarios: number;
  hashtags: string[];
  curtido: boolean;
}

interface PetStory {
  nome: string;
  src: string;
  novo: boolean;
}

@Component({
  selector: 'app-pets',
  imports: [PoPageModule, PoAvatarModule, PoButtonModule, PoDividerModule, PoTagModule, PoWidgetModule],
  templateUrl: './pets.html',
  styleUrl: './pets.css',
})
export class Pets {
  readonly PoTagType = PoTagType;
  filtroAtivo = 'todos';

  readonly filtros = [
    { label: 'Todos', value: 'todos' },
    { label: '🐶 Cachorros', value: 'cachorro' },
    { label: '🐱 Gatos', value: 'gato' },
    { label: '🐰 Coelhos', value: 'coelho' },
    { label: '🦜 Pássaros', value: 'passaro' },
  ];

  readonly stories: PetStory[] = [
    { nome: 'Thor', src: 'https://images.pexels.com/photos/3148115/pexels-photo-3148115.jpeg', novo: true },
    { nome: 'Bolt', src: 'https://images.pexels.com/photos/7319380/pexels-photo-7319380.jpeg', novo: true },
    { nome: 'Rex', src: 'https://images.pexels.com/photos/220938/pexels-photo-220938.jpeg', novo: false },
    { nome: 'Max', src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg', novo: false },
  ];

  posts: PetPost[] = [
    {
      id: 1,
      petName: 'Thor',
      ownerName: 'Ana Silva',
      avatarSrc: 'https://images.pexels.com/photos/3148115/pexels-photo-3148115.jpeg',
      photoSrc: 'https://images.pexels.com/photos/3148115/pexels-photo-3148115.jpeg',
      descricao: 'Thor adorou o parque hoje! Ele não parava de brincar com as folhas 🍂',
      especie: 'cachorro',
      raca: 'Golden Retriever',
      curtidas: 142,
      comentarios: 23,
      hashtags: ['#thor', '#goldenlife', '#parque'],
      curtido: false,
    },
    {
      id: 3,
      petName: 'Bolt',
      ownerName: 'Fernanda Costa',
      avatarSrc: 'https://images.pexels.com/photos/7319380/pexels-photo-7319380.jpeg',
      photoSrc: 'https://images.pexels.com/photos/7319380/pexels-photo-7319380.jpeg',
      descricao: 'Primeiro dia de Bolt na praia! Ele amou a água 🌊🐾',
      especie: 'cachorro',
      raca: 'Border Collie',
      curtidas: 215,
      comentarios: 42,
      hashtags: ['#bolt', '#bordercollie', '#praia'],
      curtido: false,
    },
    {
      id: 5,
      petName: 'Pipoca',
      ownerName: 'Juliana Rocha',
      avatarSrc: 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg',
      photoSrc: 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg',
      descricao: 'Pipoca adora pular pelo jardim nas manhãs de domingo 🌿',
      especie: 'coelho',
      raca: 'Holland Lop',
      curtidas: 55,
      comentarios: 7,
      hashtags: ['#pipoca', '#coelhofofo', '#jardim'],
      curtido: false,
    },
    {
      id: 6,
      petName: 'Max',
      ownerName: 'Pedro Alves',
      avatarSrc: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      photoSrc: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      descricao: 'Max celebrando seu aniversário de 3 anos com bolo de carne! 🎂🐶',
      especie: 'cachorro',
      raca: 'Labrador',
      curtidas: 189,
      comentarios: 31,
      hashtags: ['#max', '#labrador', '#aniversario'],
      curtido: true,
    },
    {
      id: 7,
      petName: 'Kiwi',
      ownerName: 'Marina Torres',
      avatarSrc: 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg',
      photoSrc: 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg',
      descricao: 'Kiwi aprendeu a dizer "bom dia" e agora acorda toda a casa às 6h! 🦜',
      especie: 'passaro',
      raca: 'Calopsita',
      curtidas: 134,
      comentarios: 28,
      hashtags: ['#kiwi', '#calopsita', '#talentos'],
      curtido: false,
    },
    {
      id: 9,
      petName: 'Rex',
      ownerName: 'Gustavo Nunes',
      avatarSrc: 'https://images.pexels.com/photos/220938/pexels-photo-220938.jpeg',
      photoSrc: 'https://images.pexels.com/photos/220938/pexels-photo-220938.jpeg',
      descricao: 'Rex e seu brinquedo favorito. Inseparáveis há 4 anos! 🎾',
      especie: 'cachorro',
      raca: 'Pastor Alemão',
      curtidas: 167,
      comentarios: 22,
      hashtags: ['#rex', '#pastoralemao', '#brinquedo'],
      curtido: false,
    },
  ];

  get postsFiltrados(): PetPost[] {
    if (this.filtroAtivo === 'todos') return this.posts;
    return this.posts.filter(p => p.especie === this.filtroAtivo);
  }

  curtir(post: PetPost): void {
    post.curtidas += post.curtido ? -1 : 1;
    post.curtido = !post.curtido;
  }

  filtrar(value: string): void {
    this.filtroAtivo = value;
  }
}
