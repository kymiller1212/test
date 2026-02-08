// Story database - 2nd grade reading level, short sentences, simple words
// Each story has: topic, title, content (broken into paragraphs), keywords, quizQuestions
// level: 1 = 2nd grade reading level, level: 2 = 3rd grade reading level
const STORIES = [
  // === OHIO STATE FOOTBALL === Level 1
  {
    topic: "ohio-state",
    level: 1,
    title: "The Ohio State Buckeyes",
    icon: "🌰",
    content: [
      "Ohio State is a big football team. They play in Columbus, Ohio. Their team name is the Buckeyes.",
      "A buckeye is a type of nut. It comes from a tree that grows in Ohio. The nut is brown with a light spot. It looks like a deer's eye!",
      "Their colors are scarlet and gray. Scarlet is a deep red color. The fans wear red to every game.",
      "Ohio State plays in a huge stadium. It is called The Horseshoe. It holds over 100,000 fans. It gets very loud on game day!"
    ],
    words: ["Buckeyes", "Columbus", "scarlet", "stadium", "Horseshoe", "fans", "nut", "game day"],
    quiz: [
      { q: "What is Ohio State's team name?", choices: ["The Bears", "The Buckeyes", "The Eagles"], answer: 1 },
      { q: "What is a buckeye?", choices: ["A bird", "A type of nut", "A fish"], answer: 1 },
      { q: "What is their stadium called?", choices: ["The Horseshoe", "The Big House", "The Dome"], answer: 0 }
    ]
  },
  {
    topic: "ohio-state",
    level: 1,
    title: "Script Ohio",
    icon: "🎺",
    content: [
      "Ohio State has a famous marching band. The band plays at every home game. They are called the best damn band in the land!",
      "The band does a special trick. They march and spell out the word Ohio in cursive on the field. This is called Script Ohio.",
      "One lucky person gets to dot the i. They run out and take a big bow. The crowd goes wild every time!",
      "The band has been doing Script Ohio for a very long time. Fans love it so much. It is one of the best traditions in all of football."
    ],
    words: ["marching", "band", "cursive", "script", "dot", "bow", "crowd", "tradition"],
    quiz: [
      { q: "What does the band spell on the field?", choices: ["Buckeyes", "Ohio", "Go Team"], answer: 1 },
      { q: "What does the lucky person do?", choices: ["Dot the i", "Play a drum", "Throw a ball"], answer: 0 },
      { q: "What is the band called?", choices: ["The Marching Bucks", "The Best Damn Band in the Land", "The Big Band"], answer: 1 }
    ]
  },
  {
    topic: "ohio-state",
    level: 1,
    title: "Buckeye Game Day",
    icon: "🏟️",
    content: [
      "Game day at Ohio State is so much fun. Fans start to gather early in the morning. They cook food and play games outside the stadium.",
      "The players run onto the field. The crowd cheers as loud as they can. You can feel the ground shake from all the noise!",
      "The team wears scarlet jerseys at home. They have a big O on their helmets. Players earn stickers for good plays.",
      "When Ohio State scores, the fans sing and cheer. Everyone is happy. Win or lose, the fans always love their Buckeyes."
    ],
    words: ["gather", "stadium", "cheers", "jerseys", "helmets", "stickers", "scores", "sing"],
    quiz: [
      { q: "What do fans do before the game?", choices: ["Sleep", "Cook food and play games", "Go swimming"], answer: 1 },
      { q: "What do players earn for good plays?", choices: ["Money", "Stickers", "Trophies"], answer: 1 },
      { q: "What do fans do when Ohio State scores?", choices: ["Leave", "Sing and cheer", "Sit quietly"], answer: 1 }
    ]
  },

  // === AMERICAN FOOTBALL ===
  {
    topic: "american-football",
    level: 1,
    title: "How Football Works",
    icon: "🏈",
    content: [
      "Football is a fun and exciting sport. Two teams play against each other. Each team has 11 players on the field at a time.",
      "The goal is to get the ball into the end zone. You can run with the ball or throw it. When you score, it is called a touchdown!",
      "A touchdown is worth six points. Then you can kick for one more point. A field goal is worth three points.",
      "Each game has four quarters. The team with the most points at the end wins. Football is a great game to watch and play!"
    ],
    words: ["teams", "players", "end zone", "touchdown", "points", "field goal", "quarters", "score"],
    quiz: [
      { q: "How many players are on the field per team?", choices: ["9", "11", "15"], answer: 1 },
      { q: "How many points is a touchdown?", choices: ["Three", "Six", "Ten"], answer: 1 },
      { q: "How many quarters are in a game?", choices: ["Two", "Three", "Four"], answer: 2 }
    ]
  },
  {
    topic: "american-football",
    level: 1,
    title: "Positions in Football",
    icon: "🏈",
    content: [
      "There are many positions in football. The quarterback is the leader of the offense. He throws the ball to other players.",
      "Wide receivers catch the ball. They run fast down the field. Running backs carry the ball and try to run past the other team.",
      "The offensive line are the big guys up front. They block the other team. They keep the quarterback safe so he can throw.",
      "On defense, there are linemen, linebackers, and defensive backs. Their job is to stop the other team from scoring. Defense wins games!"
    ],
    words: ["quarterback", "offense", "receivers", "running back", "offensive line", "block", "defense", "linemen"],
    quiz: [
      { q: "Who throws the ball?", choices: ["The running back", "The quarterback", "The kicker"], answer: 1 },
      { q: "What do wide receivers do?", choices: ["Block", "Kick", "Catch the ball"], answer: 2 },
      { q: "What does the offensive line do?", choices: ["Score points", "Block the other team", "Catch passes"], answer: 1 }
    ]
  },
  {
    topic: "american-football",
    level: 1,
    title: "The Super Bowl",
    icon: "🏆",
    content: [
      "The Super Bowl is the biggest football game of the year. The two best teams in the NFL play each other. Millions of people watch it on TV.",
      "The game is played at a different city each year. There is a big halftime show with famous singers. It is like a giant party!",
      "The winning team gets a shiny trophy. It is called the Lombardi Trophy. The players also get a special ring.",
      "Many people have Super Bowl parties. They eat snacks and watch the game with friends. It is one of the most fun days of the year!"
    ],
    words: ["Super Bowl", "NFL", "halftime", "trophy", "Lombardi", "ring", "parties", "snacks"],
    quiz: [
      { q: "What is the Super Bowl?", choices: ["A bowling game", "The biggest football game", "A cooking show"], answer: 1 },
      { q: "What is the trophy called?", choices: ["The Gold Cup", "The Lombardi Trophy", "The Big Prize"], answer: 1 },
      { q: "What do the winners get to wear?", choices: ["A crown", "A special ring", "A cape"], answer: 1 }
    ]
  },

  // === AMON-RA ST. BROWN ===
  {
    topic: "amon-ra",
    level: 1,
    title: "Meet Amon-Ra St. Brown",
    icon: "🦁",
    content: [
      "Amon-Ra St. Brown is a football star. He plays wide receiver for the Detroit Lions. He catches passes and scores touchdowns.",
      "His name comes from an Egyptian sun god. His dad picked special names for all his sons. Amon-Ra thinks his name is really cool.",
      "He went to college at USC. That is a big school in Los Angeles. He was a great player there before joining the NFL.",
      "Amon-Ra works very hard every day. He practices catching and running. His hard work has made him one of the best receivers in football!"
    ],
    words: ["receiver", "Detroit", "Lions", "Egyptian", "USC", "college", "practices", "catches"],
    quiz: [
      { q: "What team does Amon-Ra play for?", choices: ["The Bears", "The Detroit Lions", "The Cowboys"], answer: 1 },
      { q: "Where does his name come from?", choices: ["A movie", "An Egyptian sun god", "A video game"], answer: 1 },
      { q: "What college did he go to?", choices: ["Ohio State", "Michigan", "USC"], answer: 2 }
    ]
  },
  {
    topic: "amon-ra",
    level: 1,
    title: "Amon-Ra's Amazing Catches",
    icon: "🌟",
    content: [
      "Amon-Ra St. Brown can catch almost anything. He has very strong hands. The ball sticks to them like glue!",
      "He runs crisp routes on the field. A route is the path a receiver runs. Good routes help him get open to catch the ball.",
      "In one amazing game, he caught the winning touchdown as time ran out! The Lions fans went crazy. It was one of the best plays ever.",
      "Amon-Ra never gives up on a play. Even when a defender is close, he fights for the ball. That is what makes him so special."
    ],
    words: ["catches", "hands", "routes", "path", "winning", "touchdown", "defender", "special"],
    quiz: [
      { q: "What is a route in football?", choices: ["A dance move", "The path a receiver runs", "A type of kick"], answer: 1 },
      { q: "What happened in his amazing game?", choices: ["He kicked a field goal", "He caught the winning touchdown", "He ran 100 yards"], answer: 1 },
      { q: "What does Amon-Ra never do?", choices: ["Give up", "Practice", "Smile"], answer: 0 }
    ]
  },
  {
    topic: "amon-ra",
    level: 1,
    title: "The St. Brown Family",
    icon: "👨‍👩‍👦‍👦",
    content: [
      "Amon-Ra comes from an athletic family. His dad was a bodybuilder. His dad won big contests and was very strong.",
      "He has two brothers who also play football. Their names are Equanimeous and Osiris. All three brothers have cool Egyptian names.",
      "The brothers grew up playing sports together. They pushed each other to be the best. Family is very important to Amon-Ra.",
      "His mom is from Germany. Amon-Ra can speak German! He is talented on and off the field. His family is very proud of him."
    ],
    words: ["athletic", "bodybuilder", "brothers", "Equanimeous", "Osiris", "Egyptian", "Germany", "proud"],
    quiz: [
      { q: "What was Amon-Ra's dad?", choices: ["A teacher", "A bodybuilder", "A chef"], answer: 1 },
      { q: "How many brothers does he have?", choices: ["One", "Two", "Three"], answer: 1 },
      { q: "What language can Amon-Ra speak?", choices: ["Spanish", "French", "German"], answer: 2 }
    ]
  },

  // === GEORGE KITTLE ===
  {
    topic: "george-kittle",
    level: 1,
    title: "Meet George Kittle",
    icon: "🐻",
    content: [
      "George Kittle is a football star. He plays tight end for the San Francisco 49ers. He is one of the best tight ends in the whole NFL.",
      "George grew up in Madison, Wisconsin. His dad also played football. Football runs in the Kittle family!",
      "He went to college at the University of Iowa. He played great football there. Then the 49ers picked him in the NFL draft.",
      "George is known for being super tough. He blocks like a lineman and catches like a receiver. He can do it all!"
    ],
    words: ["tight end", "49ers", "San Francisco", "Wisconsin", "Iowa", "draft", "tough", "blocks"],
    quiz: [
      { q: "What team does George Kittle play for?", choices: ["The Packers", "The 49ers", "The Bears"], answer: 1 },
      { q: "What position does he play?", choices: ["Quarterback", "Tight end", "Running back"], answer: 1 },
      { q: "Where did he go to college?", choices: ["Iowa", "Ohio State", "Michigan"], answer: 0 }
    ]
  },
  {
    topic: "george-kittle",
    level: 1,
    title: "George Kittle's Big Plays",
    icon: "💪",
    content: [
      "George Kittle loves making big plays. He runs hard after he catches the ball. Tacklers have a tough time bringing him down.",
      "One time he caught a pass and ran 85 yards for a touchdown! He broke tackles along the way. The crowd went wild!",
      "George celebrates with a big roar after touchdowns. He pumps his fists and gets the fans excited. His energy is contagious.",
      "He also loves to block for his teammates. When George blocks, the running back has room to run. He helps his team in every way."
    ],
    words: ["tackles", "yards", "touchdown", "celebrates", "roar", "energy", "contagious", "teammates"],
    quiz: [
      { q: "How far did George run on his big play?", choices: ["25 yards", "50 yards", "85 yards"], answer: 2 },
      { q: "What does George do after touchdowns?", choices: ["Sits down", "Celebrates with a roar", "Walks away"], answer: 1 },
      { q: "What else does George love to do?", choices: ["Block for teammates", "Play soccer", "Take naps"], answer: 0 }
    ]
  },
  {
    topic: "george-kittle",
    level: 1,
    title: "George Kittle the Wrestling Fan",
    icon: "🤼",
    content: [
      "George Kittle has a fun secret. He loves pro wrestling! He watches it all the time. His favorite wrestlers are his heroes.",
      "He sometimes does wrestling moves to celebrate. After a big play, he might flex like a wrestler. The fans love it!",
      "George even got to meet some famous wrestlers. They think he is awesome too. A football player who loves wrestling is pretty cool.",
      "George says wrestling taught him to be tough. It also taught him to have fun. He brings that energy to every football game he plays."
    ],
    words: ["wrestling", "celebrates", "flex", "heroes", "famous", "awesome", "tough", "energy"],
    quiz: [
      { q: "What does George Kittle love besides football?", choices: ["Basketball", "Pro wrestling", "Tennis"], answer: 1 },
      { q: "How does he celebrate big plays?", choices: ["He dances", "He does wrestling moves", "He sings"], answer: 1 },
      { q: "What did wrestling teach George?", choices: ["To cook", "To be tough and have fun", "To swim"], answer: 1 }
    ]
  },

  // === TOM BRADY ===
  {
    topic: "tom-brady",
    level: 1,
    title: "Meet Tom Brady",
    icon: "🐐",
    content: [
      "Tom Brady is one of the greatest football players ever. Many people call him the GOAT. That stands for Greatest Of All Time.",
      "Tom grew up in California. He loved sports as a kid. He played football, baseball, and basketball growing up.",
      "He went to the University of Michigan for college. He had to work hard to become the starting quarterback. He never gave up.",
      "Tom played in the NFL for over 20 years. He retired as a legend. Kids and adults all over the world look up to him."
    ],
    words: ["greatest", "GOAT", "California", "Michigan", "quarterback", "starting", "retired", "legend"],
    quiz: [
      { q: "What does GOAT stand for?", choices: ["Good Old Athletic Tiger", "Greatest Of All Time", "Great Outside And Tall"], answer: 1 },
      { q: "Where did Tom grow up?", choices: ["Texas", "California", "Ohio"], answer: 1 },
      { q: "What college did Tom go to?", choices: ["USC", "Iowa", "Michigan"], answer: 2 }
    ]
  },
  {
    topic: "tom-brady",
    level: 1,
    title: "Tom Brady's Seven Rings",
    icon: "💍",
    content: [
      "Tom Brady won seven Super Bowls. That is more than any other player ever! Six of those wins were with the New England Patriots.",
      "His seventh ring came with the Tampa Bay Buccaneers. He was 43 years old! Most players retire much younger than that.",
      "In many of those games, Tom made amazing comebacks. He never stopped believing his team could win. He stayed calm under pressure.",
      "Seven Super Bowl rings is a record that may never be broken. Tom Brady showed that hard work and believing in yourself can do amazing things."
    ],
    words: ["Super Bowl", "rings", "Patriots", "Buccaneers", "comebacks", "believing", "calm", "record"],
    quiz: [
      { q: "How many Super Bowls did Tom win?", choices: ["Five", "Six", "Seven"], answer: 2 },
      { q: "Which team did he win his 7th ring with?", choices: ["The Patriots", "The Buccaneers", "The Lions"], answer: 1 },
      { q: "What was Tom known for?", choices: ["Giving up easily", "Making comebacks", "Being very fast"], answer: 1 }
    ]
  },
  {
    topic: "tom-brady",
    level: 1,
    title: "Tom Brady Was Pick 199",
    icon: "📋",
    content: [
      "When Tom Brady entered the NFL draft, not many teams wanted him. He was picked 199th overall. That means 198 players were picked before him!",
      "Tom was very sad and upset. But he used that feeling to work even harder. He wanted to prove everyone wrong.",
      "And boy, did he prove them wrong! He became the best quarterback ever. The teams that passed on him wished they had picked him.",
      "Tom's story teaches us a big lesson. It does not matter where you start. What matters is how hard you work and that you never give up."
    ],
    words: ["draft", "picked", "overall", "upset", "prove", "harder", "lesson", "never give up"],
    quiz: [
      { q: "What pick was Tom Brady in the draft?", choices: ["1st", "50th", "199th"], answer: 2 },
      { q: "How did Tom feel after the draft?", choices: ["Happy", "Sad and upset", "Tired"], answer: 1 },
      { q: "What did Tom do with his feelings?", choices: ["Quit football", "Worked even harder", "Went to sleep"], answer: 1 }
    ]
  },

  // === LEGO STAR WARS ===
  {
    topic: "lego-star-wars",
    level: 1,
    title: "Building the Millennium Falcon",
    icon: "🚀",
    content: [
      "The Millennium Falcon is the coolest ship in Star Wars. It belongs to Han Solo and Chewbacca. Now you can build it with Lego!",
      "The Lego Falcon has hundreds of tiny pieces. You follow the instructions step by step. Each step adds more bricks to the ship.",
      "It has a cockpit where the mini figures sit. It also has secret compartments inside. You can open it up and see the rooms!",
      "When it is done, you can play with it. Fly it around your room. Make up your own Star Wars adventures with your Lego Falcon!"
    ],
    words: ["Millennium Falcon", "Han Solo", "Chewbacca", "cockpit", "mini figures", "compartments", "bricks", "adventures"],
    quiz: [
      { q: "Who flies the Millennium Falcon?", choices: ["Luke", "Han Solo and Chewbacca", "Yoda"], answer: 1 },
      { q: "What does the Lego set have inside?", choices: ["Real food", "Secret compartments", "A motor"], answer: 1 },
      { q: "What do you follow to build it?", choices: ["A song", "Instructions", "A video game"], answer: 1 }
    ]
  },
  {
    topic: "lego-star-wars",
    level: 1,
    title: "Lego Lightsaber Battles",
    icon: "⚔️",
    content: [
      "Lightsabers are the coolest weapons in Star Wars. Jedi use blue and green ones. Bad guys use red ones. In Lego, they are tiny and awesome!",
      "You can build battle scenes with Lego. Put a Jedi on one side and a Sith on the other. Then act out an epic lightsaber fight!",
      "Luke Skywalker has a green lightsaber. Darth Vader has a red one. When they fight, it is one of the best scenes ever.",
      "The best part about Lego is you make the story. Your Jedi can win every time. Or maybe the bad guy wins and you have to fight again!"
    ],
    words: ["lightsaber", "Jedi", "Sith", "battle", "Luke", "Darth Vader", "fight", "epic"],
    quiz: [
      { q: "What color lightsaber does a Jedi use?", choices: ["Red", "Blue or green", "Purple"], answer: 1 },
      { q: "Who has a red lightsaber?", choices: ["Luke", "Yoda", "Darth Vader"], answer: 2 },
      { q: "What is the best part about Lego?", choices: ["The box", "You make the story", "The stickers"], answer: 1 }
    ]
  },
  {
    topic: "lego-star-wars",
    level: 1,
    title: "Lego Star Wars Video Games",
    icon: "🎮",
    content: [
      "There are Lego Star Wars video games too! In the games, everything is made of Lego bricks. Even the trees and buildings!",
      "You can play as your favorite characters. Be Luke, Leia, or even Darth Vader! Each character has special moves they can do.",
      "The games are really funny. When something gets destroyed, the Lego pieces go flying everywhere. The characters make silly faces and sounds.",
      "You can play with a friend too. Work together to solve puzzles and beat the bad guys. Lego Star Wars games are fun for the whole family!"
    ],
    words: ["video games", "characters", "special", "destroyed", "pieces", "puzzles", "silly", "together"],
    quiz: [
      { q: "What is everything made of in the games?", choices: ["Clay", "Lego bricks", "Paper"], answer: 1 },
      { q: "What happens when things get destroyed?", choices: ["The game ends", "Lego pieces fly everywhere", "Nothing"], answer: 1 },
      { q: "How many players can play together?", choices: ["Only one", "Two", "Ten"], answer: 1 }
    ]
  },

  // === FLAG FOOTBALL ===
  {
    topic: "flag-football",
    level: 1,
    title: "What Is Flag Football?",
    icon: "🏳️",
    content: [
      "Flag football is a type of football. But there is no tackling! Instead of tackling, you pull a flag off the other player's belt.",
      "Each player wears a belt with flags hanging from it. When someone pulls your flag, the play is over. It is much safer than tackle football.",
      "You still throw, catch, and run with the ball. The goal is still to score touchdowns. It is all the fun of football without getting hit!",
      "Kids all over the world play flag football. It is a great way to learn the game. Some grown-ups play flag football leagues too!"
    ],
    words: ["flag", "tackling", "belt", "pull", "safer", "touchdowns", "leagues", "learn"],
    quiz: [
      { q: "How do you stop someone in flag football?", choices: ["Tackle them", "Pull their flag", "Tag them"], answer: 1 },
      { q: "Is there tackling in flag football?", choices: ["Yes", "No", "Sometimes"], answer: 1 },
      { q: "Who plays flag football?", choices: ["Only kids", "Only adults", "Kids and adults"], answer: 2 }
    ]
  },
  {
    topic: "flag-football",
    level: 1,
    title: "Flag Football in the Olympics",
    icon: "🥇",
    content: [
      "Guess what? Flag football is going to be in the Olympics! The whole world will watch teams play flag football. How cool is that?",
      "Teams from many countries will compete. The United States will have a team. So will countries from Europe, Asia, and more.",
      "The Olympics brings people together through sports. Now football fans everywhere will get to cheer. Flag football on the world stage is exciting!",
      "Maybe one day you could play flag football in the Olympics. Keep practicing your throws and catches. Dream big and work hard!"
    ],
    words: ["Olympics", "countries", "compete", "United States", "Europe", "Asia", "exciting", "dream"],
    quiz: [
      { q: "Where is flag football going to be played?", choices: ["The Super Bowl", "The Olympics", "The World Series"], answer: 1 },
      { q: "How many countries will compete?", choices: ["Just one", "Two", "Many countries"], answer: 2 },
      { q: "What should you do to get better?", choices: ["Stop playing", "Keep practicing", "Watch TV"], answer: 1 }
    ]
  },
  {
    topic: "flag-football",
    level: 1,
    title: "Playing Flag Football",
    icon: "🏃",
    content: [
      "Playing flag football is a blast. You start by picking teams. Each team makes up plays to run. A play is a plan for what everyone does.",
      "The quarterback calls the play in the huddle. Then the team lines up. The quarterback says hike and the play starts!",
      "Receivers run their routes and try to get open. The quarterback throws the ball. If you catch it, run fast before someone pulls your flag!",
      "The best part is everyone gets to play. You do not have to be the biggest or fastest. Smart plays and teamwork win flag football games."
    ],
    words: ["blast", "plays", "huddle", "hike", "routes", "open", "teamwork", "smart"],
    quiz: [
      { q: "What is a play?", choices: ["A game", "A plan for what everyone does", "A flag"], answer: 1 },
      { q: "What does the quarterback say to start?", choices: ["Go", "Hike", "Now"], answer: 1 },
      { q: "What wins flag football games?", choices: ["Being the biggest", "Smart plays and teamwork", "Being the tallest"], answer: 1 }
    ]
  },

  // === HISTORY OF AMERICAN FOOTBALL ===
  {
    topic: "football-history",
    level: 1,
    title: "How Football Began",
    icon: "📜",
    content: [
      "Football started a long time ago. In the 1800s, college students played a game like soccer and rugby mixed together. It was very rough!",
      "A man named Walter Camp helped make the rules. He is called the Father of Football. He created the line of scrimmage and downs.",
      "The first college football game was in 1869. Rutgers played Princeton. The game looked very different from what we see today!",
      "Over the years, the rules changed to make the game safer and more fun. Helmets were added. The forward pass was invented. Football kept getting better!"
    ],
    words: ["rugby", "Walter Camp", "rules", "scrimmage", "downs", "Rutgers", "helmets", "forward pass"],
    quiz: [
      { q: "Who is called the Father of Football?", choices: ["Tom Brady", "Walter Camp", "George Washington"], answer: 1 },
      { q: "When was the first college football game?", choices: ["1769", "1869", "1969"], answer: 1 },
      { q: "What was invented to make football more exciting?", choices: ["The forward pass", "The baseball bat", "The basketball hoop"], answer: 0 }
    ]
  },
  {
    topic: "football-history",
    level: 1,
    title: "The NFL Is Born",
    icon: "🏈",
    content: [
      "The NFL started in 1920. NFL stands for the National Football League. At first, there were only a few teams.",
      "The teams played in small towns. Not many people watched. But slowly, more and more fans started to love the game.",
      "By the 1960s, football was on TV. Now millions of people could watch from home. The Super Bowl became the biggest game of the year.",
      "Today the NFL has 32 teams. Fans fill huge stadiums every Sunday. Football is now the most popular sport in America!"
    ],
    words: ["NFL", "league", "teams", "towns", "fans", "TV", "stadiums", "popular"],
    quiz: [
      { q: "When did the NFL start?", choices: ["1920", "1950", "1990"], answer: 0 },
      { q: "What does NFL stand for?", choices: ["New Football League", "National Football League", "Nice Fun League"], answer: 1 },
      { q: "How many teams are in the NFL today?", choices: ["16", "24", "32"], answer: 2 }
    ]
  },
  {
    topic: "football-history",
    level: 1,
    title: "Football Helmets Through Time",
    icon: "⛑️",
    content: [
      "A long time ago, football players had no helmets at all! They played with nothing on their heads. That was very dangerous.",
      "Then players started wearing leather caps. These soft caps did not do much. But it was better than nothing!",
      "In the 1940s, hard plastic helmets were made. They protected players much better. Face masks were added later to protect their faces.",
      "Today's helmets are very advanced. They have padding inside and are made of strong materials. Scientists keep making them safer every year."
    ],
    words: ["helmets", "leather", "caps", "dangerous", "plastic", "protect", "face masks", "advanced"],
    quiz: [
      { q: "What did players first wear on their heads?", choices: ["Nothing", "Metal helmets", "Hats"], answer: 0 },
      { q: "What were early helmets made of?", choices: ["Metal", "Leather", "Wood"], answer: 1 },
      { q: "What is added to protect player faces?", choices: ["Glasses", "Face masks", "Bandanas"], answer: 1 }
    ]
  },

  // === EPIC AMERICAN FOOTBALL STORIES ===
  {
    topic: "epic-football",
    level: 1,
    title: "The Immaculate Reception",
    icon: "🤯",
    content: [
      "In 1972, the Steelers were losing a playoff game. There were only seconds left. It looked like they would lose.",
      "The quarterback threw a long pass. It bounced off a player! Franco Harris caught the ball just before it hit the ground.",
      "Franco ran all the way to the end zone for a touchdown! The Steelers won the game! Nobody could believe what just happened.",
      "People call this play the Immaculate Reception. It is one of the greatest plays in football history. It happened in the blink of an eye!"
    ],
    words: ["Steelers", "playoff", "seconds", "bounced", "Franco Harris", "Immaculate Reception", "greatest", "history"],
    quiz: [
      { q: "What team made this famous play?", choices: ["The Cowboys", "The Steelers", "The Patriots"], answer: 1 },
      { q: "What happened to the ball?", choices: ["It was kicked", "It bounced off a player", "It went out of bounds"], answer: 1 },
      { q: "Who caught the ball?", choices: ["Tom Brady", "Franco Harris", "George Kittle"], answer: 1 }
    ]
  },
  {
    topic: "epic-football",
    level: 1,
    title: "The Biggest Comeback Ever",
    icon: "🔥",
    content: [
      "In Super Bowl 51, the Patriots were losing big. The Falcons were ahead 28 to 3. No team had ever come back from that far behind in a Super Bowl.",
      "Tom Brady did not give up. He told his team to keep fighting. They scored again and again. The Falcons could not stop them!",
      "The game went to overtime for the first time ever in Super Bowl history! The Patriots scored a touchdown to win 34 to 28.",
      "It was the greatest comeback ever. Tom Brady was named the game's MVP. Fans still talk about this amazing game today."
    ],
    words: ["comeback", "Falcons", "Patriots", "overtime", "fighting", "scored", "MVP", "amazing"],
    quiz: [
      { q: "What was the score the Patriots came back from?", choices: ["14 to 3", "21 to 7", "28 to 3"], answer: 2 },
      { q: "What happened for the first time in Super Bowl history?", choices: ["Overtime", "A tie", "A shutout"], answer: 0 },
      { q: "Who was named MVP?", choices: ["George Kittle", "Tom Brady", "Amon-Ra St. Brown"], answer: 1 }
    ]
  },
  {
    topic: "epic-football",
    level: 1,
    title: "The Music City Miracle",
    icon: "🎶",
    content: [
      "In the year 2000, the Titans played the Bills in a playoff game. The Bills kicked a field goal to take the lead with 16 seconds left.",
      "It looked like the Bills would win. But then something wild happened on the kickoff return! A Titans player caught the ball and threw it across the field.",
      "His teammate Kevin Dyson caught the lateral pass and ran down the sideline. Nobody could catch him! He scored a touchdown to win the game!",
      "The play is called the Music City Miracle. It happened in Nashville, the Music City. Fans could not believe their eyes. It was pure magic!"
    ],
    words: ["Titans", "Bills", "playoff", "kickoff", "lateral", "sideline", "miracle", "Nashville"],
    quiz: [
      { q: "What city did this miracle happen in?", choices: ["New York", "Nashville", "Dallas"], answer: 1 },
      { q: "What kind of pass was thrown?", choices: ["A forward pass", "A lateral pass", "A bounce pass"], answer: 1 },
      { q: "Who scored the winning touchdown?", choices: ["Kevin Dyson", "Tom Brady", "Franco Harris"], answer: 0 }
    ]
  },

  // ============================================
  // LEVEL 2 STORIES - 3rd Grade Reading Level
  // ============================================

  // === OHIO STATE FOOTBALL === Level 2
  {
    topic: "ohio-state",
    level: 2,
    title: "Rivalry with Michigan",
    icon: "⚔️",
    content: [
      "Every year, Ohio State plays a huge game against Michigan. This rivalry is one of the oldest in college football history. It has been going on since 1897!",
      "The week before the game, Ohio State fans refuse to say the letter M. They call Michigan \"That Team Up North\" instead. Players put a big X over every M on campus.",
      "The game is always played on the last Saturday of November. Both teams save their best effort for this special day. The stadium is always completely packed with screaming fans.",
      "Whoever wins the rivalry game gets bragging rights for the whole year. Some of the most exciting moments in college football have happened during this classic matchup.",
      "Ohio State students and alumni look forward to this game more than any other. Families pass down their love for the Buckeyes from generation to generation."
    ],
    words: ["rivalry", "refuse", "campus", "bragging rights", "alumni", "generation", "matchup", "tradition"],
    quiz: [
      { q: "When did the Ohio State vs Michigan rivalry start?", choices: ["1950", "1897", "2001"], answer: 1 },
      { q: "What do Ohio State fans refuse to say?", choices: ["The letter M", "The word football", "Michigan's score"], answer: 0 },
      { q: "When is the game always played?", choices: ["First week of October", "Last Saturday of November", "New Year's Day"], answer: 1 }
    ]
  },
  {
    topic: "ohio-state",
    level: 2,
    title: "Heisman Trophy Winners",
    icon: "🏆",
    content: [
      "The Heisman Trophy is the biggest award a college football player can win. It is given to the best player in the country each year. Ohio State has had many winners!",
      "Some famous Buckeye Heisman winners include Archie Griffin, Eddie George, and Troy Smith. Archie Griffin is extra special because he won the trophy two times in a row.",
      "No other player in history has ever won two Heismans. Griffin accomplished this amazing feat in 1974 and 1975. He is a true legend at Ohio State.",
      "Winning the Heisman means you worked harder than everyone else. These players spent countless hours practicing and studying the game.",
      "Every Ohio State player dreams of one day holding that famous bronze statue. It represents the very best in college football."
    ],
    words: ["Heisman", "trophy", "award", "accomplished", "feat", "legend", "countless", "represents"],
    quiz: [
      { q: "Who won the Heisman Trophy two times?", choices: ["Eddie George", "Troy Smith", "Archie Griffin"], answer: 2 },
      { q: "What is the Heisman Trophy?", choices: ["A team award", "The best player award", "A coaching award"], answer: 1 },
      { q: "What years did Archie Griffin win?", choices: ["1974 and 1975", "1980 and 1981", "1990 and 1991"], answer: 0 }
    ]
  },
  {
    topic: "ohio-state",
    level: 2,
    title: "The Scarlet and Gray",
    icon: "🎨",
    content: [
      "Ohio State's official colors are scarlet and gray. Scarlet is a rich, dark shade of red that stands out in any crowd. These colors have represented the university since 1878.",
      "On game day, fans create a sea of scarlet throughout the stadium. Some fans paint their faces and wear costumes to show their school spirit.",
      "The team's mascot is Brutus Buckeye. He has a big round head that looks like a buckeye nut. Brutus does push-ups every time Ohio State scores a touchdown.",
      "Students can earn special Buckeye leaf stickers for their helmets. These small stickers are shaped like marijuana leaves but actually represent the buckeye tree leaf.",
      "The scarlet and gray tradition connects every person who has ever been part of Ohio State. Whether you are a student, player, or fan, those colors bring everyone together."
    ],
    words: ["official", "shade", "represented", "university", "mascot", "costumes", "spirit", "connects"],
    quiz: [
      { q: "Since when has Ohio State used scarlet and gray?", choices: ["1878", "1920", "1955"], answer: 0 },
      { q: "What does Brutus do when Ohio State scores?", choices: ["Push-ups", "Backflips", "Cartwheels"], answer: 0 },
      { q: "What are the helmet stickers shaped like?", choices: ["Stars", "Buckeye leaves", "Footballs"], answer: 1 }
    ]
  },

  // === AMERICAN FOOTBALL === Level 2
  {
    topic: "american-football",
    level: 2,
    title: "Understanding Downs and Yards",
    icon: "📏",
    content: [
      "In football, the offense gets four chances called downs to move the ball forward ten yards. If they make it ten yards, they get a fresh set of four downs.",
      "The yellow line you see on TV shows where the team needs to reach. This first down marker helps fans follow the action at home.",
      "If the offense cannot make it ten yards in three downs, they usually punt the ball on fourth down. Punting sends the ball far away so the other team starts further back.",
      "Sometimes a team will go for it on fourth down instead of punting. This is a risky but exciting decision that can change the whole game.",
      "Understanding downs is the key to following football. Once you know how downs work, everything about the game makes much more sense!"
    ],
    words: ["offense", "downs", "yards", "marker", "punt", "decision", "risky", "fresh"],
    quiz: [
      { q: "How many downs does a team get?", choices: ["Three", "Four", "Five"], answer: 1 },
      { q: "How many yards must you gain for a first down?", choices: ["Five", "Ten", "Twenty"], answer: 1 },
      { q: "What does a team usually do on fourth down?", choices: ["Score", "Punt", "Take a break"], answer: 1 }
    ]
  },
  {
    topic: "american-football",
    level: 2,
    title: "Penalties and Flags",
    icon: "🟡",
    content: [
      "When a player breaks a rule in football, the referee throws a bright yellow flag onto the field. This flag signals that a penalty has been called.",
      "There are many different kinds of penalties. Offsides means a player crossed the line too early. Holding means a player grabbed another player's jersey illegally.",
      "Pass interference is one of the biggest penalties. It happens when a defender pushes or grabs a receiver who is trying to catch the ball.",
      "Penalties can cost a team five, ten, or even fifteen yards. Some penalties give the other team an automatic first down, which is a big advantage.",
      "Referees wear black and white striped shirts so everyone can spot them easily. They use hand signals to tell the crowd what penalty was called."
    ],
    words: ["referee", "penalty", "offsides", "holding", "interference", "automatic", "advantage", "signals"],
    quiz: [
      { q: "What color is the penalty flag?", choices: ["Red", "Yellow", "Blue"], answer: 1 },
      { q: "What is it called when a player crosses the line too early?", choices: ["Holding", "Offsides", "Interference"], answer: 1 },
      { q: "What do referees wear?", choices: ["Red shirts", "Blue shirts", "Black and white stripes"], answer: 2 }
    ]
  },
  {
    topic: "american-football",
    level: 2,
    title: "Special Teams and Kicking",
    icon: "👟",
    content: [
      "Special teams are the players who come onto the field during kicks. There are several types of kicks in football, and each one is important.",
      "A kickoff starts each half and happens after every score. The kicker boots the ball as far as possible while the other team tries to return it.",
      "A punt happens when a team gives up the ball. The punter catches a long snap and kicks the ball high into the air to push the other team back.",
      "Field goals are worth three points. The holder catches the snap and places the ball on the ground. Then the kicker swings his leg and tries to kick it through the uprights.",
      "The best kickers in the NFL can kick field goals from over fifty yards away. That is more than half the length of the entire football field!"
    ],
    words: ["special teams", "kickoff", "punter", "snap", "holder", "uprights", "field goal", "return"],
    quiz: [
      { q: "How many points is a field goal worth?", choices: ["One", "Three", "Six"], answer: 1 },
      { q: "When does a kickoff happen?", choices: ["Only at the start", "After every score", "At halftime only"], answer: 1 },
      { q: "What must the ball go through for a field goal?", choices: ["A net", "The uprights", "A hoop"], answer: 1 }
    ]
  },

  // === AMON-RA ST. BROWN === Level 2
  {
    topic: "amon-ra",
    level: 2,
    title: "Amon-Ra's Record-Breaking Season",
    icon: "📊",
    content: [
      "In his second season with the Lions, Amon-Ra St. Brown became unstoppable. He caught touchdown passes in game after game, setting new team records.",
      "He finished with over 100 catches in a single season. Not many receivers in the entire NFL can reach that milestone. It showed how dependable he truly is.",
      "What made his season even more impressive was that defenses knew the ball was coming to him. They double-teamed him, but he still found ways to get open.",
      "Amon-Ra earned a spot in the Pro Bowl, which is the NFL's all-star game. Only the very best players in the league get invited.",
      "His incredible season proved that the Lions made a smart choice when they drafted him. Amon-Ra went from an underrated rookie to a genuine superstar."
    ],
    words: ["unstoppable", "milestone", "dependable", "impressive", "double-teamed", "Pro Bowl", "underrated", "genuine"],
    quiz: [
      { q: "How many catches did Amon-Ra have?", choices: ["Over 50", "Over 100", "Over 200"], answer: 1 },
      { q: "What is the Pro Bowl?", choices: ["A bowling event", "The NFL all-star game", "A college game"], answer: 1 },
      { q: "How did defenses try to stop him?", choices: ["They ignored him", "They double-teamed him", "They asked him to stop"], answer: 1 }
    ]
  },
  {
    topic: "amon-ra",
    level: 2,
    title: "The Lions' Comeback",
    icon: "🦁",
    content: [
      "The Detroit Lions struggled for many years before Amon-Ra arrived. They had not won a playoff game in a very long time, and fans were desperate for a change.",
      "Amon-Ra helped bring new energy to the team. His determination on every play inspired his teammates to work harder and believe in themselves.",
      "In the 2023 season, the Lions finally made a deep playoff run. The city of Detroit was electric with excitement as the team kept winning games.",
      "Amon-Ra was at the center of many clutch moments during that magical season. He caught important passes when the team needed them the most.",
      "The Lions proved that with the right players and attitude, any team can turn things around. Amon-Ra helped show Detroit that anything is possible."
    ],
    words: ["struggled", "desperate", "determination", "inspired", "electric", "clutch", "magical", "attitude"],
    quiz: [
      { q: "What had the Lions not done in a long time?", choices: ["Scored a point", "Won a playoff game", "Played on TV"], answer: 1 },
      { q: "What did Amon-Ra bring to the team?", choices: ["New uniforms", "New energy", "New coaches"], answer: 1 },
      { q: "When did the Lions make a deep playoff run?", choices: ["2020", "2023", "2025"], answer: 1 }
    ]
  },
  {
    topic: "amon-ra",
    level: 2,
    title: "Training Like Amon-Ra",
    icon: "💪",
    content: [
      "Amon-Ra's success does not happen by accident. He follows a strict training routine that keeps him in incredible shape throughout the entire football season.",
      "Every morning, he wakes up early to work out before practice. He lifts weights to build strength and runs sprints to stay fast on the field.",
      "After practice, Amon-Ra studies film of upcoming opponents. He watches hours of video to learn how defenders move so he can find ways to beat them.",
      "He also pays close attention to his diet. He eats healthy meals with plenty of protein and vegetables to fuel his body for the demands of professional football.",
      "Amon-Ra believes that preparation is the secret to success. He often tells young players that talent alone is not enough — you need discipline and hard work too."
    ],
    words: ["routine", "incredible", "sprints", "opponents", "defenders", "diet", "protein", "discipline"],
    quiz: [
      { q: "When does Amon-Ra work out?", choices: ["Late at night", "Early in the morning", "Only on weekends"], answer: 1 },
      { q: "What does he study after practice?", choices: ["Math homework", "Film of opponents", "Cooking recipes"], answer: 1 },
      { q: "What does Amon-Ra say is the secret to success?", choices: ["Luck", "Preparation", "Being tall"], answer: 1 }
    ]
  },

  // === GEORGE KITTLE === Level 2
  {
    topic: "george-kittle",
    level: 2,
    title: "George Kittle's College Days",
    icon: "🎓",
    content: [
      "Before becoming an NFL star, George Kittle played football at the University of Iowa. The Iowa Hawkeyes are known for developing tough, hardworking players.",
      "At Iowa, George learned how to be a complete tight end. His coaches taught him to block just as well as he could catch the football.",
      "George was not a huge star in college like some other players. He worked quietly behind the scenes and improved every single day without seeking attention.",
      "When the NFL draft came around, George was picked in the fifth round. Many teams passed on him because they did not realize how talented he would become.",
      "George used that experience as motivation. He wanted to prove that all those teams made a big mistake by not drafting him earlier."
    ],
    words: ["developing", "complete", "improved", "attention", "drafted", "motivation", "talented", "mistake"],
    quiz: [
      { q: "What college did George attend?", choices: ["Ohio State", "Iowa", "Michigan"], answer: 1 },
      { q: "What round was George drafted?", choices: ["First", "Third", "Fifth"], answer: 2 },
      { q: "What did George use as motivation?", choices: ["Money", "Teams passing on him", "His favorite wrestler"], answer: 1 }
    ]
  },
  {
    topic: "george-kittle",
    level: 2,
    title: "The 49ers' Offensive Weapon",
    icon: "🔴",
    content: [
      "George Kittle is one of the most important players on the San Francisco 49ers. As a tight end, he lines up next to the offensive linemen before every snap.",
      "What makes George special is that he can do two jobs at once. On one play he might block a huge defensive end, and on the next play he runs a route and catches a pass.",
      "Defensive coordinators have a hard time planning against George. If they prepare to stop his catching, he hurts them with blocking. If they expect blocking, he burns them with receptions.",
      "George has helped the 49ers reach the Super Bowl multiple times. His combination of toughness, speed, and skill makes the entire offense better.",
      "Teammates say George is the heart and soul of the 49ers. His energy in the locker room lifts everyone up, especially during tough games."
    ],
    words: ["weapon", "offensive", "coordinators", "receptions", "combination", "toughness", "locker room", "energy"],
    quiz: [
      { q: "Where does a tight end line up?", choices: ["In the backfield", "Next to the offensive linemen", "On the sideline"], answer: 1 },
      { q: "Why is George hard to plan against?", choices: ["He is invisible", "He can block and catch", "He plays every position"], answer: 1 },
      { q: "What do teammates call George?", choices: ["The boss", "Heart and soul of the 49ers", "The quiet one"], answer: 1 }
    ]
  },
  {
    topic: "george-kittle",
    level: 2,
    title: "George Kittle Off the Field",
    icon: "😄",
    content: [
      "George Kittle is known for being one of the funniest and most likable players in the NFL. He always has a smile on his face and loves making people laugh.",
      "He and his wife Claire share their adventures on social media. Fans enjoy watching their funny videos and seeing what the couple is up to during the off-season.",
      "George is passionate about giving back to his community. He visits children's hospitals and schools to brighten kids' days and encourage them to follow their dreams.",
      "His love for professional wrestling extends beyond just watching. George has appeared at wrestling events and even has his own custom championship belt at home.",
      "Despite being a fierce competitor on the field, George shows that football players can be kind, goofy, and generous when the game is over."
    ],
    words: ["likable", "adventures", "social media", "passionate", "community", "encourage", "competitor", "generous"],
    quiz: [
      { q: "What is George known for off the field?", choices: ["Being serious", "Being funny and likable", "Being quiet"], answer: 1 },
      { q: "What does George visit to help kids?", choices: ["Toy stores", "Hospitals and schools", "Movie theaters"], answer: 1 },
      { q: "What special item does George have at home?", choices: ["A trophy case", "A custom wrestling belt", "A gold football"], answer: 1 }
    ]
  },

  // === TOM BRADY === Level 2
  {
    topic: "tom-brady",
    level: 2,
    title: "The TB12 Method",
    icon: "🥑",
    content: [
      "One reason Tom Brady played football until age 45 is his special training and diet plan called the TB12 Method. Most quarterbacks retire much younger.",
      "Tom avoids eating sugar and processed foods. Instead, he fills his plate with vegetables, lean meats, and plenty of water throughout the day.",
      "His workout routine focuses on keeping his muscles flexible rather than just building bulk. He calls this approach pliability, and it helped prevent injuries.",
      "Tom also believes strongly in getting enough sleep. He goes to bed early every night, sometimes as early as eight-thirty, even during the football season.",
      "The TB12 Method showed other athletes that taking care of your body can extend your career. Tom proved that discipline off the field matters just as much as talent on it."
    ],
    words: ["method", "processed", "flexible", "pliability", "injuries", "extend", "career", "discipline"],
    quiz: [
      { q: "What is Tom's health plan called?", choices: ["The Brady Bunch", "The TB12 Method", "The Football Diet"], answer: 1 },
      { q: "What does Tom focus on in workouts?", choices: ["Building huge muscles", "Keeping muscles flexible", "Running marathons"], answer: 1 },
      { q: "What time does Tom sometimes go to bed?", choices: ["Midnight", "Eight-thirty", "Ten o'clock"], answer: 1 }
    ]
  },
  {
    topic: "tom-brady",
    level: 2,
    title: "Tom Brady's Rivalries",
    icon: "⚡",
    content: [
      "Throughout his career, Tom Brady had some amazing rivalries with other great quarterbacks. These matchups became some of the most watched games on television.",
      "His biggest rivalry was against Peyton Manning. Tom and Peyton played against each other seventeen times! Their games were always close and thrilling to watch.",
      "Tom also had memorable battles against Eli Manning, Peyton's younger brother. Eli's team actually beat Tom in two Super Bowls, which were two of Tom's toughest losses.",
      "Later in his career, Tom faced young quarterbacks like Patrick Mahomes. These new rivals brought fresh excitement to the game and pushed Tom to play even harder.",
      "Football rivalries make the sport more interesting because fans pick sides and argue about who is the best. Tom's rivalries created memories that fans will never forget."
    ],
    words: ["rivalries", "matchups", "thrilling", "memorable", "battles", "toughest", "excitement", "memories"],
    quiz: [
      { q: "Who was Tom's biggest rival?", choices: ["George Kittle", "Peyton Manning", "Patrick Mahomes"], answer: 1 },
      { q: "How many times did Tom and Peyton play?", choices: ["Ten", "Seventeen", "Twenty-five"], answer: 1 },
      { q: "Who beat Tom in two Super Bowls?", choices: ["Peyton Manning", "Patrick Mahomes", "Eli Manning"], answer: 2 }
    ]
  },
  {
    topic: "tom-brady",
    level: 2,
    title: "Life After Football",
    icon: "🎬",
    content: [
      "After retiring from football, Tom Brady stayed busy with many exciting projects. He became a football broadcaster on television, analyzing games for millions of viewers.",
      "Tom also started his own clothing brand and invested in several businesses. His competitive spirit drove him to succeed in the business world just like he did in football.",
      "He spends more time with his three children now that he is not playing. Tom has talked about how much he enjoys being there for their school events and activities.",
      "Even though he is retired, Tom still works out almost every day. Old habits die hard, and he wants to stay healthy and active for his family.",
      "Tom's legacy extends far beyond his seven Super Bowl victories. He inspired a generation of athletes to believe that hard work and dedication can overcome any obstacle."
    ],
    words: ["broadcaster", "analyzing", "invested", "competitive", "legacy", "inspired", "dedication", "obstacle"],
    quiz: [
      { q: "What did Tom become after retiring?", choices: ["A football coach", "A TV broadcaster", "A teacher"], answer: 1 },
      { q: "How many children does Tom have?", choices: ["Two", "Three", "Four"], answer: 1 },
      { q: "How many Super Bowls did Tom win in his career?", choices: ["Five", "Six", "Seven"], answer: 2 }
    ]
  },

  // === LEGO STAR WARS === Level 2
  {
    topic: "lego-star-wars",
    level: 2,
    title: "Building the Death Star",
    icon: "🌑",
    content: [
      "The Lego Death Star is one of the biggest and most impressive Star Wars sets ever made. It contains thousands of pieces and takes many hours to complete.",
      "The finished model stands over sixteen inches tall and shows the inside of the Death Star with multiple levels. Each level has different rooms from the movies.",
      "You can find the throne room where the Emperor sits, the trash compactor where Luke and his friends almost got crushed, and the hangar bay where ships land.",
      "The set comes with many mini figures including Luke Skywalker, Princess Leia, Darth Vader, and even the little mouse droid that rolls around the hallways.",
      "Building this massive set teaches patience and focus. Following the detailed instructions step by step gives builders a wonderful sense of accomplishment when it is finally done."
    ],
    words: ["impressive", "contains", "multiple", "compactor", "hangar", "patience", "detailed", "accomplishment"],
    quiz: [
      { q: "How tall is the finished Death Star model?", choices: ["Six inches", "Sixteen inches", "Three feet"], answer: 1 },
      { q: "Which room is where the Emperor sits?", choices: ["The hangar bay", "The trash compactor", "The throne room"], answer: 2 },
      { q: "What does building this set teach?", choices: ["Patience and focus", "How to fly", "Magic tricks"], answer: 0 }
    ]
  },
  {
    topic: "lego-star-wars",
    level: 2,
    title: "The Story of the Jedi",
    icon: "✨",
    content: [
      "In the Star Wars universe, the Jedi are guardians of peace and justice. They use the Force, a mysterious energy that flows through all living things.",
      "Young Jedi begin their training as younglings at the Jedi Temple. They learn to control the Force and eventually build their very own lightsaber.",
      "A Jedi Master teaches each young Padawan learner. The master guides their student through difficult challenges and helps them resist the temptation of the dark side.",
      "Famous Jedi include Yoda, who is hundreds of years old and incredibly wise, and Obi-Wan Kenobi, who trained both Anakin and Luke Skywalker.",
      "In Lego Star Wars sets, you can recreate famous Jedi training scenes. Build the temple, set up the training course, and help your Padawan become a Jedi Knight!"
    ],
    words: ["guardians", "mysterious", "younglings", "Padawan", "temptation", "incredibly", "recreate", "knight"],
    quiz: [
      { q: "What do Jedi use to protect peace?", choices: ["Blasters", "The Force", "Shields"], answer: 1 },
      { q: "What is a young Jedi learner called?", choices: ["A Knight", "A Padawan", "A Sith"], answer: 1 },
      { q: "How old is Yoda described as?", choices: ["Fifty years old", "Hundreds of years old", "One thousand years old"], answer: 1 }
    ]
  },
  {
    topic: "lego-star-wars",
    level: 2,
    title: "Vehicles of Star Wars in Lego",
    icon: "🛸",
    content: [
      "Star Wars is famous for its incredible vehicles, and Lego has made sets for almost every single one. From tiny speeders to enormous Star Destroyers, there is something for everyone.",
      "The X-Wing fighter is one of the most popular Lego sets. This is the ship Luke Skywalker flew when he destroyed the first Death Star in the original movie.",
      "TIE Fighters are the small, fast ships used by the Empire. Their Lego versions have those distinctive hexagonal wings that fold out from the central cockpit.",
      "For bigger builds, there is the Imperial Star Destroyer. Some versions of this set are over three feet long and contain thousands of gray and white bricks.",
      "Collecting Lego Star Wars vehicles is a hobby enjoyed by both kids and adults. Some rare sets become very valuable over time, making them prized collectibles."
    ],
    words: ["vehicles", "enormous", "distinctive", "hexagonal", "imperial", "versions", "valuable", "collectibles"],
    quiz: [
      { q: "What ship did Luke fly to destroy the Death Star?", choices: ["TIE Fighter", "X-Wing", "Millennium Falcon"], answer: 1 },
      { q: "What shape are TIE Fighter wings?", choices: ["Round", "Square", "Hexagonal"], answer: 2 },
      { q: "Who collects Lego Star Wars sets?", choices: ["Only kids", "Only adults", "Both kids and adults"], answer: 2 }
    ]
  },

  // === FLAG FOOTBALL === Level 2
  {
    topic: "flag-football",
    level: 2,
    title: "Flag Football Strategy",
    icon: "🧠",
    content: [
      "Winning at flag football requires smart strategy, not just speed and strength. The best teams spend time planning their plays before each game.",
      "On offense, teams design plays that create confusion for the defense. Trick plays like reverses and double passes can catch the other team completely off guard.",
      "Zone defense means each defender covers an area of the field. Man-to-man defense means each defender follows one specific player wherever they go.",
      "Reading the defense is an important skill for quarterbacks. Before the snap, a good quarterback looks at how the defenders are lined up and decides which play will work best.",
      "Communication is the most important part of any team strategy. Players need to talk to each other during the game so everyone knows what to do on every play."
    ],
    words: ["strategy", "confusion", "reverses", "zone", "man-to-man", "specific", "communication", "quarterback"],
    quiz: [
      { q: "What does flag football require to win?", choices: ["Only speed", "Smart strategy", "Being the tallest"], answer: 1 },
      { q: "What does zone defense mean?", choices: ["Everyone chases the ball", "Each defender covers an area", "Nobody moves"], answer: 1 },
      { q: "What is the most important part of team strategy?", choices: ["Running fast", "Communication", "Having cool uniforms"], answer: 1 }
    ]
  },
  {
    topic: "flag-football",
    level: 2,
    title: "Flag Football Around the World",
    icon: "🌍",
    content: [
      "Flag football is growing rapidly in countries all around the world. People in Mexico, Japan, Germany, and many other nations have started playing the sport.",
      "The International Flag Football Association organizes tournaments between countries. Teams travel across the globe to compete against each other in exciting matches.",
      "Mexico has one of the strongest flag football programs outside the United States. Mexican players are known for their creative offense and passionate style of play.",
      "In Europe, countries like Austria and Germany have organized flag football leagues with dozens of teams. The sport continues to attract new players every year.",
      "The inclusion of flag football in the Olympics has made the sport even more popular worldwide. Now every country wants to build a team that can compete for a gold medal."
    ],
    words: ["rapidly", "international", "tournaments", "globe", "programs", "creative", "organized", "inclusion"],
    quiz: [
      { q: "Which country has a strong flag football program?", choices: ["Australia", "Mexico", "Antarctica"], answer: 1 },
      { q: "What made flag football more popular worldwide?", choices: ["A movie", "The Olympics", "A video game"], answer: 1 },
      { q: "What do countries compete for at the Olympics?", choices: ["A trophy", "A gold medal", "A flag"], answer: 1 }
    ]
  },
  {
    topic: "flag-football",
    level: 2,
    title: "Becoming a Better Flag Football Player",
    icon: "⭐",
    content: [
      "If you want to become a better flag football player, there are several important skills you should practice. Throwing, catching, and running routes are the foundation of the game.",
      "To improve your throwing, practice your spiral. Hold the ball near the back with your fingers on the laces. Follow through by pointing your hand at your target after you release.",
      "Catching is all about hand-eye coordination. Practice catching balls thrown high, low, and to each side. Soft hands mean letting the ball settle into your palms instead of slapping at it.",
      "Pulling flags requires quick reflexes and good timing. Practice reaching for flags during drills so you develop the muscle memory needed during real games.",
      "Most importantly, be a good teammate. Encourage others when they make mistakes and celebrate together when things go well. The best players make everyone around them better."
    ],
    words: ["foundation", "spiral", "laces", "coordination", "reflexes", "muscle memory", "encourage", "celebrate"],
    quiz: [
      { q: "Where should you hold the ball when throwing?", choices: ["In the middle", "Near the back on the laces", "At the very tip"], answer: 1 },
      { q: "What does 'soft hands' mean?", choices: ["Wearing gloves", "Letting the ball settle into your palms", "Throwing gently"], answer: 1 },
      { q: "What is the most important thing to be?", choices: ["The fastest player", "A good teammate", "The loudest player"], answer: 1 }
    ]
  },

  // === HISTORY OF AMERICAN FOOTBALL === Level 2
  {
    topic: "football-history",
    level: 2,
    title: "The First Football Stars",
    icon: "⭐",
    content: [
      "In the early days of football, players like Jim Thorpe and Red Grange became the first true superstars. They helped transform football from a small sport into a national passion.",
      "Jim Thorpe was one of the greatest athletes in history. He played professional football, won Olympic gold medals in track and field, and even played professional baseball.",
      "Red Grange was nicknamed the Galloping Ghost because of how fast and elusive he was on the field. When he joined the NFL, thousands of new fans started watching games.",
      "These early pioneers played without most of the safety equipment we have today. They wore thin leather helmets and had very little padding to protect themselves.",
      "The courage and talent of these early players built the foundation for the NFL we know and love today. Without them, football might never have become America's favorite sport."
    ],
    words: ["transform", "passion", "Olympic", "elusive", "pioneers", "equipment", "courage", "foundation"],
    quiz: [
      { q: "What was Red Grange's nickname?", choices: ["The Flash", "The Galloping Ghost", "The Speed King"], answer: 1 },
      { q: "What other sports did Jim Thorpe play?", choices: ["Soccer and tennis", "Track and baseball", "Swimming and golf"], answer: 1 },
      { q: "What did early players lack?", choices: ["Footballs", "Safety equipment", "Coaches"], answer: 1 }
    ]
  },
  {
    topic: "football-history",
    level: 2,
    title: "How Football Rules Changed",
    icon: "📝",
    content: [
      "Football rules have changed many times over the years to make the game safer and more exciting. Each change helped shape the sport into what we see today.",
      "The forward pass was legalized in 1906. Before that, teams could only run with the ball or toss it sideways. The forward pass opened up the game completely.",
      "In the 1970s, rules were changed to protect quarterbacks from getting hit too hard. Defenders could no longer slam the quarterback into the ground after he released the ball.",
      "More recently, rules about helmet-to-helmet contact have been added. Players are no longer allowed to lead with the top of their helmet when making a tackle.",
      "The NFL continues to study injuries and update rules every year. Player safety is now the top priority, and scientists work with the league to make football as safe as possible."
    ],
    words: ["legalized", "sideways", "protect", "released", "helmet-to-helmet", "contact", "priority", "scientists"],
    quiz: [
      { q: "When was the forward pass legalized?", choices: ["1880", "1906", "1950"], answer: 1 },
      { q: "What rule protects quarterbacks?", choices: ["No hitting after the throw", "No running", "No passing"], answer: 0 },
      { q: "What is the NFL's top priority now?", choices: ["Making money", "Player safety", "Selling tickets"], answer: 1 }
    ]
  },
  {
    topic: "football-history",
    level: 2,
    title: "Famous Football Stadiums",
    icon: "🏟️",
    content: [
      "Throughout football history, certain stadiums have become legendary. These massive structures hold tens of thousands of fans and create an electrifying atmosphere on game day.",
      "Lambeau Field in Green Bay, Wisconsin is one of the most famous stadiums in the world. It is called the Frozen Tundra because games there can be extremely cold in winter.",
      "The Rose Bowl in Pasadena, California has hosted countless championship games. It sits in a beautiful valley surrounded by mountains and has been used since 1923.",
      "AT&T Stadium in Dallas, Texas has the largest video screen of any stadium. The enormous screen hangs over the playing field and helps fans see every detail of the action.",
      "Each stadium has its own unique personality and traditions. Visiting different stadiums is one of the great joys of being a football fan, and many people make it a lifetime goal."
    ],
    words: ["legendary", "structures", "electrifying", "atmosphere", "tundra", "championship", "enormous", "personality"],
    quiz: [
      { q: "What is Lambeau Field's nickname?", choices: ["The Big House", "The Frozen Tundra", "The Swamp"], answer: 1 },
      { q: "Where is the Rose Bowl located?", choices: ["New York", "Dallas", "Pasadena, California"], answer: 2 },
      { q: "What is special about AT&T Stadium?", choices: ["It has a pool", "The largest video screen", "It is underground"], answer: 1 }
    ]
  },

  // === EPIC AMERICAN FOOTBALL STORIES === Level 2
  {
    topic: "epic-football",
    level: 2,
    title: "The Catch by Dwight Clark",
    icon: "🙌",
    content: [
      "In the 1982 NFC Championship game, the San Francisco 49ers were trailing the Dallas Cowboys with less than a minute left. Things looked hopeless for San Francisco.",
      "Quarterback Joe Montana rolled to his right and threw the ball high into the back corner of the end zone. It seemed like the pass was too high for anyone to reach.",
      "But Dwight Clark leaped as high as he possibly could and stretched his fingertips to grab the football. The crowd erupted as he pulled down the incredible catch for a touchdown!",
      "This play is simply known as The Catch. It launched the 49ers dynasty and helped Joe Montana become one of the most celebrated quarterbacks in NFL history.",
      "A statue of Dwight Clark making The Catch now stands outside the 49ers' stadium. It reminds fans that extraordinary moments can happen when you never give up."
    ],
    words: ["trailing", "hopeless", "leaped", "fingertips", "erupted", "dynasty", "celebrated", "extraordinary"],
    quiz: [
      { q: "Who threw the famous pass?", choices: ["Tom Brady", "Joe Montana", "Dan Marino"], answer: 1 },
      { q: "Who made The Catch?", choices: ["Jerry Rice", "George Kittle", "Dwight Clark"], answer: 2 },
      { q: "What did this play launch for the 49ers?", choices: ["A losing streak", "A dynasty", "A new stadium"], answer: 1 }
    ]
  },
  {
    topic: "epic-football",
    level: 2,
    title: "The Ice Bowl",
    icon: "🥶",
    content: [
      "On December 31, 1967, the Green Bay Packers played the Dallas Cowboys in the NFL Championship. The temperature was negative thirteen degrees — the coldest game in NFL history!",
      "The field was frozen solid like a sheet of ice. Players could barely stand up, and the referees' whistles froze and stopped working completely.",
      "The Cowboys took the lead late in the game, and it seemed like the cold would defeat the Packers. But quarterback Bart Starr had other plans.",
      "With only sixteen seconds remaining, Starr called a quarterback sneak. He pushed forward behind his center and crossed the goal line for the winning touchdown!",
      "The Ice Bowl remains one of the greatest games ever played. It showed that true champions can overcome even the harshest conditions to achieve victory."
    ],
    words: ["temperature", "negative", "frozen", "whistles", "remaining", "sneak", "champion", "harshest"],
    quiz: [
      { q: "How cold was it during the Ice Bowl?", choices: ["Thirty-two degrees", "Zero degrees", "Negative thirteen degrees"], answer: 2 },
      { q: "What happened to the referees' whistles?", choices: ["They broke", "They froze", "They were lost"], answer: 1 },
      { q: "What play did Bart Starr call to win?", choices: ["A long pass", "A quarterback sneak", "A field goal"], answer: 1 }
    ]
  },
  {
    topic: "epic-football",
    level: 2,
    title: "The Helmet Catch",
    icon: "⛑️",
    content: [
      "In Super Bowl XLII, the New England Patriots were undefeated with eighteen wins and zero losses. They were trying to complete a perfect season against the New York Giants.",
      "With just over a minute left, the Giants were losing and needed a miracle. Quarterback Eli Manning was grabbed by several Patriots defenders but somehow escaped their grip.",
      "Manning heaved the ball downfield to receiver David Tyree. Tyree jumped up and pressed the ball against his helmet with one hand while a defender tried to rip it away!",
      "Amazingly, Tyree held on and completed the catch. This incredible play, known as the Helmet Catch, kept the Giants' drive alive and led to the game-winning touchdown.",
      "The Giants won 17 to 14, ruining the Patriots' perfect season. The Helmet Catch is considered one of the most spectacular plays in Super Bowl history."
    ],
    words: ["undefeated", "miracle", "escaped", "heaved", "spectacular", "grip", "ruining", "drive"],
    quiz: [
      { q: "What was the Patriots' record going into the Super Bowl?", choices: ["16-0", "18-0", "14-2"], answer: 1 },
      { q: "How did David Tyree catch the ball?", choices: ["With both hands", "Against his helmet", "With his feet"], answer: 1 },
      { q: "Who won Super Bowl XLII?", choices: ["The Patriots", "The Giants", "The Cowboys"], answer: 1 }
    ]
  }
];

// Topic metadata for the topic selector
const TOPICS = [
  { id: "ohio-state", label: "Ohio State Football", icon: "🌰", color: "#BB0000" },
  { id: "american-football", label: "American Football", icon: "🏈", color: "#4CAF50" },
  { id: "amon-ra", label: "Amon-Ra St. Brown", icon: "🦁", color: "#0076B6" },
  { id: "george-kittle", label: "George Kittle", icon: "🐻", color: "#AA0000" },
  { id: "tom-brady", label: "Tom Brady", icon: "🐐", color: "#002244" },
  { id: "lego-star-wars", label: "Lego Star Wars", icon: "🚀", color: "#FFD700" },
  { id: "flag-football", label: "Flag Football", icon: "🏳️", color: "#FF9800" },
  { id: "football-history", label: "History of Football", icon: "📜", color: "#795548" },
  { id: "epic-football", label: "Epic Football Stories", icon: "🔥", color: "#F44336" }
];
