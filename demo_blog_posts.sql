-- Önce eski roadmap tabloları ve yeni sistemin tablolarını sil
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievement_badges CASCADE;
DROP TABLE IF EXISTS practice_projects CASCADE;
DROP TABLE IF EXISTS resource_links CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS roadmap_tasks CASCADE;
DROP TABLE IF EXISTS roadmap_phases CASCADE;
DROP TABLE IF EXISTS magic_skills CASCADE;
DROP TABLE IF EXISTS magic_paths CASCADE;

-- Büyü Yolları (Ana Kategoriler)
CREATE TABLE magic_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  required_level INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Büyü Yetenekleri
CREATE TABLE magic_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID REFERENCES magic_paths(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  skill_type TEXT NOT NULL CHECK (skill_type IN ('enchantment', 'conjuration', 'illusion', 'transmutation')),
  icon TEXT,
  color TEXT NOT NULL,
  required_level INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Yol Haritası Fazları
CREATE TABLE roadmap_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID REFERENCES magic_paths(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  magic_level TEXT NOT NULL CHECK (magic_level IN ('apprentice', 'adept', 'master', 'archmage')),
  spell_type TEXT NOT NULL CHECK (spell_type IN ('enchantment', 'conjuration', 'illusion', 'transmutation')),
  xp_reward INTEGER NOT NULL,
  required_level INTEGER NOT NULL DEFAULT 1,
  is_locked BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Yol Haritası Görevleri
CREATE TABLE roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase_id UUID REFERENCES roadmap_phases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'locked')),
  order_number INTEGER NOT NULL DEFAULT 1,
  task_type TEXT NOT NULL CHECK (task_type IN ('coding', 'research', 'testing', 'deployment')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('novice', 'intermediate', 'expert', 'legendary')),
  required_level INTEGER NOT NULL DEFAULT 1,
  xp_reward INTEGER NOT NULL,
  estimated_time TEXT,
  spell_components TEXT[] NOT NULL,
  key_learnings TEXT[],
  prerequisites TEXT[],
  next_steps TEXT[],
  is_optional BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Kaynaklar
CREATE TABLE resource_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES roadmap_tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'article', 'documentation', 'course')),
  is_paid BOOLEAN DEFAULT false,
  duration TEXT,
  language TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pratik Projeleri
CREATE TABLE practice_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES roadmap_tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Kullanıcı İlerlemesi
CREATE TABLE user_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES roadmap_tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed', 'locked')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  earned_xp INTEGER DEFAULT 0,
  notes TEXT,
  PRIMARY KEY (user_id, task_id)
);

-- Başarı Rozetleri
CREATE TABLE achievement_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  required_xp INTEGER NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Kullanıcı Başarıları
CREATE TABLE user_achievements (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES achievement_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, badge_id)
);

-- Frontend Büyücülüğü Yol Haritası
INSERT INTO magic_paths (id, title, description, icon, color, order_number, required_level, is_active)
VALUES 
('a1b2c3d4-e5f6-4789-b123-426614174000', 'Frontend Büyücülüğü', 'Kullanıcı arayüzü büyüleriyle muhteşem deneyimler yarat', 'wand-sparkles', '#8B5CF6', 1, 1, true);

-- İleri Seviye Frontend Fazları
INSERT INTO roadmap_phases (id, path_id, title, duration, order_number, magic_level, spell_type, xp_reward, required_level, is_locked)
VALUES
-- Modern Framework Büyüleri
('d5e6f7a8-b9c0-4789-b123-426614174020', 'a1b2c3d4-e5f6-4789-b123-426614174000', 
'Modern Framework Büyüleri', '8 Hafta', 4, 'adept', 'conjuration', 3500, 3, true),

-- State Management & Testing
('e6f7a8b9-c0d1-4789-b123-426614174021', 'a1b2c3d4-e5f6-4789-b123-426614174000', 
'Durum Yönetimi ve Test Büyüleri', '6 Hafta', 5, 'master', 'transmutation', 4000, 4, true),

-- Performance & Optimization
('f7a8b9c0-d1e2-4789-b123-426614174022', 'a1b2c3d4-e5f6-4789-b123-426614174000', 
'Performans ve Optimizasyon Ritüelleri', '4 Hafta', 6, 'archmage', 'illusion', 5000, 5, true);

-- Modern Framework Görevleri
INSERT INTO roadmap_tasks (
    id, phase_id, title, description, status, task_type, difficulty,
    spell_components, required_level, xp_reward, estimated_time,
    key_learnings, prerequisites, next_steps, order_number
)
VALUES
-- React Temelleri
('a8b9c0d1-e2f3-4789-b123-426614174023', 'd5e6f7a8-b9c0-4789-b123-426614174020',
'React Büyü Çemberi', 
'Modern web büyücülüğünün en popüler framework\'ü React\'ı öğren.',
'locked', 'coding', 'intermediate',
ARRAY['React', 'JSX', 'Components', 'Props', 'State'],
3, 600, '2 Hafta',
ARRAY[
    'Component yaşam döngüsü',
    'Hooks sistemi',
    'Props ve State yönetimi',
    'Context API kullanımı',
    'Custom Hook yazımı'
],
ARRAY['a7b8c9d0-e1f2-4789-b123-426614174006']::text[],
ARRAY['b9c0d1e2-f3a4-4789-b123-426614174024']::text[],
1
),

-- Vue.js
('b9c0d1e2-f3a4-4789-b123-426614174024', 'd5e6f7a8-b9c0-4789-b123-426614174020',
'Vue.js Enerji Akışı',
'Progressive framework Vue.js ile reaktif uygulamalar geliştir.',
'locked', 'coding', 'intermediate',
ARRAY['Vue.js', 'Vue CLI', 'Composition API', 'Vue Router'],
3, 600, '2 Hafta',
ARRAY[
    'Vue.js temel konseptler',
    'Composition API kullanımı',
    'Vue Router ile sayfa yönetimi',
    'Vuex store yönetimi',
    'Vue DevTools kullanımı'
],
ARRAY['a8b9c0d1-e2f3-4789-b123-426614174023']::text[],
ARRAY['c0d1e2f3-a4b5-4789-b123-426614174025']::text[],
2
),

-- State Management
('c0d1e2f3-a4b5-4789-b123-426614174025', 'e6f7a8b9-c0d1-4789-b123-426614174021',
'Redux & Zustand Büyüleri',
'Karmaşık durum yönetimi için modern çözümler öğren.',
'locked', 'coding', 'expert',
ARRAY['Redux', 'Redux Toolkit', 'Zustand', 'State Machines'],
4, 800, '2 Hafta',
ARRAY[
    'Redux temel prensipleri',
    'Redux Toolkit ile modern Redux',
    'Zustand ile basit state yönetimi',
    'State Machine konseptleri',
    'Middleware kullanımı'
],
ARRAY['b9c0d1e2-f3a4-4789-b123-426614174024']::text[],
ARRAY['d1e2f3a4-b5c6-4789-b123-426614174026']::text[],
1
),

-- Testing
('d1e2f3a4-b5c6-4789-b123-426614174026', 'e6f7a8b9-c0d1-4789-b123-426614174021',
'Test Büyüleri',
'Modern test yaklaşımları ve araçlarını öğren.',
'locked', 'testing', 'expert',
ARRAY['Jest', 'React Testing Library', 'Cypress', 'Vitest'],
4, 700, '2 Hafta',
ARRAY[
    'Unit test yazımı',
    'Integration testleri',
    'E2E test senaryoları',
    'Test Driven Development',
    'Mock ve Stub kullanımı'
],
ARRAY['c0d1e2f3-a4b5-4789-b123-426614174025']::text[],
ARRAY['e2f3a4b5-c6d7-4789-b123-426614174027']::text[],
2
),

-- Performance
('e2f3a4b5-c6d7-4789-b123-426614174027', 'f7a8b9c0-d1e2-4789-b123-426614174022',
'Performans Büyüleri',
'Web uygulamalarını optimize etmeyi öğren.',
'locked', 'coding', 'legendary',
ARRAY['Web Vitals', 'Lighthouse', 'Bundle Analysis', 'Code Splitting'],
5, 1000, '2 Hafta',
ARRAY[
    'Core Web Vitals optimizasyonu',
    'Bundle size optimizasyonu',
    'Code splitting teknikleri',
    'Lazy loading implementasyonu',
    'Cache stratejileri'
],
ARRAY['d1e2f3a4-b5c6-4789-b123-426614174026']::text[],
ARRAY['f3a4b5c6-d7e8-4789-b123-426614174028']::text[],
1
),

-- PWA & Modern Web APIs
('f3a4b5c6-d7e8-4789-b123-426614174028', 'f7a8b9c0-d1e2-4789-b123-426614174022',
'Modern Web Büyüleri',
'PWA ve modern web API\'lerini keşfet.',
'locked', 'coding', 'legendary',
ARRAY['PWA', 'Service Workers', 'Web Workers', 'WebAssembly'],
5, 1000, '2 Hafta',
ARRAY[
    'Progressive Web App geliştirme',
    'Service Worker implementasyonu',
    'Offline first yaklaşımı',
    'Web Workers ile performans',
    'Modern Web API\'leri'
],
ARRAY['e2f3a4b5-c6d7-4789-b123-426614174027']::text[],
ARRAY[]::text[],
2
);

-- Yeni Kaynaklar
INSERT INTO resource_links (id, task_id, title, url, type, is_paid, duration, language)
VALUES
-- React Kaynakları
('f4a5b6c7-d8e9-4789-b123-426614174029', 'a8b9c0d1-e2f3-4789-b123-426614174023', 
'React Resmi Dokümantasyon', 'https://react.dev', 'documentation', false, null, 'en'),
('a5b6c7d8-e9f0-4789-b123-426614174030', 'a8b9c0d1-e2f3-4789-b123-426614174023', 
'Kablosuz Kedi - React', 'https://www.youtube.com/watch?v=qb6sMTeyLJY', 'video', false, '20 saat', 'tr'),

-- Vue Kaynakları
('b6c7d8e9-f0a1-4789-b123-426614174031', 'b9c0d1e2-f3a4-4789-b123-426614174024', 
'Vue.js Resmi Dokümantasyon', 'https://vuejs.org', 'documentation', false, null, 'en'),
('c7d8e9f0-a1b2-4789-b123-426614174032', 'b9c0d1e2-f3a4-4789-b123-426614174024', 
'Gökhan Kandemir - Vue', 'https://www.udemy.com/course/sifirdan-ileri-seviye-vuejs-2-vuex-vue-router/', 'course', true, '35 saat', 'tr'),

-- Redux & Testing Kaynakları
('d8e9f0a1-b2c3-4789-b123-426614174033', 'c0d1e2f3-a4b5-4789-b123-426614174025', 
'Redux Toolkit Rehberi', 'https://redux-toolkit.js.org', 'documentation', false, null, 'en'),
('e9f0a1b2-c3d4-4789-b123-426614174034', 'd1e2f3a4-b5c6-4789-b123-426614174026', 
'Testing Library', 'https://testing-library.com', 'documentation', false, null, 'en');

-- Yeni Pratik Projeleri
INSERT INTO practice_projects (id, task_id, title, description, difficulty, github_url)
VALUES
-- React Projesi
('f0a1b2c3-d4e5-4789-b123-426614174035', 'a8b9c0d1-e2f3-4789-b123-426614174023', 
'Büyücü Akademisi Dashboard', 
'React ve modern hooks kullanarak büyücü akademisi için bir dashboard uygulaması geliştir.',
'hard', 'https://github.com/example/wizard-academy-dashboard'),

-- Vue Projesi
('a1b2c3d4-e5f6-4789-b123-426614174036', 'b9c0d1e2-f3a4-4789-b123-426614174024', 
'Büyü Kütüphanesi', 
'Vue.js ile büyü tarifleri ve malzemelerini yönetebileceğin bir kütüphane uygulaması geliştir.',
'medium', 'https://github.com/example/spell-library'),

-- Testing Projesi
('b2c3d4e5-f6a7-4789-b123-426614174037', 'd1e2f3a4-b5c6-4789-b123-426614174026', 
'Test Büyüleri Lab', 
'Farklı test türlerini uygulayabileceğin bir test laboratuvarı projesi geliştir.',
'hard', 'https://github.com/example/test-spells-lab');

-- Başarı Rozetleri için örnek veriler
INSERT INTO achievement_badges (id, title, description, icon, color, required_xp, rarity)
VALUES 
-- Temel Rozetler
('b1c2d3e4-f5a6-4789-b123-426614174100', 
'Çaylak Büyücü', 
'İlk büyü yolculuğuna başladın!', 
'sparkles', 
'#4ADE80', 
100, 
'common'),

('c2d3e4f5-a6b7-4789-b123-426614174101', 
'Kod Gezgini', 
'5 farklı görevi tamamladın!', 
'rocket', 
'#60A5FA', 
500, 
'common'),

-- Orta Seviye Rozetler
('d3e4f5a6-b7c8-4789-b123-426614174102', 
'Framework Ustası', 
'Bir framework yolunu tamamen bitirdin!', 
'wand', 
'#F472B6', 
2000, 
'rare'),

('e4f5a6b7-c8d9-4789-b123-426614174103', 
'Test Büyücüsü', 
'100 test vakasını başarıyla geçtin!', 
'beaker', 
'#A78BFA', 
3000, 
'rare'),

-- İleri Seviye Rozetler
('f5a6b7c8-d9e0-4789-b123-426614174104', 
'Performans Sihirbazı', 
'Lighthouse puanını 95+ yaptın!', 
'lightning-bolt', 
'#FBBF24', 
5000, 
'epic'),

('a6b7c8d9-e0f1-4789-b123-426614174105', 
'Kodun Efendisi', 
'Tüm yolları tamamladın!', 
'crown', 
'#F472B6', 
10000, 
'legendary'); 