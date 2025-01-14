-- Profil tablosuna yeni sosyal medya alanları ekle
ALTER TABLE profiles
ADD COLUMN twitter_url TEXT,
ADD COLUMN linkedin_url TEXT,
ADD COLUMN custom_avatar_url TEXT; 