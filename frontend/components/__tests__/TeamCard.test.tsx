import { render, screen } from '@testing-library/react';
import TeamCard from '../TeamCard';
import { Competition, Team } from '@/types';
import { expect, test, describe } from 'vitest';

const mockCompetition: Competition = {
  _id: 'comp123',
  title: 'Cloud Hackathon',
  description: 'Building serverless apps on AWS.',
  category: 'Hackathon',
  requiredSkills: ['React', 'AWS'],
  teamSize: 4,
  deadline: new Date().toISOString(),
  createdBy: 'user123',
  status: 'Open',
  isOfficial: true,
  upvotes: 10
};

describe('TeamCard Component', () => {
  test('renders competition title and category', () => {
    render(<TeamCard item={mockCompetition} type="competition" />);
    
    expect(screen.getByText('Cloud Hackathon')).toBeInTheDocument();
    expect(screen.getByText('Hackathon')).toBeInTheDocument();
    expect(screen.getByText('Official')).toBeInTheDocument();
  });

  test('renders skills correctly', () => {
    render(<TeamCard item={mockCompetition} type="competition" />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
  });
});
