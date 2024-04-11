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
    <div className="flex space-x-4 p-4 bg-[#313338] overflow-x-auto">
      {stories.map((story) => (
        <div key={story.id} className="relative">
          <img
            src={story.imageUrl}
            alt={`${story.username}'s story`}
            className="h-16 w-16 rounded-full object-cover cursor-pointer"
            onClick={() => handleStoryClick(story.id)}
          />
          {selectedStory === story.id && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
              <div className="animate-spin rounded-full border-4 border-t-4 border-gradient-purple h-16 w-16"></div>
            </div>
          )}
        </div>
      ))}
      <style jsx>{`.border-gradient-purple {
          border-color: conic-gradient(from 0deg at 50% 50%, #8B5CF6 0%, #EC4899 100%);
          border-image-slice: 1;}`}</style>
    </div>
  );
}
