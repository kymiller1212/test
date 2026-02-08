// Story database - 2nd grade reading level, short sentences, simple words
// Each story has: topic, title, content (broken into paragraphs), keywords, quizQuestions
const STORIES = [
  // === OHIO STATE FOOTBALL ===
  {
    topic: "ohio-state",
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
