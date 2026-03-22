// ============================================
// Tipos globales de Starbooks
// ============================================

export interface Intelligence {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  color: string;
  description: string | null;
  sort_order: number;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  photo_url: string | null;
  nationality: string | null;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  author_id: string;
  intelligence_id: string;
  description: string | null;
  cover_url: string | null;
  total_chapters: number;
  estimated_duration: string | null;
  difficulty: "basico" | "intermedio" | "avanzado";
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Relaciones
  author?: Author;
  intelligence?: Intelligence;
}

export interface Step1AuthorAudio {
  id: string;
  book_id: string;
  title: string;
  description: string | null;
  audio_url: string;
  duration_seconds: number | null;
  transcript: string | null;
}

export interface Step2Summary {
  id: string;
  book_id: string;
  title: string;
  content_html: string;
  key_points: string[] | null;
  reading_time_minutes: number | null;
  audio_url: string | null;
  audio_duration_seconds: number | null;
}

export interface Step3MindMap {
  id: string;
  book_id: string;
  title: string;
  description: string | null;
  mindmap_data: MindMapData;
  image_url: string | null;
}

export interface MindMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
  size?: "lg" | "md" | "sm";
}

export interface MindMapEdge {
  from: string;
  to: string;
}

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export interface Step4Chapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  subtitle: string | null;
  video_url: string;
  video_duration_seconds: number | null;
  intelligence_type: string | null;
  ai_context: string | null;
  key_concepts: string[] | null;
  sort_order: number;
}

export interface Step5Podcast {
  id: string;
  book_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  audio_url: string | null;
  duration_seconds: number | null;
  speakers: PodcastSpeaker[] | null;
}

export interface PodcastSpeaker {
  name: string;
  role: string;
  photo: string;
}

export interface Step6Post {
  id: string;
  book_id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  // Relaciones
  profile?: Profile;
  user_has_liked?: boolean;
}

export interface Step6Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  // Relaciones
  profile?: Profile;
}

export interface Step7Exam {
  id: string;
  book_id: string;
  title: string;
  description: string | null;
  passing_score: number;
  time_limit_minutes: number | null;
  total_questions: number;
}

export interface Step7Question {
  id: string;
  exam_id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false";
  options: QuestionOption[];
  explanation: string | null;
  sort_order: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  bio: string | null;
  total_points: number;
  books_completed: number;
  current_streak: number;
  longest_streak: number;
  is_admin?: boolean;
}

export interface UserBookProgress {
  id: string;
  user_id: string;
  book_id: string;
  current_step: number;
  step1_completed: boolean;
  step2_completed: boolean;
  step3_completed: boolean;
  step4_completed: boolean;
  step4_chapters_completed: string[];
  step5_completed: boolean;
  step6_completed: boolean;
  step7_completed: boolean;
  exam_score: number | null;
  exam_attempts: number;
  certificate_url: string | null;
  completed_at: string | null;
  started_at: string;
  updated_at: string;
}

export interface AIChatMessage {
  id: string;
  user_id: string;
  chapter_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// Interfaz modular para proveedores de IA
export interface AIProvider {
  chat(
    messages: { role: "user" | "assistant"; content: string }[],
    context: string
  ): Promise<string>;
}

// Tipos de paso para el tracker
export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface StepInfo {
  number: StepNumber;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  emoji: string;
}

export type StepStatus = "completed" | "current" | "locked";
