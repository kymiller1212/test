// Story database - 2nd grade reading level, short sentences, simple words
// Each story has: topic, title, content (broken into paragraphs), keywords, quizQuestions
const STORIES = [
  // === DINOSAURS ===
  {
    topic: "dinosaurs",
    title: "The Big T-Rex",
    icon: "🦕",
    content: [
      "The T-Rex was one of the biggest meat eaters ever. It lived a long, long time ago. No people were alive back then.",
      "T-Rex had very short arms. But its legs were big and strong. It could run fast to catch its food.",
      "Its teeth were as big as bananas! It had more than 50 teeth. When one fell out, a new one grew in.",
      "T-Rex babies were small and may have had fuzzy feathers. They grew up to be 40 feet long. That is as long as a school bus!"
    ],
    words: ["T-Rex", "meat", "alive", "arms", "teeth", "bananas", "feathers", "school bus"],
    quiz: [
      { q: "What kind of eater was the T-Rex?", choices: ["Meat eater", "Plant eater", "Fish eater"], answer: 0 },
      { q: "How big were its teeth?", choices: ["As big as grapes", "As big as bananas", "As big as apples"], answer: 1 },
      { q: "How long was a grown T-Rex?", choices: ["10 feet", "20 feet", "40 feet"], answer: 2 }
    ]
  },
  {
    topic: "dinosaurs",
    title: "Plant-Eating Giants",
    icon: "🦕",
    content: [
      "Not all dinosaurs ate meat. Many of them ate only plants. These dinosaurs were very big and gentle.",
      "The Brontosaurus had a very long neck. It used its neck to reach leaves high up in trees. It ate all day long.",
      "The Triceratops had three horns on its head. It also had a big bony frill. The horns helped keep it safe from other dinosaurs.",
      "The Stegosaurus had big plates on its back. It also had spikes on its tail. It was slow but could protect itself well."
    ],
    words: ["plants", "gentle", "neck", "leaves", "horns", "frill", "plates", "spikes"],
    quiz: [
      { q: "What did plant-eating dinosaurs eat?", choices: ["Meat", "Fish", "Plants"], answer: 2 },
      { q: "How many horns did Triceratops have?", choices: ["One", "Two", "Three"], answer: 2 },
      { q: "What did Stegosaurus have on its back?", choices: ["Wings", "Plates", "Fur"], answer: 1 }
    ]
  },
  {
    topic: "dinosaurs",
    title: "Digging Up Dinosaur Bones",
    icon: "🦴",
    content: [
      "How do we know about dinosaurs? We find their bones in the ground. People who dig up old bones are called paleontologists.",
      "They use small brushes and tools. They must be very careful. The bones are old and can break easily.",
      "Sometimes they find a whole skeleton. Other times they find just one bone or a tooth. Every piece helps us learn.",
      "Some bones are in museums now. You can go see them! They are put together to show what the dinosaur looked like."
    ],
    words: ["bones", "paleontologists", "brushes", "careful", "skeleton", "tooth", "museums", "together"],
    quiz: [
      { q: "What do paleontologists dig up?", choices: ["Gold", "Old bones", "Rocks"], answer: 1 },
      { q: "Why must they be careful?", choices: ["Bones can break", "It is dark", "It is cold"], answer: 0 },
      { q: "Where can you see dinosaur bones?", choices: ["At the park", "At a museum", "At school"], answer: 1 }
    ]
  },

  // === SPACE ===
  {
    topic: "space",
    title: "Our Sun and Stars",
    icon: "⭐",
    content: [
      "The Sun is a star. It is the closest star to Earth. It gives us light and heat every day.",
      "The Sun is very, very hot. It is made of burning gas. You should never look right at it.",
      "At night, we can see many other stars. They look tiny because they are so far away. But they are really very big.",
      "Some stars are even bigger than our Sun! Stars can be red, blue, white, or yellow. Our Sun is a yellow star."
    ],
    words: ["Sun", "star", "Earth", "light", "heat", "gas", "tiny", "yellow"],
    quiz: [
      { q: "What is the Sun?", choices: ["A planet", "A star", "A moon"], answer: 1 },
      { q: "Why do other stars look tiny?", choices: ["They are small", "They are far away", "They are cold"], answer: 1 },
      { q: "What color is our Sun?", choices: ["Red", "Blue", "Yellow"], answer: 2 }
    ]
  },
  {
    topic: "space",
    title: "The Moon",
    icon: "🌙",
    content: [
      "The Moon goes around the Earth. It takes about one month to go all the way around. We can see it at night.",
      "The Moon does not make its own light. It shines because the Sun's light bounces off it. That is why it glows.",
      "Sometimes the Moon looks round and full. Other times it looks like a thin sliver. These shapes are called phases.",
      "People have walked on the Moon! They wore special suits. They found that the Moon is covered in dust and rocks."
    ],
    words: ["Moon", "month", "shines", "bounces", "glows", "round", "phases", "dust"],
    quiz: [
      { q: "What does the Moon go around?", choices: ["The Sun", "The Earth", "Mars"], answer: 1 },
      { q: "Why does the Moon shine?", choices: ["It makes light", "Sunlight bounces off it", "It is on fire"], answer: 1 },
      { q: "What is on the Moon?", choices: ["Water", "Trees", "Dust and rocks"], answer: 2 }
    ]
  },
  {
    topic: "space",
    title: "The Planets",
    icon: "🪐",
    content: [
      "There are eight planets that go around our Sun. Earth is one of them. We live on the third planet from the Sun.",
      "Mercury and Venus are closer to the Sun than Earth. They are very hot. Mars is a little farther away and is very cold.",
      "Jupiter is the biggest planet. It is so big that all the other planets could fit inside it! It has a big red spot that is a giant storm.",
      "Saturn has beautiful rings around it. The rings are made of ice and rock. Neptune is the farthest planet and is very blue."
    ],
    words: ["planets", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "rings", "Neptune"],
    quiz: [
      { q: "How many planets go around our Sun?", choices: ["Six", "Eight", "Ten"], answer: 1 },
      { q: "Which is the biggest planet?", choices: ["Earth", "Saturn", "Jupiter"], answer: 2 },
      { q: "What are Saturn's rings made of?", choices: ["Gas", "Ice and rock", "Water"], answer: 1 }
    ]
  },

  // === ANIMALS ===
  {
    topic: "animals",
    title: "Dogs Are Great Pets",
    icon: "🐕",
    content: [
      "Dogs are one of the most popular pets in the world. They love to play and be with people. Dogs are very loyal.",
      "There are many kinds of dogs. Some are big, like Great Danes. Some are small, like Chihuahuas. Each kind is called a breed.",
      "Dogs can learn tricks. You can teach them to sit, stay, and shake hands. They learn best with treats and kind words.",
      "Dogs need walks every day. They also need fresh water and good food. If you take care of a dog, it will be your best friend."
    ],
    words: ["popular", "loyal", "breed", "tricks", "treats", "walks", "fresh", "friend"],
    quiz: [
      { q: "What are dogs known for being?", choices: ["Lazy", "Loyal", "Loud"], answer: 1 },
      { q: "What is a kind of dog called?", choices: ["A type", "A breed", "A pack"], answer: 1 },
      { q: "What do dogs need every day?", choices: ["Baths", "Walks", "Toys"], answer: 1 }
    ]
  },
  {
    topic: "animals",
    title: "Life in the Ocean",
    icon: "🐠",
    content: [
      "The ocean is home to many animals. Fish, whales, dolphins, and sharks all live in the sea. So do tiny creatures you cannot even see!",
      "Dolphins are very smart. They talk to each other with clicks and whistles. They love to jump out of the water and play.",
      "Sea turtles are amazing swimmers. They can swim very far across the ocean. Mother turtles lay their eggs on sandy beaches.",
      "Coral reefs are like underwater cities. Many colorful fish live near them. We need to keep the ocean clean so these animals stay safe."
    ],
    words: ["ocean", "dolphins", "sharks", "clicks", "whistles", "turtles", "coral", "reefs"],
    quiz: [
      { q: "How do dolphins talk to each other?", choices: ["By singing", "With clicks and whistles", "By waving"], answer: 1 },
      { q: "Where do sea turtles lay eggs?", choices: ["In the water", "On sandy beaches", "In caves"], answer: 1 },
      { q: "What are coral reefs like?", choices: ["Mountains", "Underwater cities", "Forests"], answer: 1 }
    ]
  },
  {
    topic: "animals",
    title: "Amazing Cats",
    icon: "🐱",
    content: [
      "Cats are soft and furry pets. They love to sleep in warm spots. A cat can sleep up to 16 hours a day!",
      "Cats can see very well in the dark. Their eyes get big to let in more light. This helps them hunt at night.",
      "A cat's whiskers help it feel things around it. The whiskers can tell if a space is too small to fit through. They are like rulers!",
      "Cats purr when they are happy. The soft rumble sound is very calming. Petting a cat can make you feel happy too."
    ],
    words: ["furry", "sleep", "dark", "whiskers", "space", "rulers", "purr", "calming"],
    quiz: [
      { q: "How many hours can a cat sleep?", choices: ["8 hours", "12 hours", "16 hours"], answer: 2 },
      { q: "What helps a cat feel things around it?", choices: ["Its tail", "Its whiskers", "Its paws"], answer: 1 },
      { q: "What do cats do when happy?", choices: ["Bark", "Purr", "Hop"], answer: 1 }
    ]
  },

  // === SPORTS ===
  {
    topic: "sports",
    title: "Playing Soccer",
    icon: "⚽",
    content: [
      "Soccer is played all over the world. Two teams try to kick a ball into a goal. The team with the most goals wins.",
      "You can use your feet, head, and chest in soccer. But you cannot use your hands! Only the goalie can touch the ball with their hands.",
      "Running is a big part of soccer. Players run up and down the field. They pass the ball to their teammates.",
      "Soccer is a great way to have fun and stay healthy. You can play on a team or just kick the ball with your friends."
    ],
    words: ["soccer", "teams", "goal", "goalie", "field", "pass", "teammates", "healthy"],
    quiz: [
      { q: "How do you score in soccer?", choices: ["Throw the ball", "Kick ball into the goal", "Carry the ball"], answer: 1 },
      { q: "Who can touch the ball with their hands?", choices: ["Anyone", "The goalie", "No one"], answer: 1 },
      { q: "What body parts can players use?", choices: ["Hands only", "Feet, head, and chest", "Just feet"], answer: 1 }
    ]
  },
  {
    topic: "sports",
    title: "Basketball Fun",
    icon: "🏀",
    content: [
      "Basketball is a fast and exciting sport. Players try to throw a ball through a hoop. The hoop is 10 feet high.",
      "You dribble the ball by bouncing it on the floor. You can also pass it to a teammate. Then someone shoots it at the basket.",
      "Each basket is worth two or three points. If you are close, it is two points. If you are far away, it is three points.",
      "Basketball players need to be quick. They run, jump, and spin. It is a fun way to exercise and play with friends."
    ],
    words: ["basketball", "hoop", "dribble", "bouncing", "pass", "basket", "points", "exercise"],
    quiz: [
      { q: "How high is the basketball hoop?", choices: ["8 feet", "10 feet", "12 feet"], answer: 1 },
      { q: "What is dribbling?", choices: ["Throwing the ball", "Bouncing the ball", "Kicking the ball"], answer: 1 },
      { q: "How many points for a far away shot?", choices: ["One", "Two", "Three"], answer: 2 }
    ]
  },

  // === SUPERHEROES ===
  {
    topic: "superheroes",
    title: "What Makes a Superhero?",
    icon: "🦸",
    content: [
      "Superheroes are brave people who help others. Some have special powers. Others are just very smart and strong.",
      "Many superheroes can fly. Some can lift heavy things. Others can run faster than anyone else. Their powers help them save people.",
      "Superheroes also have weaknesses. This makes them more real. Even heroes need help sometimes.",
      "You do not need powers to be a hero. Being kind, brave, and helping others makes you a hero too. Heroes are all around us!"
    ],
    words: ["brave", "powers", "strong", "lift", "save", "weaknesses", "kind", "hero"],
    quiz: [
      { q: "What do superheroes do?", choices: ["Help others", "Sleep all day", "Hide away"], answer: 0 },
      { q: "Do all superheroes have powers?", choices: ["Yes", "No, some are just smart and strong", "Only at night"], answer: 1 },
      { q: "What makes you a hero in real life?", choices: ["Having powers", "Being kind and helping others", "Being tall"], answer: 1 }
    ]
  },

  // === ROBOTS ===
  {
    topic: "robots",
    title: "Robots at Work",
    icon: "🤖",
    content: [
      "Robots are machines that can do jobs. People build them and tell them what to do. They follow a set of instructions called a program.",
      "Some robots build cars in factories. They can put parts together very fast. They do not get tired like people do.",
      "Other robots help doctors. They can hold tools very still during operations. This helps the doctor do a better job.",
      "There are even robots that clean your house! They roll around the floor and pick up dirt. Some can mow your lawn too."
    ],
    words: ["robots", "machines", "program", "factories", "doctors", "operations", "clean", "lawn"],
    quiz: [
      { q: "What tells a robot what to do?", choices: ["A book", "A program", "A whistle"], answer: 1 },
      { q: "Why are robots good in factories?", choices: ["They are funny", "They don't get tired", "They are small"], answer: 1 },
      { q: "What can some home robots do?", choices: ["Cook food", "Clean floors", "Do homework"], answer: 1 }
    ]
  },

  // === BUGS & INSECTS ===
  {
    topic: "bugs",
    title: "Busy Bees",
    icon: "🐝",
    content: [
      "Bees are very busy insects. They fly from flower to flower to collect nectar. Nectar is a sweet liquid inside flowers.",
      "Bees use the nectar to make honey. They store the honey in their hive. A hive can have thousands of bees living in it!",
      "The queen bee is the leader. She is the only one who lays eggs. Worker bees take care of the babies and the hive.",
      "Bees also help flowers grow. When they visit a flower, pollen sticks to them. They carry it to other flowers. This helps new plants grow."
    ],
    words: ["insects", "nectar", "liquid", "honey", "hive", "queen", "worker", "pollen"],
    quiz: [
      { q: "What do bees collect from flowers?", choices: ["Water", "Nectar", "Seeds"], answer: 1 },
      { q: "Who is the leader of the hive?", choices: ["Worker bee", "King bee", "Queen bee"], answer: 2 },
      { q: "How do bees help flowers?", choices: ["By watering them", "By carrying pollen", "By planting seeds"], answer: 1 }
    ]
  },
  {
    topic: "bugs",
    title: "Cool Butterflies",
    icon: "🦋",
    content: [
      "Butterflies start life as tiny eggs. A caterpillar hatches from the egg. The caterpillar eats leaves and grows bigger and bigger.",
      "Then something amazing happens. The caterpillar makes a hard shell called a chrysalis. Inside, its body changes completely.",
      "After a few weeks, a butterfly comes out! It has colorful wings. It must wait for its wings to dry before it can fly.",
      "Butterflies drink nectar from flowers using a long tongue. It works like a straw! They can taste things with their feet."
    ],
    words: ["caterpillar", "hatches", "chrysalis", "changes", "wings", "colorful", "nectar", "tongue"],
    quiz: [
      { q: "What hatches from a butterfly egg?", choices: ["A butterfly", "A caterpillar", "A moth"], answer: 1 },
      { q: "What is the hard shell called?", choices: ["A cocoon", "A chrysalis", "A nest"], answer: 1 },
      { q: "What can butterflies taste with?", choices: ["Their wings", "Their tongue", "Their feet"], answer: 2 }
    ]
  },

  // === TRUCKS & VEHICLES ===
  {
    topic: "trucks",
    title: "Big Trucks",
    icon: "🚚",
    content: [
      "Trucks are some of the biggest vehicles on the road. They carry things from place to place. Without trucks, stores would have no food or toys!",
      "A semi-truck has 18 wheels. That is a lot more than a car! The driver sits up high in a cab. Some cabs even have beds in them.",
      "Dump trucks carry dirt, sand, and rocks. They can tip their bed up to dump everything out. They help build roads and buildings.",
      "Fire trucks are special trucks. They carry water, hoses, and ladders. Firefighters ride on them to go put out fires and save people."
    ],
    words: ["vehicles", "semi-truck", "wheels", "cab", "dump", "tip", "hoses", "ladders"],
    quiz: [
      { q: "How many wheels does a semi-truck have?", choices: ["8", "12", "18"], answer: 2 },
      { q: "What do dump trucks carry?", choices: ["People", "Dirt, sand, and rocks", "Animals"], answer: 1 },
      { q: "What do fire trucks carry?", choices: ["Food", "Water and hoses", "Mail"], answer: 1 }
    ]
  },

  // === VIDEO GAMES ===
  {
    topic: "video games",
    title: "How Video Games Work",
    icon: "🎮",
    content: [
      "Video games are made by teams of people. Some people draw the art. Others write the code that makes the game work.",
      "A game starts as an idea. The team plans what the player will do. They decide on the characters, the world, and the rules.",
      "Game designers make levels for you to play. Each level gets a little harder. This keeps the game fun and exciting.",
      "You can play games on many devices. You can use a computer, a phone, or a game console. Some games let you play with friends online."
    ],
    words: ["teams", "code", "idea", "characters", "designers", "levels", "devices", "console"],
    quiz: [
      { q: "Who makes video games?", choices: ["One person", "Teams of people", "Robots"], answer: 1 },
      { q: "What happens with each level?", choices: ["It gets easier", "It stays the same", "It gets harder"], answer: 2 },
      { q: "Where can you play games?", choices: ["Only on a computer", "Only on a phone", "Computer, phone, or console"], answer: 2 }
    ]
  },

  // === WEATHER ===
  {
    topic: "weather",
    title: "Clouds and Rain",
    icon: "🌧️",
    content: [
      "Clouds are made of tiny drops of water. The drops are so small and light that they float in the air. There are many kinds of clouds.",
      "When the water drops in a cloud get big and heavy, they fall down. This is rain! Rain gives water to plants, animals, and people.",
      "Sometimes it gets very cold. Then the water drops freeze and become snow or hail. Snowflakes are tiny ice crystals. No two are the same!",
      "After it rains, you might see a rainbow. Sunlight goes through the raindrops and splits into colors. A rainbow has seven beautiful colors."
    ],
    words: ["clouds", "drops", "float", "rain", "freeze", "snowflakes", "crystals", "rainbow"],
    quiz: [
      { q: "What are clouds made of?", choices: ["Cotton", "Tiny water drops", "Smoke"], answer: 1 },
      { q: "What happens when water drops freeze?", choices: ["They become rain", "They become snow or hail", "They disappear"], answer: 1 },
      { q: "How many colors are in a rainbow?", choices: ["Five", "Seven", "Ten"], answer: 1 }
    ]
  },

  // === COOKING / FOOD ===
  {
    topic: "food",
    title: "Making Pizza",
    icon: "🍕",
    content: [
      "Pizza is a favorite food for many kids. It starts with dough. Dough is made from flour, water, yeast, and a little salt.",
      "You roll the dough flat and round. Then you spread tomato sauce on top. The sauce is made from cooked tomatoes.",
      "Next comes the cheese! Most pizza uses mozzarella cheese. It gets melty and stretchy when it is baked. Yum!",
      "You can add toppings you like. Pepperoni, mushrooms, or peppers are popular. Then the pizza goes in a hot oven until it is golden and bubbly."
    ],
    words: ["dough", "flour", "yeast", "sauce", "tomatoes", "mozzarella", "toppings", "oven"],
    quiz: [
      { q: "What is pizza dough made from?", choices: ["Sugar and butter", "Flour, water, and yeast", "Milk and eggs"], answer: 1 },
      { q: "What kind of cheese is usually on pizza?", choices: ["Cheddar", "Swiss", "Mozzarella"], answer: 2 },
      { q: "What happens to the cheese when baked?", choices: ["It turns blue", "It gets melty and stretchy", "It disappears"], answer: 1 }
    ]
  },

  // === SCIENCE ===
  {
    topic: "science",
    title: "Magnets Are Magic",
    icon: "🧲",
    content: [
      "Magnets can pull some metals toward them. This pull is called a magnetic force. It works even through paper, cloth, and water!",
      "Every magnet has two ends called poles. One is the north pole. The other is the south pole. Opposite poles pull toward each other.",
      "If you put two north poles together, they push away. Two south poles also push away. This push is called repelling.",
      "The Earth is like a giant magnet! It has a north pole and a south pole. A compass uses Earth's magnetism to show you which way is north."
    ],
    words: ["magnets", "metals", "force", "poles", "north", "south", "repelling", "compass"],
    quiz: [
      { q: "What do magnets pull toward them?", choices: ["Wood", "Some metals", "Plastic"], answer: 1 },
      { q: "What happens with two north poles?", choices: ["They stick", "They push away", "Nothing"], answer: 1 },
      { q: "What does a compass use?", choices: ["Wind", "Light", "Earth's magnetism"], answer: 2 }
    ]
  },

  // === LEGO / BUILDING ===
  {
    topic: "building",
    title: "Building with Blocks",
    icon: "🧱",
    content: [
      "Building with blocks is a great way to create things. You can make houses, towers, castles, or anything you dream up!",
      "Start with a strong base at the bottom. This holds everything up. Make it wider than the top so it does not fall over.",
      "You can stack blocks high to make a tall tower. But be careful! If you stack too many, it might wobble and fall down.",
      "The best part about building is using your imagination. There is no wrong way to build. You can always take it apart and try again."
    ],
    words: ["create", "towers", "castles", "base", "wider", "stack", "wobble", "imagination"],
    quiz: [
      { q: "What should you start with when building?", choices: ["The top", "A strong base", "The middle"], answer: 1 },
      { q: "Why should the base be wider?", choices: ["It looks cool", "So it does not fall over", "To use more blocks"], answer: 1 },
      { q: "What is the best part about building?", choices: ["Following rules", "Using your imagination", "Being fast"], answer: 1 }
    ]
  },

  // === MUSIC ===
  {
    topic: "music",
    title: "Making Music",
    icon: "🎵",
    content: [
      "Music is sounds put together in a special way. It can be fast or slow, loud or soft. Music can make you feel happy or calm.",
      "There are many ways to make music. You can sing, clap, or play an instrument. A drum, guitar, and piano are all instruments.",
      "When you tap a steady beat, that is called rhythm. Rhythm is the heartbeat of music. Try clapping along to your favorite song!",
      "Anyone can make music. You do not have to be perfect. Just have fun with it! Singing in the shower counts too."
    ],
    words: ["sounds", "instrument", "drum", "guitar", "piano", "rhythm", "beat", "singing"],
    quiz: [
      { q: "What is rhythm?", choices: ["A type of song", "A steady beat", "A loud sound"], answer: 1 },
      { q: "Which of these is an instrument?", choices: ["A book", "A guitar", "A hat"], answer: 1 },
      { q: "Who can make music?", choices: ["Only adults", "Only musicians", "Anyone"], answer: 2 }
    ]
  }
];

// Topic metadata for the topic selector
const TOPICS = [
  { id: "dinosaurs", label: "Dinosaurs", icon: "🦕", color: "#4CAF50" },
  { id: "space", label: "Space", icon: "🚀", color: "#2196F3" },
  { id: "animals", label: "Animals", icon: "🐾", color: "#FF9800" },
  { id: "sports", label: "Sports", icon: "⚽", color: "#F44336" },
  { id: "superheroes", label: "Superheroes", icon: "🦸", color: "#9C27B0" },
  { id: "robots", label: "Robots", icon: "🤖", color: "#607D8B" },
  { id: "bugs", label: "Bugs", icon: "🐛", color: "#8BC34A" },
  { id: "trucks", label: "Trucks", icon: "🚚", color: "#795548" },
  { id: "video games", label: "Video Games", icon: "🎮", color: "#E91E63" },
  { id: "weather", label: "Weather", icon: "🌤️", color: "#00BCD4" },
  { id: "food", label: "Food", icon: "🍕", color: "#FF5722" },
  { id: "science", label: "Science", icon: "🔬", color: "#3F51B5" },
  { id: "building", label: "Building", icon: "🧱", color: "#FFC107" },
  { id: "music", label: "Music", icon: "🎵", color: "#673AB7" }
];
