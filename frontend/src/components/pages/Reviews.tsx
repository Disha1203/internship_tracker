import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Star, BookOpen, MessageSquare } from 'lucide-react';
import React from 'react';

interface Review {
  id: number;
  alumniName: string;
  company: string;
  position: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  content: string;
  tips: string[];
  date: string;
}

const Reviews = () => {
  const reviews: Review[] = [
    {
      id: 1,
      alumniName: 'Rohit Verma',
      company: 'Google',
      position: 'Software Engineering Intern',
      difficulty: 'Hard',
      rating: 5,
      content: 'The interview process was challenging but fair. Focus heavily on data structures and algorithms. Practice on LeetCode extensively, especially medium to hard problems.',
      tips: [
        'Master array, string, and tree problems',
        'Practice system design basics',
        'Be ready to explain your thought process clearly',
        'Time complexity analysis is crucial'
      ],
      date: '2024-09-15'
    },
    {
      id: 2,
      alumniName: 'Aditya Rao',
      company: 'Goldman Sachs',
      position: 'Analyst Internship',
      difficulty: 'Medium',
      rating: 4,
      content: 'The interview focused on financial concepts, probability, and mental math. They also tested coding skills but not as intensively as tech companies.',
      tips: [
        'Brush up on probability and statistics',
        'Practice mental math calculations',
        'Understand basic financial instruments',
        'Be prepared for behavioral questions'
      ],
      date: '2024-08-22'
    },
    {
      id: 3,
      alumniName: 'Sanjay Kulkarni',
      company: 'McKinsey & Company',
      position: 'Business Analyst Intern',
      difficulty: 'Hard',
      rating: 5,
      content: 'Case interviews are the core of the process. Practice structuring problems, doing quick calculations, and presenting solutions clearly. Mock interviews are essential.',
      tips: [
        'Practice 20+ case studies',
        'Work on business frameworks (Porter\'s 5 Forces, etc.)',
        'Improve mental math speed',
        'Focus on structured communication'
      ],
      date: '2024-09-01'
    },
    {
      id: 4,
      alumniName: 'Kavya Menon',
      company: 'Amazon',
      position: 'SDE-1',
      difficulty: 'Medium',
      rating: 4,
      content: 'Amazon focuses on their Leadership Principles. Every answer should align with these. Technical rounds were standard DSA with focus on optimization and edge cases.',
      tips: [
        'Study all 16 Leadership Principles with examples',
        'Practice explaining solutions step-by-step',
        'Focus on array and string manipulation',
        'Always consider edge cases'
      ],
      date: '2024-07-10'
    },
    {
      id: 5,
      alumniName: 'Aryan Joshi',
      company: 'Uber',
      position: 'Data Science Intern',
      difficulty: 'Medium',
      rating: 4,
      content: 'The interview tested ML fundamentals, statistics, and SQL. They gave a practical problem to solve using data analysis. Python coding was also evaluated.',
      tips: [
        'Strong foundation in statistics and probability',
        'Practice SQL queries (joins, aggregations)',
        'Review ML algorithms and when to use them',
        'Be ready to work through a data problem live'
      ],
      date: '2024-08-05'
    },
    {
      id: 6,
      alumniName: 'Varun Kapoor',
      company: 'Adobe',
      position: 'UX Design Intern',
      difficulty: 'Medium',
      rating: 5,
      content: 'Portfolio review is critical. Be ready to walk through your design process, decisions, and iterations. They also gave a design challenge to complete in a week.',
      tips: [
        'Have a strong portfolio with 3-4 detailed case studies',
        'Practice explaining your design thinking',
        'Know UX principles and research methods',
        'Be prepared for a take-home design assignment'
      ],
      date: '2024-09-20'
    },
    {
      id: 7,
      alumniName: 'Meera Nair',
      company: 'Microsoft',
      position: 'Product Manager',
      difficulty: 'Hard',
      rating: 5,
      content: 'The process included product design, strategy, and technical questions. They want to see how you think about building products and prioritizing features.',
      tips: [
        'Practice product design questions (design X for Y)',
        'Understand metrics and A/B testing',
        'Know basic SQL and technical concepts',
        'Study Microsoft products and their strategy'
      ],
      date: '2024-06-18'
    },
    {
      id: 8,
      alumniName: 'Pooja Reddy',
      company: 'Deloitte',
      position: 'Consulting Analyst',
      difficulty: 'Easy',
      rating: 3,
      content: 'Relatively straightforward interview focused on problem-solving and communication. They want to see analytical thinking and ability to work in teams.',
      tips: [
        'Practice basic case studies',
        'Prepare good examples for behavioral questions',
        'Show enthusiasm and eagerness to learn',
        'Research Deloitte\'s service lines'
      ],
      date: '2024-08-30'
    },
  ];

  const getDifficultyColor = (difficulty: Review['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'Medium':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'Hard':
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <MessageSquare className="h-6 w-6 text-orange-600" />
            <h1 className="text-gray-900">Interview Reviews & Tips</h1>
          </div>
          <p className="text-gray-600">
            Learn from alumni experiences and get insights about specific job offers and interview processes
          </p>
        </div>

        <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">How to Use These Reviews</h3>
                <p className="text-sm text-gray-600">
                  These reviews are written by alumni who successfully went through the interview process. 
                  Use them to understand what to expect, what to prepare, and how to approach each company's 
                  hiring process. Remember that processes can change, so always verify with recent updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {reviews.map((review, index) => {
            const colors = [
              'from-blue-400 to-blue-600',
              'from-green-400 to-green-600',
              'from-purple-400 to-purple-600',
              'from-orange-400 to-orange-600',
              'from-pink-400 to-pink-600',
              'from-indigo-400 to-indigo-600',
            ];
            const colorClass = colors[index % colors.length];
            
            return (
              <Card key={review.id} className="border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className={`h-12 w-12 bg-gradient-to-br ${colorClass}`}>
                        <AvatarFallback className="text-white">
                          {getInitials(review.alumniName)}
                        </AvatarFallback>
                      </Avatar>
                    <div>
                      <CardTitle className="text-gray-900">{review.company}</CardTitle>
                      <CardDescription className="mt-1">{review.position}</CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getDifficultyColor(review.difficulty)}>
                          {review.difficulty}
                        </Badge>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">By {review.alumniName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-900 mb-2">Experience</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-2">Preparation Tips</h4>
                    <ul className="space-y-2">
                      {review.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
