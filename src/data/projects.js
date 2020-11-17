const projects = [
  {
    name: "Spark (Structured) Streaming",
    url: "https://github.com/dbusteed/spark-structured-streaming",
    blurb: "Tutorial / POC where I stream data from Kafka into Spark, then save the data into Cassandra (view the project to find link to the YouTube tutorial)",
    tags: ['data engineering', 'Kafka', 'Spark', 'Scala']
  },
  {
    name: "Nature Simulation",
		url: "https://github.com/dbusteed/nature-simulation",
		blurb: "Simulation of little creatures who eat, drink, and reproduce",
		tags: ['AI', 'Python']
  },
  {
    name: 'Kana Quiz',
    url: "https://github.com/dbusteed/kana-quiz",
    blurb: 'A little web app that does handwriting recognition for Hiragana (one of the character sets used in Japanese)',
    tags: ['data science', 'scikit-learn', 'Python', 'Flask']
  },
  {
    name: "Hello Regression",
    url: "https://github.com/dbusteed/hello-regression",
    blurb: "A collection of programs implementing a linear regression (using Ordinary Least Squares) with different programming languages",
    tags: ['data science', 'Python', 'R', 'Julia']
  },
  {
    name: "Gradient Boosting From Scratch",
    url: "https://www.youtube.com/watch?v=d6CzVXoVZCc",
    blurb: "Short video I made where I implement the gradient boosting algorithm from scratch",
    tags: ["data science", "R"]
  },
  {
    name: "DataBuilder",
    url: "https://github.com/dbusteed/databuilder",
    blurb: "A Python library for making dummy datasets",
    tags: ['software engineering', 'Python']
  },
  {
    name: 'MySSH',
    url: "https://github.com/dbusteed/myssh",
    blurb: 'A simple command line program for managing SSH sessions',
    tags: ['sys admin', 'Bash', 'PowerShell']
  },
  {
    name: "Cookbook",
    url: "https://github.com/dbusteed/cookbook",
    blurb: "An online cookbook I made for my wife",
    tags: ['web dev', 'React', 'Firebase', 'Javascript']
  },
	{
		name: "Brule Name Generator",
		url: "https://github.com/dbusteed/brule",
		blurb: "A Python library for generatning random, Steve Brule-like names",
		tags: ['software engineering', 'Python']
  },
  {
    name: "Embedding Explorer",
		url: "https://github.com/dbusteed/embedding-explorer",
		blurb: "The final project for my computational linguistics course. It's a GUI application that creates word embeddings in stages, allowing the user to explore how word embeddings change as the corpus expands",
		tags: ['NLP', 'Qt GUI', 'Python']
  },
  {
    name: "Escape Game",
		url: "https://github.com/dbusteed/escape-game",
		blurb: "A super basic console game where you escape from creatures chasing you",
		tags: ['game dev', 'C']
  },
  {
		name: "Grid Battle",
		url: "https://github.com/dbusteed/grid-battle",
		blurb: "Multiplayer browser game where players expand their armies to control the board",
		tags: ['game dev', 'socket.io', 'Javascript']
  },
  {
    name: "Spark (Direct) Streaming",
		url: "https://github.com/dbusteed/kafka-spark-streaming-example",
		blurb: "Tutorial / POC where I stream data from Kafka into Spark, then save the data into Hive (view the project to find link to the YouTube tutorial)",
		tags: ['data engineering', 'Kafka', 'Spark', 'Python']
  },
  {
    name: "K Nearest Neighbors",
    url: "https://github.com/dbusteed/knn-scala",
    blurb: "Example implementation of the KNN algorithm using Scala",
    tags: ["data science", "Scala"]
  },
  {
    name: "Number Base Explorer",
		url: "https://github.com/dbusteed/number-base-explorer",
		blurb: "Simple calculator-like web app for exploring different number bases. It's a useful tool when explaining the concept of number bases to those are unfamiliar",
		tags: ["web dev", "math", "React", "Javascript"]
  },
  {
    name: "Twitter Country Classifier",
		url: "https://github.com/dbusteed/twitter-country-classifier",
		blurb: "Final project for my \"Machine Learning in Economics\" class. It classifies whether a tweet is originates from the UK or the US",
		tags: ["data science", "scikit-learn", "NLP", "Python"]
  },
  {
    name: "Motion Sensor Microservice",
		url: "https://github.com/dbusteed/motion-sensor-microservice",
		blurb: "Little POC of a microservice, where IOT sensors send motion data thru a REST endpoint",
		tags: ["software engineering", "Flask", "Python"]
	},
  {
    name: "Portfolio Explorer",
    url: "https://github.com/dbusteed/dbusteed.github.io",
    blurb: "This website!",
    tags: ['web dev', 'React', 'Javascript']
  },
]

const tags = {
  
  'concepts': [
    'data science', 'data engineering',
    'software engineering',
    'game dev', 'web dev', 'NLP', 'AI',
    'math', 'sys admin'
  ],
  
  'languages': [
    'Python', 'R', 'Javascript', 'Julia',
    'C', 'Scala', 'Bash', 'PowerShell', 
  ],
  
  'frameworks': [
    'scikit-learn', 'Flask', 'React',
    'Spark', 'socket.io', 'Qt GUI',
    'Kafka', 'Firebase'
  ]
}

export {
  projects,
  tags
}