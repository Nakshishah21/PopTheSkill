import mongoose from 'mongoose';
import { User } from './src/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users (optional - remove if you want to keep existing users)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Sample users
    const sampleUsers = [
      {
        username: 'john_developer',
        name: 'John Smith',
        email: 'john@example.com',
        picture: 'https://via.placeholder.com/150',
        skillsProficientAt: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'CSS'],
        skillsToLearn: ['Python', 'Machine Learning'],
        bio: 'Full-stack developer with 5 years of experience in web development.',
        rating: 4.5
      },
      {
        username: 'sarah_ml',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        picture: 'https://via.placeholder.com/150',
        skillsProficientAt: ['Python', 'Machine Learning', 'PyTorch', 'Deep Learning'],
        skillsToLearn: ['React', 'JavaScript'],
        bio: 'Machine learning engineer specializing in NLP and computer vision.',
        rating: 4.8
      },
      {
        username: 'mike_designer',
        name: 'Mike Wilson',
        email: 'mike@example.com',
        picture: 'https://via.placeholder.com/150',
        skillsProficientAt: ['HTML', 'CSS', 'JavaScript', 'UI/UX Design', 'Figma'],
        skillsToLearn: ['React', 'Node.js'],
        bio: 'UI/UX designer passionate about creating beautiful and functional interfaces.',
        rating: 4.2
      },
      {
        username: 'emily_fullstack',
        name: 'Emily Davis',
        email: 'emily@example.com',
        picture: 'https://via.placeholder.com/150',
        skillsProficientAt: ['React', 'Angular', 'Node.js', 'Express', 'MongoDB'],
        skillsToLearn: ['Python', 'Docker'],
        bio: 'Full-stack developer with expertise in modern web frameworks.',
        rating: 4.6
      },
      {
        username: 'alex_backend',
        name: 'Alex Brown',
        email: 'alex@example.com',
        picture: 'https://via.placeholder.com/150',
        skillsProficientAt: ['Node.js', 'Express', 'MongoDB', 'SQL', 'Python'],
        skillsToLearn: ['React', 'Vue.js'],
        bio: 'Backend developer specializing in scalable API design and database optimization.',
        rating: 4.4
      },
      {
        username: 'lisa_data',
        name: 'Lisa Anderson',
        email: 'lisa@example.com',
        picture: 'https://via.placeholder.com/150',
        skillsProficientAt: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
        skillsToLearn: ['JavaScript', 'React'],
        bio: 'Data scientist with experience in predictive modeling and data visualization.',
        rating: 4.7
      },
      {
        username: 'david_mobile',
        name: 'David Lee',
        email: 'david@example.com',
        picture: 'https://via.placeholder.com/150',
        skillsProficientAt: ['JavaScript', 'React Native', 'iOS', 'Android', 'Flutter'],
        skillsToLearn: ['Machine Learning', 'Python'],
        bio: 'Mobile app developer with experience in cross-platform development.',
        rating: 4.3
      },
      {
        username: 'julia_devops',
        name: 'Julia Martinez',
        email: 'julia@example.com',
        picture: 'https://via.placeholder.com/150',
        skillsProficientAt: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux'],
        skillsToLearn: ['React', 'Node.js'],
        bio: 'DevOps engineer focused on automation and cloud infrastructure.',
        rating: 4.5
      }
    ];

    // Insert sample users
    await User.insertMany(sampleUsers);
    console.log('Sample users created successfully!');

    // Verify users were created
    const userCount = await User.countDocuments();
    console.log(`Total users in database: ${userCount}`);

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedUsers();
