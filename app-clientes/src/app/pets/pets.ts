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
    { nome: 'Thor', src: 'https://placedog.net/96/96?id=1', novo: true },
    { nome: 'Luna', src: 'https://placekitten.com/96/96', novo: true },
    { nome: 'Bolt', src: 'https://placedog.net/96/96?id=10', novo: true },
    { nome: 'Mia', src: 'https://placekitten.com/97/97', novo: false },
    { nome: 'Rex', src: 'https://placedog.net/96/96?id=20', novo: false },
    { nome: 'Bela', src: 'https://placekitten.com/95/95', novo: true },
    { nome: 'Max', src: 'https://placedog.net/96/96?id=30', novo: false },
  ];

  posts: PetPost[] = [
    {
      id: 1,
      petName: 'Thor',
      ownerName: 'Ana Silva',
      avatarSrc: 'https://placedog.net/64/64?id=1',
      photoSrc: 'https://placedog.net/600/400?id=1',
      descricao: 'Thor adorou o parque hoje! Ele não parava de brincar com as folhas 🍂',
      especie: 'cachorro',
      raca: 'Golden Retriever',
      curtidas: 142,
      comentarios: 23,
      hashtags: ['#thor', '#goldenlife', '#parque'],
      curtido: false,
    },
    {
      id: 2,
      petName: 'Luna',
      ownerName: 'Carlos Mendes',
      avatarSrc: 'https://placekitten.com/64/64',
      photoSrc: 'https://placekitten.com/600/400',
      descricao: 'Luna encontrou um raio de sol e resolveu tirar uma soneca 😸',
      especie: 'gato',
      raca: 'Siamês',
      curtidas: 98,
      comentarios: 15,
      hashtags: ['#luna', '#gatosiames', '#sono'],
      curtido: true,
    },
    {
      id: 3,
      petName: 'Bolt',
      ownerName: 'Fernanda Costa',
      avatarSrc: 'https://placedog.net/64/64?id=10',
      photoSrc: 'https://placedog.net/600/400?id=10',
      descricao: 'Primeiro dia de Bolt na praia! Ele amou a água 🌊🐾',
      especie: 'cachorro',
      raca: 'Border Collie',
      curtidas: 215,
      comentarios: 42,
      hashtags: ['#bolt', '#bordercollie', '#praia'],
      curtido: false,
    },
    {
      id: 4,
      petName: 'Mia',
      ownerName: 'Roberto Lima',
      avatarSrc: 'https://placekitten.com/66/66',
      photoSrc: 'https://placekitten.com/601/401',
      descricao: 'Mia aprendeu um truque novo hoje! Tão inteligente 🎉',
      especie: 'gato',
      raca: 'Maine Coon',
      curtidas: 77,
      comentarios: 9,
      hashtags: ['#mia', '#mainecoon', '#truque'],
      curtido: false,
    },
    {
      id: 5,
      petName: 'Pipoca',
      ownerName: 'Juliana Rocha',
      avatarSrc: 'https://picsum.photos/seed/rabbit1/64/64',
      photoSrc: 'https://picsum.photos/seed/rabbit1/600/400',
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
      avatarSrc: 'https://placedog.net/64/64?id=20',
      photoSrc: 'https://placedog.net/600/400?id=20',
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
      avatarSrc: 'https://picsum.photos/seed/parrot1/64/64',
      photoSrc: 'https://picsum.photos/seed/parrot1/600/400',
      descricao: 'Kiwi aprendeu a dizer "bom dia" e agora acorda toda a casa às 6h! 🦜',
      especie: 'passaro',
      raca: 'Calopsita',
      curtidas: 134,
      comentarios: 28,
      hashtags: ['#kiwi', '#calopsita', '#talentos'],
      curtido: false,
    },
    {
      id: 8,
      petName: 'Bela',
      ownerName: 'Luana Ferreira',
      avatarSrc: 'https://placekitten.com/65/65',
      photoSrc: 'https://placekitten.com/602/402',
      descricao: 'Bela na janela novamente, eternamente curiosa sobre o mundo lá fora 🌍',
      especie: 'gato',
      raca: 'Ragdoll',
      curtidas: 112,
      comentarios: 18,
      hashtags: ['#bela', '#ragdoll', '#janela'],
      curtido: false,
    },
    {
      id: 9,
      petName: 'Rex',
      ownerName: 'Gustavo Nunes',
      avatarSrc: 'https://placedog.net/64/64?id=30',
      photoSrc: 'https://placedog.net/600/400?id=30',
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
