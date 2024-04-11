import { useState } from 'react';

export default function StoryBar() {
  const [selectedStory, setSelectedStory] = useState(null);

  // Dummy data for the stories
  const stories = [
    { id: 1, imageUrl: 'https://utfs.io/f/bfc27390-f1f2-4d78-ab7c-171228638f9b-8fucey.png', username: 'user1' },
    { id: 2, imageUrl: 'https://utfs.io/f/f1cc9b03-d27c-4a9d-a121-8214d665137a-nliseh.png', username: 'user2' },
    // Add more stories here
  ];

  const handleStoryClick = (storyId) => {
    setSelectedStory(storyId);
    // Here you would load the story data and then remove the loading state
    setTimeout(() => setSelectedStory(null), 3000); // Simulate loading time
  };

  return (
    <div className="flex space-x-4 p-4 bg-[#313338] border-b border-gray-200 overflow-x-auto">
      {stories.map((story) => (
        <div key={story.id} className="relative">
          <img
            src={story.imageUrl}
            alt={`${story.username}'s story`}
            className="h-16 w-16 rounded-full object-cover cursor-pointer p-1"
            onClick={() => handleStoryClick(story.id)}
          />
          {selectedStory === story.id && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <div className="animate-spin rounded-full border-4 border-t-4 border-gradient-purple h-full w-full"></div>
          </div>
          )}
        </div>
      ))}
    </div>
  );
}
