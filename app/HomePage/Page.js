"use client"
import { useState } from 'react';
import { BookOpen, GraduationCap, User } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import {  FeatureCard } from '../../components/common/FeatureCard';

const HomePage = ({ onNavigate }) => {
  const [isDark, setIsDark] = useState(true);

  const features = [
    {
      icon: BookOpen,
      title: "Islamic Studies",
      description: "Comprehensive Islamic education",
      colorClass: isDark ? 'bg-blue-600' : 'bg-blue-500'
    },
    {
      icon: GraduationCap,
      title: "Arabic Language",
      description: "Master the language of the Quran",
      colorClass: isDark ? 'bg-green-600' : 'bg-green-500'
    },
    {
      icon: User,
      title: "Digital Management",
      description: "Modern student management system",
      colorClass: isDark ? 'bg-purple-600' : 'bg-purple-500'
    }
  ];

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    } transition-colors duration-500`}>
      
      <Header
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        instituteName="Daarul Muhmin Institute"
        arabicName="معهد دار المؤمن للدراسات العربية والإسلامية"
      />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`text-4xl mb-8 ${
            isDark ? 'text-green-400' : 'text-green-600'
          } font-arabic`}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          
          <h2 className={`text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Welcome to Daarul Muhmin Institute
          </h2>
          
          <p className={`text-xl mb-4 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Of Arabic and Islamic Studies
          </p>

          <p className={`text-2xl mb-12 ${
            isDark ? 'text-green-400' : 'text-green-600'
          } font-arabic`}>
            معهد دار المؤمن للدراسات العربية والإسلامية
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                isDark={isDark}
                {...feature}
              />
            ))}
          </div>

          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white text-lg font-bold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Access Student Portal
          </button>

          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Login or create your account to continue
          </p>
        </div>
      </main>

      <Footer
        isDark={isDark}
        copyrightText="© 2026 Daarul Muhmin Institute of Arabic and Islamic Studies. All rights reserved."
      />
    </div>
  );
};

export default HomePage;

