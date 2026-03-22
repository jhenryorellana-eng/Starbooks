-- ============================================
-- STARBOOKS DATABASE SCHEMA
-- ============================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- Categorias de inteligencia
CREATE TABLE intelligences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Autores
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  photo_url TEXT,
  nationality TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Libros
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author_id UUID REFERENCES authors(id),
  intelligence_id UUID REFERENCES intelligences(id),
  description TEXT,
  cover_url TEXT,
  total_chapters INT DEFAULT 0,
  estimated_duration TEXT,
  difficulty TEXT DEFAULT 'intermedio',
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTENIDO POR PASO
-- ============================================

-- PASO 1: Audio del Autor
CREATE TABLE step1_author_audio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  duration_seconds INT,
  transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 2: Resumen del Libro
CREATE TABLE step2_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_html TEXT NOT NULL,
  key_points JSONB,
  reading_time_minutes INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 3: Mapa Conceptual
CREATE TABLE step3_mindmap (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  mindmap_data JSONB NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 4: Capitulos (Video + Chatbot)
CREATE TABLE step4_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  video_url TEXT NOT NULL,
  video_duration_seconds INT,
  intelligence_type TEXT,
  ai_context TEXT,
  key_concepts JSONB,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id, chapter_number)
);

-- PASO 5: Podcast / Video de Expertos
CREATE TABLE step5_podcast (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  audio_url TEXT,
  duration_seconds INT,
  speakers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 6: Comunidad - Posts
CREATE TABLE step6_community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 6: Comunidad - Comentarios
CREATE TABLE step6_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES step6_community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 6: Comunidad - Likes
CREATE TABLE step6_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES step6_community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- PASO 7: Examenes
CREATE TABLE step7_exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INT DEFAULT 70,
  time_limit_minutes INT,
  total_questions INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 7: Preguntas del Examen
CREATE TABLE step7_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES step7_exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice',
  options JSONB NOT NULL,
  explanation TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROGRESO Y GAMIFICACION
-- ============================================

-- Perfiles de usuario extendido
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  total_points INT DEFAULT 0,
  books_completed INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progreso por libro
CREATE TABLE user_book_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  current_step INT DEFAULT 1,
  step1_completed BOOLEAN DEFAULT false,
  step2_completed BOOLEAN DEFAULT false,
  step3_completed BOOLEAN DEFAULT false,
  step4_completed BOOLEAN DEFAULT false,
  step4_chapters_completed JSONB DEFAULT '[]',
  step5_completed BOOLEAN DEFAULT false,
  step6_completed BOOLEAN DEFAULT false,
  step7_completed BOOLEAN DEFAULT false,
  exam_score INT,
  exam_attempts INT DEFAULT 0,
  certificate_url TEXT,
  completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Historial de chat IA
CREATE TABLE ai_chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES step4_chapters(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE step6_community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE step6_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE step6_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users view own progress" ON user_book_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own progress" ON user_book_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone reads posts" ON step6_community_posts FOR SELECT USING (true);
CREATE POLICY "Users create posts" ON step6_community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own posts" ON step6_community_posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone reads comments" ON step6_comments FOR SELECT USING (true);
CREATE POLICY "Users create comments" ON step6_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own likes" ON step6_likes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own chat" ON ai_chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create chat" ON ai_chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Contenido publico — lectura libre
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read books" ON books FOR SELECT USING (true);
ALTER TABLE intelligences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read intelligences" ON intelligences FOR SELECT USING (true);
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read authors" ON authors FOR SELECT USING (true);
ALTER TABLE step1_author_audio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read step1" ON step1_author_audio FOR SELECT USING (true);
ALTER TABLE step2_summary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read step2" ON step2_summary FOR SELECT USING (true);
ALTER TABLE step3_mindmap ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read step3" ON step3_mindmap FOR SELECT USING (true);
ALTER TABLE step4_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read step4" ON step4_chapters FOR SELECT USING (true);
ALTER TABLE step5_podcast ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read step5" ON step5_podcast FOR SELECT USING (true);
ALTER TABLE step7_exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read exams" ON step7_exams FOR SELECT USING (true);
ALTER TABLE step7_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read questions" ON step7_questions FOR SELECT USING (true);

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO intelligences (name, slug, emoji, color, description, sort_order) VALUES
('Mental', 'mental', '🧠', '#6C63FF', 'Desarrolla tu pensamiento critico y capacidad de analisis', 1),
('Fisica', 'fisica', '💪', '#F97316', 'Cuida tu cuerpo como el vehiculo de tu exito', 2),
('Emocional', 'emocional', '❤️', '#FF6B6B', 'Gestiona tus emociones y desarrolla empatia', 3),
('Social', 'social', '🤝', '#10B981', 'Construye relaciones que potencien tu crecimiento', 4),
('Espiritual', 'espiritual', '✨', '#A78BFA', 'Encuentra tu proposito y paz interior', 5),
('Financiera', 'financiera', '💰', '#D4AF37', 'Domina el lenguaje del dinero desde joven', 6),
('Tecnologica', 'tecnologica', '🚀', '#06B6D4', 'Aprovecha la tecnologia como herramienta de cambio', 7);

INSERT INTO authors (name, slug, bio, nationality) VALUES
('Robert Kiyosaki', 'robert-kiyosaki', 'Empresario, inversionista y autor del bestseller mundial Padre Rico Padre Pobre. Ha educado a millones sobre libertad financiera y mentalidad emprendedora.', 'Estados Unidos');

INSERT INTO books (title, slug, author_id, intelligence_id, description, total_chapters, estimated_duration, difficulty, is_published, is_featured) VALUES
('Padre Rico, Padre Pobre', 'padre-rico-padre-pobre',
  (SELECT id FROM authors WHERE slug = 'robert-kiyosaki'),
  (SELECT id FROM intelligences WHERE slug = 'financiera'),
  'Descubre por que los ricos no trabajan por dinero y como puedes construir tu propia libertad financiera desde joven. El libro que cambio la forma en que millones ven el dinero.',
  9, '4h 30min', 'intermedio', true, true
);

INSERT INTO step1_author_audio (book_id, title, description, audio_url, duration_seconds, transcript) VALUES
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'),
 'Conoce a Robert Kiyosaki',
 'Descubre la historia detras del autor que revoluciono la educacion financiera mundial.',
 'https://placeholder-audio.com/kiyosaki-intro.mp3',
 180,
 'Robert Kiyosaki nacio en Hilo, Hawaii, en 1947. Crecio en una familia de clase media donde su padre, un hombre muy educado, le ensenaba el camino tradicional: estudiar, sacar buenas notas y conseguir un empleo seguro. Pero Robert tambien tenia otro mentor: el padre de su mejor amigo, un empresario sin educacion formal que le ensenaba una vision completamente diferente del dinero...'
);

INSERT INTO step2_summary (book_id, title, content_html, key_points, reading_time_minutes) VALUES
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'),
 'Resumen: Padre Rico, Padre Pobre',
 '<h2>Un libro que cambio la educacion financiera</h2><p>Padre Rico, Padre Pobre cuenta la historia de Robert Kiyosaki y las lecciones financieras que aprendio de dos figuras paternas: su padre biologico (el "padre pobre"), un hombre altamente educado pero financieramente limitado, y el padre de su mejor amigo (el "padre rico"), un empresario sin educacion formal que se convirtio en uno de los hombres mas ricos de Hawaii.</p><h3>La leccion fundamental</h3><p>La diferencia entre ricos y pobres no esta en cuanto dinero ganan, sino en <strong>como piensan sobre el dinero</strong>. Los ricos adquieren activos que generan ingresos. Los pobres y la clase media adquieren pasivos pensando que son activos.</p><h3>Activos vs Pasivos</h3><p>Un <strong>activo</strong> es algo que pone dinero en tu bolsillo: inversiones, bienes raices que generan renta, negocios que funcionan sin tu presencia, regalias. Un <strong>pasivo</strong> es algo que saca dinero de tu bolsillo: la hipoteca de tu casa, el pago de tu auto, las deudas de la tarjeta de credito.</p><h3>La Carrera de la Rata</h3><p>La mayoria de las personas viven en lo que Kiyosaki llama "la carrera de la rata": trabajan mas duro para ganar mas dinero, pero cuanto mas ganan, mas gastan en pasivos, por lo que nunca logran libertad financiera. El secreto es <strong>salir de la carrera de la rata</strong> construyendo una columna de activos que genere ingresos pasivos suficientes para cubrir tus gastos.</p>',
 '["Los ricos no trabajan por dinero, hacen que el dinero trabaje para ellos", "Un activo pone dinero en tu bolsillo, un pasivo lo saca", "Tu casa no es un activo, es un pasivo", "La educacion financiera es mas importante que la educacion academica", "Atiende tu propio negocio: construye una columna de activos", "Trabaja para aprender, no por dinero"]',
 8
);

INSERT INTO step3_mindmap (book_id, title, description, mindmap_data) VALUES
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'),
 'Mapa Conceptual: Padre Rico, Padre Pobre',
 'Visualiza las ideas principales y como se conectan entre si.',
 '{"nodes":[{"id":"center","label":"Padre Rico,\nPadre Pobre","x":400,"y":300,"size":"lg","color":"#D4AF37"},{"id":"n1","label":"Los ricos no\ntrabajan por dinero","x":150,"y":150,"size":"md","color":"#6C63FF"},{"id":"n2","label":"Educacion\nFinanciera","x":650,"y":150,"size":"md","color":"#6C63FF"},{"id":"n3","label":"Activos vs\nPasivos","x":150,"y":450,"size":"md","color":"#10B981"},{"id":"n4","label":"Atiende tu\npropio negocio","x":650,"y":450,"size":"md","color":"#F97316"},{"id":"n5","label":"Carrera de\nla Rata","x":100,"y":300,"size":"sm","color":"#FF6B6B"},{"id":"n6","label":"Miedo y\nCodicia","x":250,"y":80,"size":"sm","color":"#FF6B6B"},{"id":"n7","label":"Ingresos\nPasivos","x":700,"y":300,"size":"sm","color":"#10B981"},{"id":"n8","label":"Corporaciones","x":550,"y":520,"size":"sm","color":"#A78BFA"},{"id":"n9","label":"Trabaja para\nAprender","x":400,"y":500,"size":"sm","color":"#06B6D4"}],"edges":[{"from":"center","to":"n1"},{"from":"center","to":"n2"},{"from":"center","to":"n3"},{"from":"center","to":"n4"},{"from":"n1","to":"n5"},{"from":"n1","to":"n6"},{"from":"n3","to":"n7"},{"from":"n4","to":"n8"},{"from":"center","to":"n9"}]}'
);

INSERT INTO step4_chapters (book_id, chapter_number, title, subtitle, video_url, intelligence_type, ai_context, sort_order) VALUES
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'), 1, 'La trampa del sistema tradicional', 'El sistema no te ensena a ser libre, te entrena para obedecer.', 'https://placeholder-video.com/ch1', 'financiera', 'Este capitulo trata sobre como el sistema educativo tradicional prepara a las personas para ser empleados, no emprendedores. El "Padre Pobre" representa la mentalidad de estudiar, conseguir un empleo estable, y trabajar por dinero. El "Padre Rico" representa la mentalidad de hacer que el dinero trabaje para ti. Conceptos clave: carrera de la rata, activos vs pasivos, educacion financiera vs educacion tradicional.', 1),
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'), 2, 'Los ricos no trabajan por dinero', 'El dinero es una ilusion, tan falso como esa zanahoria frente al burro.', 'https://placeholder-video.com/ch2', 'financiera', 'Este capitulo explica la primera leccion del Padre Rico: los ricos no trabajan por dinero, hacen que el dinero trabaje para ellos. Se explora el miedo al no tener dinero, la codicia, y como estas emociones controlan a la mayoria.', 2),
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'), 3, 'La importancia de la educacion financiera', 'No importa cuanto dinero ganes, sino cuanto conserves.', 'https://placeholder-video.com/ch3', 'mental', 'Este capitulo introduce el concepto de alfabetizacion financiera. La diferencia entre un activo y un pasivo. Los ricos adquieren activos, los pobres adquieren pasivos pensando que son activos.', 3),
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'), 4, 'Atiende tu propio negocio', 'Tu profesion no es tu negocio.', 'https://placeholder-video.com/ch4', 'financiera', 'La diferencia entre profesion y negocio. McDonalds no esta en el negocio de hamburguesas, esta en el negocio de bienes raices. Construir una columna de activos.', 4),
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'), 5, 'La historia de los impuestos', 'Los ricos inventan el dinero.', 'https://placeholder-video.com/ch5', 'financiera', 'Como los ricos usan las corporaciones para proteger su dinero. El poder de las corporaciones. Entender impuestos, legislacion y contabilidad.', 5),
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'), 6, 'Trabaja para aprender, no por dinero', 'Controla el flujo del efectivo.', 'https://placeholder-video.com/ch6', 'mental', 'El estado financiero personal: los pobres tienen flujo INGRESOS a GASTOS. Los ricos tienen flujo INGRESOS a ACTIVOS a mas INGRESOS. La importancia de las habilidades de ventas y comunicacion.', 6),
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'), 7, 'Practica antes de arriesgar', 'Los ricos practican con juegos. Los pobres practican con su vida.', 'https://placeholder-video.com/ch7', 'mental', 'Superar los obstaculos: miedo, cinismo, pereza, malos habitos y arrogancia. La importancia de practicar con simulaciones antes de arriesgar dinero real.', 7),
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'), 8, 'Como empezar', 'Encuentra una razon mas grande que la realidad.', 'https://placeholder-video.com/ch8', 'emocional', 'Los 10 pasos para despertar tu genio financiero interior. El poder de dar. Encontrar tu "por que" personal que te motive a actuar.', 8),
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'), 9, 'Aun quieres mas', 'Deja de hacer lo que no funciona y busca algo nuevo.', 'https://placeholder-video.com/ch9', 'social', 'Acciones concretas para empezar: deja de hacer lo que no funciona, busca nuevas ideas, encuentra a alguien que ya lo haya hecho, toma cursos y seminarios, haz muchas ofertas.', 9);

INSERT INTO step5_podcast (book_id, title, description, video_url, duration_seconds, speakers) VALUES
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'),
 'Expertos hablan sobre Padre Rico, Padre Pobre',
 'Un panel de expertos analiza las lecciones mas importantes del libro y como aplicarlas en la vida real.',
 'https://placeholder-video.com/podcast-prpp',
 2400,
 '[{"name":"Carlos Munoz","role":"Empresario e inversionista","photo":""},{"name":"Sofia Ramirez","role":"Educadora financiera","photo":""},{"name":"Diego Torres","role":"Coach de negocios","photo":""}]'
);

INSERT INTO step7_exams (book_id, title, description, passing_score, total_questions) VALUES
((SELECT id FROM books WHERE slug = 'padre-rico-padre-pobre'),
 'Examen Final: Padre Rico, Padre Pobre',
 'Demuestra lo que aprendiste sobre libertad financiera y mentalidad emprendedora.',
 70, 5
);

INSERT INTO step7_questions (exam_id, question_text, options, explanation, sort_order) VALUES
((SELECT id FROM step7_exams LIMIT 1), 'Cual es la principal diferencia entre un activo y un pasivo segun Kiyosaki?', '[{"id":"a","text":"Un activo es mas caro que un pasivo","is_correct":false},{"id":"b","text":"Un activo pone dinero en tu bolsillo, un pasivo lo saca","is_correct":true},{"id":"c","text":"Los activos son bienes raices y los pasivos son deudas","is_correct":false},{"id":"d","text":"No hay diferencia real","is_correct":false}]', 'Kiyosaki define un activo como algo que pone dinero en tu bolsillo (genera ingresos) y un pasivo como algo que saca dinero de tu bolsillo (genera gastos).', 1),
((SELECT id FROM step7_exams LIMIT 1), 'Que representa la "carrera de la rata"?', '[{"id":"a","text":"Una competencia deportiva","is_correct":false},{"id":"b","text":"El ciclo de trabajar para pagar cuentas sin construir riqueza","is_correct":true},{"id":"c","text":"Un tipo de inversion riesgosa","is_correct":false},{"id":"d","text":"El proceso de crear un negocio","is_correct":false}]', 'La carrera de la rata es el ciclo interminable de trabajar mas duro para ganar mas dinero solo para gastarlo en mas pasivos, sin nunca construir verdadera riqueza.', 2),
((SELECT id FROM step7_exams LIMIT 1), 'Cual es la primera leccion del Padre Rico?', '[{"id":"a","text":"Ahorra el 10% de tu sueldo","is_correct":false},{"id":"b","text":"Los ricos no trabajan por dinero","is_correct":true},{"id":"c","text":"Estudia una carrera universitaria","is_correct":false},{"id":"d","text":"Compra una casa lo antes posible","is_correct":false}]', 'La primera y mas fundamental leccion es que los ricos no trabajan por dinero — hacen que el dinero trabaje para ellos.', 3),
((SELECT id FROM step7_exams LIMIT 1), 'Que negocio tiene realmente McDonalds segun Kiyosaki?', '[{"id":"a","text":"Comida rapida","is_correct":false},{"id":"b","text":"Franquicias","is_correct":false},{"id":"c","text":"Bienes raices","is_correct":true},{"id":"d","text":"Marketing","is_correct":false}]', 'Kiyosaki explica que McDonalds no esta en el negocio de hamburguesas sino en el de bienes raices. Son el mayor propietario de terrenos del mundo.', 4),
((SELECT id FROM step7_exams LIMIT 1), 'Que emocion controla a la mayoria de las personas segun el Padre Rico?', '[{"id":"a","text":"La alegria","is_correct":false},{"id":"b","text":"El miedo y la codicia","is_correct":true},{"id":"c","text":"La tristeza","is_correct":false},{"id":"d","text":"El orgullo","is_correct":false}]', 'El Padre Rico ensena que el miedo a no tener dinero y la codicia por tener mas son las dos emociones que mantienen a las personas en la carrera de la rata.', 5);

-- Funcion para crear perfil automaticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
