import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  PoDividerModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoPageModule,
  PoProgressModule,
  PoTabsModule,
  PoTagModule,
  PoTagType,
  PoWidgetModule,
} from '@po-ui/ng-components';

export interface Curso {
  id: number;
  titulo: string;
  instrutor: string;
  categoria: string;
  nivel: string;
  nivelTipo: PoTagType;
  duracao: string;
  aulas: number;
  progresso: number;
  thumbnail: string;
  videoUrl: string;
  descricao: string;
  avaliacao: number;
  alunos: number;
  tags: string[];
}

@Component({
  selector: 'app-cursos',
  imports: [
    CommonModule,
    FormsModule,
    PoPageModule,
    PoWidgetModule,
    PoModalModule,
    PoTagModule,
    PoProgressModule,
    PoDividerModule,
    PoTabsModule,
  ],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cursos {
  @ViewChild('modalVideo') modalVideo!: PoModalComponent;

  readonly cursoSelecionado = signal<Curso | null>(null);
  readonly categoriaAtiva = signal('todos');

  constructor(private sanitizer: DomSanitizer) {}

  readonly videoUrlSafe = computed<SafeResourceUrl | null>(() => {
    const curso = this.cursoSelecionado();
    if (!curso) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(curso.videoUrl);
  });

  readonly cursos: Curso[] = [
    {
      id: 1,
      titulo: 'Angular do Zero ao Avançado',
      instrutor: 'Carlos Mendes',
      categoria: 'frontend',
      nivel: 'Iniciante',
      nivelTipo: PoTagType.Success,
      duracao: '42h',
      aulas: 120,
      progresso: 65,
      thumbnail: 'https://picsum.photos/seed/angular-course/400/220',
      videoUrl: 'https://www.youtube.com/embed/3dHNOWTI7H8',
      descricao: 'Aprenda Angular do básico ao avançado com projetos reais. Cobrindo componentes, serviços, rotas, RxJS e muito mais.',
      avaliacao: 4.8,
      alunos: 12540,
      tags: ['Angular', 'TypeScript', 'RxJS'],
    },
    {
      id: 2,
      titulo: 'Node.js e APIs REST',
      instrutor: 'Ana Paula Costa',
      categoria: 'backend',
      nivel: 'Intermediário',
      nivelTipo: PoTagType.Warning,
      duracao: '28h',
      aulas: 85,
      progresso: 30,
      thumbnail: 'https://picsum.photos/seed/nodejs-api/400/220',
      videoUrl: 'https://www.youtube.com/embed/RLtyhwFtXQA',
      descricao: 'Construa APIs REST robustas com Node.js, Express e MongoDB. Autenticação JWT, middlewares e boas práticas.',
      avaliacao: 4.7,
      alunos: 9830,
      tags: ['Node.js', 'Express', 'MongoDB'],
    },
    {
      id: 3,
      titulo: 'Machine Learning com Python',
      instrutor: 'Rafael Torres',
      categoria: 'dados',
      nivel: 'Avançado',
      nivelTipo: PoTagType.Danger,
      duracao: '56h',
      aulas: 140,
      progresso: 0,
      thumbnail: 'https://picsum.photos/seed/ml-python/400/220',
      videoUrl: 'https://www.youtube.com/embed/GwIo3gDZCVQ',
      descricao: 'Domine Machine Learning na prática com Python, Scikit-learn, TensorFlow e Keras. Projetos reais incluídos.',
      avaliacao: 4.9,
      alunos: 18200,
      tags: ['Python', 'ML', 'TensorFlow'],
    },
    {
      id: 4,
      titulo: 'UI/UX Design com Figma',
      instrutor: 'Letícia Alves',
      categoria: 'design',
      nivel: 'Iniciante',
      nivelTipo: PoTagType.Success,
      duracao: '20h',
      aulas: 60,
      progresso: 100,
      thumbnail: 'https://picsum.photos/seed/figma-design/400/220',
      videoUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8',
      descricao: 'Aprenda design de interfaces modernas com Figma. Prototipação, sistemas de design e handoff para desenvolvimento.',
      avaliacao: 4.6,
      alunos: 7400,
      tags: ['Figma', 'UI/UX', 'Prototipação'],
    },
    {
      id: 5,
      titulo: 'Docker e Kubernetes na Prática',
      instrutor: 'Marcos Oliveira',
      categoria: 'devops',
      nivel: 'Intermediário',
      nivelTipo: PoTagType.Warning,
      duracao: '35h',
      aulas: 98,
      progresso: 45,
      thumbnail: 'https://picsum.photos/seed/docker-k8s/400/220',
      videoUrl: 'https://www.youtube.com/embed/pg19Z8LL06w',
      descricao: 'Containerização com Docker e orquestração com Kubernetes. Deploy de aplicações em produção com segurança.',
      avaliacao: 4.8,
      alunos: 11000,
      tags: ['Docker', 'Kubernetes', 'DevOps'],
    },
    {
      id: 6,
      titulo: 'React.js Moderno',
      instrutor: 'Juliana Ramos',
      categoria: 'frontend',
      nivel: 'Intermediário',
      nivelTipo: PoTagType.Warning,
      duracao: '38h',
      aulas: 110,
      progresso: 15,
      thumbnail: 'https://picsum.photos/seed/reactjs-modern/400/220',
      videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
      descricao: 'Aprenda React com hooks, Context API, React Query e Next.js. Construa aplicações modernas e performáticas.',
      avaliacao: 4.7,
      alunos: 15600,
      tags: ['React', 'Next.js', 'Hooks'],
    },
  ];

  readonly acaoAssistir: PoModalAction = {
    label: 'Fechar',
    action: () => this.modalVideo.close(),
  };

  readonly cursosFiltrados = computed<Curso[]>(() => {
    const categoriaAtiva = this.categoriaAtiva();
    if (categoriaAtiva === 'todos') return this.cursos;
    return this.cursos.filter(c => c.categoria === categoriaAtiva);
  });

  readonly totalCursos = computed(() => this.cursos.length);

  readonly cursosEmAndamento = computed(() =>
    this.cursos.filter(c => c.progresso > 0 && c.progresso < 100).length
  );

  readonly cursosConcluidos = computed(() =>
    this.cursos.filter(c => c.progresso === 100).length
  );

  selecionarCategoria(categoria: string): void {
    this.categoriaAtiva.set(categoria);
  }

  assistirCurso(curso: Curso): void {
    this.cursoSelecionado.set(curso);
    this.modalVideo.open();
  }

  getProgressoLabel(progresso: number): string {
    if (progresso === 0) return 'Não iniciado';
    if (progresso === 100) return 'Concluído';
    return `${progresso}% concluído`;
  }

  getEstrelas(avaliacao: number): string {
    return '★'.repeat(Math.floor(avaliacao)) + (avaliacao % 1 >= 0.5 ? '½' : '');
  }

  formatarAlunos(alunos: number): string {
    if (alunos >= 1000) return `${(alunos / 1000).toFixed(1)}k`;
    return alunos.toString();
  }
}
