
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-4 md:px-8 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">About QuizMaster</h1>
            <p className="text-lg text-gray-600">
              Learn more about our mission to make learning fun and accessible to everyone.
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">Our Story</h2>
              <p className="text-gray-700 mb-4">
                QuizMaster was founded in 2023 with a simple mission: to make learning enjoyable and accessible to everyone. 
                What started as a small project by a group of trivia enthusiasts has grown into a platform used by thousands 
                of knowledge seekers around the world.
              </p>
              <p className="text-gray-700">
                Our team believes that the joy of learning comes from curiosity and engagement. That's why we've designed 
                our quizzes to be both challenging and entertaining, covering a wide range of topics from science and history 
                to pop culture and sports.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-purple-700 mb-3">Our Mission</h2>
                <p className="text-gray-700">
                  We aim to create an environment where learning becomes a fun activity rather than a chore. 
                  By combining education with entertainment, we hope to inspire curiosity and a lifelong love of learning.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-purple-700 mb-3">Our Vision</h2>
                <p className="text-gray-700">
                  We envision a world where everyone has access to engaging educational content that expands their knowledge 
                  and challenges their thinking. We strive to be the leading platform for interactive learning.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { name: 'Emma Roberts', role: 'Founder & CEO', bio: 'Trivia enthusiast with a background in educational technology.' },
              { name: 'Michael Chen', role: 'Lead Developer', bio: 'Full-stack developer passionate about creating engaging user experiences.' },
              { name: 'Sarah Johnson', role: 'Content Director', bio: 'Former teacher with expertise in curriculum development and educational content.' },
              { name: 'David Kim', role: 'UI/UX Designer', bio: 'Designer focused on creating intuitive and accessible interfaces.' },
              { name: 'Olivia Garcia', role: 'Marketing Manager', bio: 'Digital marketing specialist with experience in community building.' },
              { name: 'James Wilson', role: 'Quiz Master', bio: 'Professional quizmaster with experience writing questions for TV game shows.' }
            ].map((member, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-sm text-purple-600 mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Separator className="my-8" />
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-6">
              Have questions, suggestions, or feedback? We'd love to hear from you!
            </p>
            <a
              href="mailto:contact@quizmaster.com"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors inline-block"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
