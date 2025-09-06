import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMovieContent(title, year, sourcePlatform = '') {
  try {
    const prompt = `Generate detailed content for a movie page with the following information:
    
Title: ${title}
Year: ${year}
Source Platform: ${sourcePlatform}

Please provide a JSON response with the following structure:
{
  "description": "A compelling 2-3 paragraph description of the movie",
  "genre": ["array", "of", "genres"],
  "language": ["array", "of", "languages"],
  "isDualAudio": boolean,
  "rating": number (0-10),
  "duration": "runtime in format like '2h 30m'",
  "director": "director name",
  "cast": ["array", "of", "main", "cast"],
  "tags": ["array", "of", "relevant", "tags"],
  "category": "Bollywood|Hollywood|South|Web Series|TV Shows"
}

Make the description engaging and informative. Include relevant genres, cast information if known, and appropriate tags for filtering. Set isDualAudio to true if it's likely to have dual audio options.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a movie database expert. Generate accurate, engaging movie information in JSON format. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = completion.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating movie content:', error);
    throw new Error('Failed to generate movie content');
  }
}

export async function generateMovieTags(title, genre, category) {
  try {
    const prompt = `Generate relevant tags for a movie with:
Title: ${title}
Genre: ${genre.join(', ')}
Category: ${category}

Return an array of 8-12 relevant tags that would help users find this movie. Include quality tags (480p, 720p, 1080p), audio tags (dual audio, hindi dubbed), and content tags.

Return only a JSON array of strings.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 200
    });

    const content = completion.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating tags:', error);
    return ['480p', '720p', '1080p', 'dual audio'];
  }
}
