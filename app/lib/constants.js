/**
 * Constants: Lessons, Templates, Rules, XP, and Level Configuration
 * This is the "content brain" of the chatbot.
 */
// Level 1 Lessons 
const L1_ALPHABET = [
    {
        id: 'l1-alpha-a', level: 1, topic: 'alphabet', subtopic: 'letter_A', lesson_type: 'teach',
        content: { type: 'teach', word: 'A', example_sentence: 'A is for Apple! ', fun_fact: 'Apple starts with A! Yummy! ', phonetic: 'ay' }
    },
    {
        id: 'l1-alpha-a-q', level: 1, topic: 'alphabet', subtopic: 'letter_A', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What letter does Apple start with?', options: ['A', 'B', 'C'], answer: 'A', hint: 'A___le' }
    },
    {
        id: 'l1-alpha-b', level: 1, topic: 'alphabet', subtopic: 'letter_B', lesson_type: 'teach',
        content: { type: 'teach', word: 'B', example_sentence: 'B is for Bear! ', fun_fact: 'Bears love honey! ', phonetic: 'bee' }
    },
    {
        id: 'l1-alpha-b-q', level: 1, topic: 'alphabet', subtopic: 'letter_B', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What letter does Bear start with?', options: ['A', 'B', 'D'], answer: 'B', hint: 'B___r' }
    },
    {
        id: 'l1-alpha-c', level: 1, topic: 'alphabet', subtopic: 'letter_C', lesson_type: 'teach',
        content: { type: 'teach', word: 'C', example_sentence: 'C is for Cat! ', fun_fact: 'Cats say meow! ', phonetic: 'see' }
    },
    {
        id: 'l1-alpha-c-q', level: 1, topic: 'alphabet', subtopic: 'letter_C', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What letter does Cat start with?', options: ['B', 'C', 'D'], answer: 'C', hint: 'C___t' }
    },
    {
        id: 'l1-alpha-d', level: 1, topic: 'alphabet', subtopic: 'letter_D', lesson_type: 'teach',
        content: { type: 'teach', word: 'D', example_sentence: 'D is for Dog! ', fun_fact: 'Dogs are our best friends! ', phonetic: 'dee' }
    },
    {
        id: 'l1-alpha-d-q', level: 1, topic: 'alphabet', subtopic: 'letter_D', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What letter does Dog start with?', options: ['A', 'C', 'D'], answer: 'D', hint: 'D___g' }
    },
    {
        id: 'l1-alpha-e', level: 1, topic: 'alphabet', subtopic: 'letter_E', lesson_type: 'teach',
        content: { type: 'teach', word: 'E', example_sentence: 'E is for Elephant! ', fun_fact: 'Elephants never forget! ', phonetic: 'ee' }
    },
    {
        id: 'l1-alpha-e-q', level: 1, topic: 'alphabet', subtopic: 'letter_E', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What letter does Elephant start with?', options: ['E', 'F', 'B'], answer: 'E', hint: 'E___phant' }
    },
];
const L1_COLORS = [
    {
        id: 'l1-color-red', level: 1, topic: 'colors', subtopic: 'red', lesson_type: 'teach',
        content: { type: 'teach', word: 'Red', example_sentence: 'The apple is red! ', fun_fact: 'Fire trucks are red! ' }
    },
    {
        id: 'l1-color-red-q', level: 1, topic: 'colors', subtopic: 'red', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What color is an apple?', options: ['Red', 'Blue', 'Green'], answer: 'Red' }
    },
    {
        id: 'l1-color-blue', level: 1, topic: 'colors', subtopic: 'blue', lesson_type: 'teach',
        content: { type: 'teach', word: 'Blue', example_sentence: 'The sky is blue! ', fun_fact: 'The ocean is blue too! ' }
    },
    {
        id: 'l1-color-blue-q', level: 1, topic: 'colors', subtopic: 'blue', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What color is the sky?', options: ['Red', 'Blue', 'Yellow'], answer: 'Blue' }
    },
    {
        id: 'l1-color-green', level: 1, topic: 'colors', subtopic: 'green', lesson_type: 'teach',
        content: { type: 'teach', word: 'Green', example_sentence: 'Frogs are green! ', fun_fact: 'Trees have green leaves! ' }
    },
    {
        id: 'l1-color-green-q', level: 1, topic: 'colors', subtopic: 'green', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What color are frogs?', options: ['Green', 'Blue', 'Red'], answer: 'Green' }
    },
    {
        id: 'l1-color-yellow', level: 1, topic: 'colors', subtopic: 'yellow', lesson_type: 'teach',
        content: { type: 'teach', word: 'Yellow', example_sentence: 'The sun is yellow! ', fun_fact: 'Bananas are yellow! ' }
    },
    {
        id: 'l1-color-yellow-q', level: 1, topic: 'colors', subtopic: 'yellow', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What color is a banana?', options: ['Yellow', 'Orange', 'Red'], answer: 'Yellow' }
    },
];
const L1_NUMBERS = [
    {
        id: 'l1-num-1', level: 1, topic: 'numbers', subtopic: 'one', lesson_type: 'teach',
        content: { type: 'teach', word: 'One', example_sentence: 'I have one nose! ', fun_fact: 'You have one heart! ' }
    },
    {
        id: 'l1-num-1-q', level: 1, topic: 'numbers', subtopic: 'one', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'How many noses do you have? ', options: ['One', 'Two', 'Three'], answer: 'One', }
    },
    {
        id: 'l1-num-2', level: 1, topic: 'numbers', subtopic: 'two', lesson_type: 'teach',
        content: { type: 'teach', word: 'Two', example_sentence: 'I have two eyes! ', fun_fact: 'You have two hands! ' }
    },
    {
        id: 'l1-num-2-q', level: 1, topic: 'numbers', subtopic: 'two', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'How many eyes do you have? ', options: ['One', 'Two', 'Four'], answer: 'Two', }
    },
    {
        id: 'l1-num-3', level: 1, topic: 'numbers', subtopic: 'three', lesson_type: 'teach',
        content: { type: 'teach', word: 'Three', example_sentence: 'A triangle has three sides! ', fun_fact: 'Three little pigs! ' }
    },
    {
        id: 'l1-num-3-q', level: 1, topic: 'numbers', subtopic: 'three', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'How many sides does a triangle have? ', options: ['Two', 'Three', 'Four'], answer: 'Three', }
    },
];
const L1_SHAPES = [
    {
        id: 'l1-shape-circle', level: 1, topic: 'shapes', subtopic: 'circle', lesson_type: 'teach',
        content: { type: 'teach', word: 'Circle', example_sentence: 'The sun looks like a circle! ', fun_fact: 'Wheels are circles! ' }
    },
    {
        id: 'l1-shape-circle-q', level: 1, topic: 'shapes', subtopic: 'circle', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What shape are wheels?', options: ['Circle', 'Square', 'Triangle'], answer: 'Circle' }
    },
    {
        id: 'l1-shape-star', level: 1, topic: 'shapes', subtopic: 'star', lesson_type: 'teach',
        content: { type: 'teach', word: 'Star', example_sentence: 'Stars shine at night! ', fun_fact: 'You are a star! ' }
    },
    {
        id: 'l1-shape-star-q', level: 1, topic: 'shapes', subtopic: 'star', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'Which shape shines in the night sky?', options: ['Heart', 'Star', 'Circle'], answer: 'Star' }
    },
];
// Level 2 Lessons 
const L2_ANIMALS = [
    {
        id: 'l2-animal-cat', level: 2, topic: 'animals', subtopic: 'cat', lesson_type: 'teach',
        content: { type: 'teach', word: 'Cat', example_sentence: 'The cat says meow!', fun_fact: 'Cats can jump really high! ' }
    },
    {
        id: 'l2-animal-cat-q', level: 2, topic: 'animals', subtopic: 'cat', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What sound does a cat make? ', options: ['Meow', 'Woof', 'Moo'], answer: 'Meow', }
    },
    {
        id: 'l2-animal-dog', level: 2, topic: 'animals', subtopic: 'dog', lesson_type: 'teach',
        content: { type: 'teach', word: 'Dog', example_sentence: 'The dog says woof!', fun_fact: 'Dogs can learn tricks! ' }
    },
    {
        id: 'l2-animal-dog-q', level: 2, topic: 'animals', subtopic: 'dog', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What sound does a dog make? ', options: ['Meow', 'Woof', 'Quack'], answer: 'Woof', }
    },
    {
        id: 'l2-animal-bird', level: 2, topic: 'animals', subtopic: 'bird', lesson_type: 'teach',
        content: { type: 'teach', word: 'Bird', example_sentence: 'The bird can fly in the sky!', fun_fact: 'Birds build nests! ' }
    },
    {
        id: 'l2-animal-bird-q', level: 2, topic: 'animals', subtopic: 'bird', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'Which animal can fly? ', options: ['Dog', 'Bird', 'Fish'], answer: 'Bird', }
    },
    {
        id: 'l2-animal-fish', level: 2, topic: 'animals', subtopic: 'fish', lesson_type: 'teach',
        content: { type: 'teach', word: 'Fish', example_sentence: 'The fish swims in the water!', fun_fact: 'Fish breathe underwater! ' }
    },
    {
        id: 'l2-animal-fish-q', level: 2, topic: 'animals', subtopic: 'fish', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'Which animal swims in water? ', options: ['Bird', 'Cat', 'Fish'], answer: 'Fish', }
    },
];
const L2_FRUITS = [
    {
        id: 'l2-fruit-apple', level: 2, topic: 'fruits', subtopic: 'apple', lesson_type: 'teach',
        content: { type: 'teach', word: 'Apple', example_sentence: 'I like to eat apples!', fun_fact: 'Apples can be red, green, or yellow! ' }
    },
    {
        id: 'l2-fruit-apple-q', level: 2, topic: 'fruits', subtopic: 'apple', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'Which fruit can be red, green, or yellow?', options: ['Banana', 'Apple', 'Orange'], answer: 'Apple' }
    },
    {
        id: 'l2-fruit-banana', level: 2, topic: 'fruits', subtopic: 'banana', lesson_type: 'teach',
        content: { type: 'teach', word: 'Banana', example_sentence: 'Monkeys love bananas!', fun_fact: 'Bananas are yellow and sweet! ' }
    },
    {
        id: 'l2-fruit-banana-q', level: 2, topic: 'fruits', subtopic: 'banana', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What fruit do monkeys love? ', options: ['Apple', 'Banana', 'Grape'], answer: 'Banana', }
    },
];
const L2_GREETINGS = [
    {
        id: 'l2-greet-hello', level: 2, topic: 'greetings', subtopic: 'hello', lesson_type: 'teach',
        content: { type: 'teach', word: 'Hello', example_sentence: 'Hello! How are you?', fun_fact: 'People all around the world say hello! ' }
    },
    {
        id: 'l2-greet-hello-q', level: 2, topic: 'greetings', subtopic: 'hello', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What do you say when you meet someone? ', options: ['Goodbye', 'Hello', 'Sorry'], answer: 'Hello', }
    },
    {
        id: 'l2-greet-thanks', level: 2, topic: 'greetings', subtopic: 'thank_you', lesson_type: 'teach',
        content: { type: 'teach', word: 'Thank you', example_sentence: 'Thank you for helping me!', fun_fact: 'Saying thank you makes people happy! ' }
    },
    {
        id: 'l2-greet-thanks-q', level: 2, topic: 'greetings', subtopic: 'thank_you', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What do you say when someone helps you? ', options: ['Sorry', 'Thank you', 'Goodbye'], answer: 'Thank you', }
    },
    {
        id: 'l2-greet-bye', level: 2, topic: 'greetings', subtopic: 'goodbye', lesson_type: 'teach',
        content: { type: 'teach', word: 'Goodbye', example_sentence: 'Goodbye! See you tomorrow!', fun_fact: 'You can also say "Bye bye!" ' }
    },
    {
        id: 'l2-greet-bye-q', level: 2, topic: 'greetings', subtopic: 'goodbye', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What do you say when you leave? ', options: ['Hello', 'Goodbye', 'Please'], answer: 'Goodbye', }
    },
];
//  Level 3 Lessons 
const L3_SENTENCES = [
    {
        id: 'l3-sent-1', level: 3, topic: 'sentences', subtopic: 'intro', lesson_type: 'teach',
        content: { type: 'teach', word: 'My name is...', example_sentence: 'My name is Buddy!', fun_fact: 'Every person has a special name! ' }
    },
    {
        id: 'l3-sent-1-q', level: 3, topic: 'sentences', subtopic: 'intro', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'Complete: "My ___ is Buddy" ', options: ['name', 'cat', 'color'], answer: 'name', }
    },
    {
        id: 'l3-sent-2', level: 3, topic: 'sentences', subtopic: 'likes', lesson_type: 'teach',
        content: { type: 'teach', word: 'I like...', example_sentence: 'I like to play with my friends!', fun_fact: 'What do YOU like? Tell me! ' }
    },
    {
        id: 'l3-sent-2-q', level: 3, topic: 'sentences', subtopic: 'likes', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'Complete: "I ___ ice cream!" ', options: ['like', 'go', 'run'], answer: 'like', }
    },
];
const L3_OPPOSITES = [
    {
        id: 'l3-opp-big', level: 3, topic: 'opposites', subtopic: 'big_small', lesson_type: 'teach',
        content: { type: 'teach', word: 'Big & Small', example_sentence: 'The elephant is big, the mouse is small!', fun_fact: 'Big and small are opposites! ' }
    },
    {
        id: 'l3-opp-big-q', level: 3, topic: 'opposites', subtopic: 'big_small', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What is the opposite of BIG? ', options: ['Tall', 'Small', 'Fast'], answer: 'Small', }
    },
    {
        id: 'l3-opp-hot', level: 3, topic: 'opposites', subtopic: 'hot_cold', lesson_type: 'teach',
        content: { type: 'teach', word: 'Hot & Cold', example_sentence: 'The sun is hot, ice cream is cold!', fun_fact: 'Hot chocolate warms you up on cold days! ' }
    },
    {
        id: 'l3-opp-hot-q', level: 3, topic: 'opposites', subtopic: 'hot_cold', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What is the opposite of HOT? ', options: ['Cold', 'Warm', 'Big'], answer: 'Cold', }
    },
    {
        id: 'l3-opp-happy', level: 3, topic: 'opposites', subtopic: 'happy_sad', lesson_type: 'teach',
        content: { type: 'teach', word: 'Happy & Sad', example_sentence: 'I feel happy when I play! I feel sad when I miss my friends.', fun_fact: 'It\'s okay to feel all kinds of feelings! ' }
    },
    {
        id: 'l3-opp-happy-q', level: 3, topic: 'opposites', subtopic: 'happy_sad', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'What is the opposite of HAPPY? ', options: ['Angry', 'Sad', 'Tired'], answer: 'Sad', }
    },
];
const L3_FEELINGS = [
    {
        id: 'l3-feel-happy', level: 3, topic: 'feelings', subtopic: 'happy', lesson_type: 'teach',
        content: { type: 'teach', word: 'Happy', example_sentence: 'I feel happy when I see my friends!', fun_fact: 'Smiling makes you feel even happier! ' }
    },
    {
        id: 'l3-feel-happy-q', level: 3, topic: 'feelings', subtopic: 'happy', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'How do you feel when you play with friends? ', options: ['Happy', 'Scared', 'Sleepy'], answer: 'Happy', }
    },
    {
        id: 'l3-feel-brave', level: 3, topic: 'feelings', subtopic: 'brave', lesson_type: 'teach',
        content: { type: 'teach', word: 'Brave', example_sentence: 'I am brave like a lion!', fun_fact: 'Being brave means trying even when it\'s hard! ' }
    },
    {
        id: 'l3-feel-brave-q', level: 3, topic: 'feelings', subtopic: 'brave', lesson_type: 'quiz',
        content: { type: 'quiz', question: 'Which word means "not afraid"? ', options: ['Sad', 'Brave', 'Tired'], answer: 'Brave', }
    },
];
// All Lessons by Level 
export const LESSONS_BY_LEVEL = {
    1: [...L1_ALPHABET, ...L1_COLORS, ...L1_NUMBERS, ...L1_SHAPES],
    2: [...L2_ANIMALS, ...L2_FRUITS, ...L2_GREETINGS],
    3: [...L3_SENTENCES, ...L3_OPPOSITES, ...L3_FEELINGS],
};
export const TOPICS_BY_LEVEL = {
    1: ['alphabet', 'colors', 'numbers', 'shapes'],
    2: ['animals', 'fruits', 'greetings'],
    3: ['sentences', 'opposites', 'feelings'],
};
//  XP & Level-Up Rules
export const XP_REWARDS = {
    correct_answer: 10,
    wrong_answer_penalty: 5,
    complete_lesson: 50,
    complete_topic: 200,
    streak_bonus_3: 30,
    streak_bonus_5: 80,
    daily_login: 20,
};
export const LEVEL_UP_RULES = {
    1: { requiredTopics: 3, minAvgScore: 60, minXP: 200 },
    2: { requiredTopics: 2, minAvgScore: 65, minXP: 500 },
    3: null, 
};
//  Response Templates 
export const RESPONSE_TEMPLATES = {
    upset: {
        responses: [
            "It's okay!  Everyone makes mistakes. That's how we learn!",
            "Don't worry! Let's try something easier together. You're doing great! ",
            "Hey, it's alright! Even superheroes need practice! ",
            "Let's take a little break. Want to play a fun game instead? ",
        ],
        action: 'reduce_difficulty',
    },
    bored: {
        responses: [
            "Hey! Want to play a fun game? ",
            "Let's try something different! How about a story? ",
            "Ooh, I have a surprise! Let's play 'Guess the Animal!' ",
            "Want to see something cool? Let's learn with pictures! ",
        ],
        action: 'switch_to_game',
    },
    excited: {
        responses: [
            "WOW! You're amazing!  Let's keep going!",
            "You're on fire!  Ready for a bigger challenge?",
            "Incredible! You're such a fast learner! ",
            "Yay! High five!  Want to try the next one?",
        ],
        action: 'increase_difficulty',
    },
    conversation: {
        responses: [],
        action: 'converse',
    },
    learning: {
        responses: [],
        action: 'next_lesson',
    },
};
// Conversation Rules 
export const CONVERSATION_RULES = [
    { match: ['hi', 'hello', 'hey'], reply: "Hi there!  I'm so happy to see you! What would you like to do today?" },
    { match: ['my name is', "i'm"], reply: "What a wonderful name!  Nice to meet you! Shall we learn something fun?" },
    { match: ['how are you'], reply: "I'm great! Thanks for asking!  How are YOU feeling today?" },
    { match: ['i like'], reply: "Oh, that's so cool!  I like that too! Want to learn words about it?" },
    { match: ['what is your name', 'who are you'], reply: "I'm Buddy, your learning friend!  I love helping you learn English!" },
    { match: ['thank', 'thanks'], reply: "You're welcome!  You're doing so well! I'm proud of you!" },
    { match: ['bye', 'goodbye', 'bye bye'], reply: "Bye bye!  You did amazing today! Come back soon! " },
    { match: ['i feel', 'feeling'], reply: "Thank you for telling me how you feel!  Your feelings matter a lot!" },
    { match: ['play', 'game'], reply: "I love games too!  Let's play a learning game! Ready?" },
    { match: ['yes', 'yeah', 'okay', 'ok', 'sure'], reply: "Awesome! Let's go! " },
    { match: ['no', 'nah', 'nope'], reply: "That's okay!  We can do something else. What sounds fun?" },
    { match: [], reply: "That's interesting! Want to continue our lesson, or chat some more?" },
];

export function matchesConversationRule(text) {
    const lower = text.toLowerCase();
    return CONVERSATION_RULES.some((rule) => rule.match.some((match) => lower.includes(match)));
}

// ─── SEL Content ───────────────────────────────────────────────────
export const SEL_CONTENT = {
    comfort: [
        "It's okay! Everyone makes mistakes. That's how we learn!",
        "Don't worry! You're doing your best, and that's what matters! ",
        "Hey, it's alright! Let's try again together! ",
        "You know what? Mistakes help our brain grow! ",
    ],
    celebration: [
        "You're a SUPERSTAR!",
        "AMAZING! Look at you go!",
        "You did it! I knew you could! ",
        "WOW WOW WOW! That was incredible! ",
        "You're the best learner ever! ",
    ],
    check_in: [
        "How are you feeling right now? ",
        "Are you having fun? I hope so! ",
        "Remember, it's okay to take a break anytime! ",
    ],
    curiosity: [
        "Ooh! Ready to discover something amazing? ",
        "I have something really cool to show you! ",
        "Let's explore something new together! ",
    ],
    encouragement: [
        "You CAN do it! Let's try together! ",
        "I believe in you! ",
        "You're so brave for trying! That's awesome! ",
        "Every expert was once a beginner! Keep going! ",
    ],
};
//  Mood Configurations
export const MOOD_CONFIG = {
    happy: { greeting: "Yay! Let's learn something fun! ", sessionStyle: 'normal' },
    okay: { greeting: "Nice to see you! Let's start with something easy! ", sessionStyle: 'gentle' },
    sad: { greeting: "Hey, I'm here for you!  Want to do something fun together?", sessionStyle: 'supportive' },
    tired: { greeting: "Let's take it easy today! We can play a little game! ", sessionStyle: 'relaxed' },
    excited: { greeting: "WOOHOO! Let's go! I love your energy!", sessionStyle: 'energetic' },
};
