require('dotenv').config();
const sequelize = require('./db');
const Question = require('./models/Question');
const mysql = require('mysql2/promise');

const questions = [
  // Java
  { domain: 'Java', text: 'Which of these is a valid declaration of a boolean?', options: ['boolean b1 = 1;', 'boolean b2 = "false";', 'boolean b3 = false;', 'boolean b4 = \'true\';'], correctOptionIndex: 2 },
  { domain: 'Java', text: 'What is the default value of a local variable?', options: ['null', '0', 'Depends on data type', 'Not assigned, causes compilation error'], correctOptionIndex: 3 },
  { domain: 'Java', text: 'Which method is the entry point of a Java program?', options: ['start()', 'main()', 'init()', 'run()'], correctOptionIndex: 1 },
  { domain: 'Java', text: 'What is the size of int in Java?', options: ['2 bytes', '4 bytes', '8 bytes', 'Depends on OS'], correctOptionIndex: 1 },
  { domain: 'Java', text: 'Which keyword is used to prevent method overriding?', options: ['static', 'final', 'const', 'super'], correctOptionIndex: 1 },
  { domain: 'Java', text: 'Can a class extend multiple classes in Java?', options: ['Yes', 'No', 'Only abstract classes', 'Only if they have no common methods'], correctOptionIndex: 1 },
  { domain: 'Java', text: 'Which class is the superclass of all classes in Java?', options: ['Class', 'System', 'Object', 'Main'], correctOptionIndex: 2 },
  { domain: 'Java', text: 'What is used to handle exceptions in Java?', options: ['if-else', 'try-catch', 'switch', 'for-loop'], correctOptionIndex: 1 },
  { domain: 'Java', text: 'Which collection does not allow duplicate elements?', options: ['List', 'Array', 'Set', 'Queue'], correctOptionIndex: 2 },
  { domain: 'Java', text: 'What does JVM stand for?', options: ['Java Variable Machine', 'Java Virtual Machine', 'Java Visual Machine', 'Just Virtual Machine'], correctOptionIndex: 1 },

  // Python
  { domain: 'Python', text: 'What is the correct file extension for Python files?', options: ['.pt', '.pyt', '.py', '.python'], correctOptionIndex: 2 },
  { domain: 'Python', text: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'fun', 'define'], correctOptionIndex: 1 },
  { domain: 'Python', text: 'What is a list in Python?', options: ['An immutable array', 'A mutable, ordered sequence', 'A set of unique elements', 'A key-value pair collection'], correctOptionIndex: 1 },
  { domain: 'Python', text: 'How do you insert comments in Python?', options: ['// comment', '/* comment */', '# comment', '<!-- comment -->'], correctOptionIndex: 2 },
  { domain: 'Python', text: 'Which built-in function returns the length of a string?', options: ['size()', 'length()', 'len()', 'count()'], correctOptionIndex: 2 },
  { domain: 'Python', text: 'What is the output of print(2 ** 3)?', options: ['5', '6', '8', '9'], correctOptionIndex: 2 },
  { domain: 'Python', text: 'What is a dictionary in Python?', options: ['Key-value pairs', 'Ordered sequence', 'Immutable list', 'Set of numbers'], correctOptionIndex: 0 },
  { domain: 'Python', text: 'How do you explicitly raise an exception in Python?', options: ['throw', 'raise', 'error', 'catch'], correctOptionIndex: 1 },
  { domain: 'Python', text: 'Which of these is not a core data type in Python?', options: ['List', 'Dictionary', 'Class', 'Tuple'], correctOptionIndex: 2 },
  { domain: 'Python', text: 'What does the `self` keyword represent in a class?', options: ['The base class', 'The python interpreter', 'The instance of the class', 'A static variable'], correctOptionIndex: 2 },

  // MySQL
  { domain: 'MySQL', text: 'What does SQL stand for?', options: ['Strong Question Language', 'Structured Query Language', 'Structured Question Language', 'Standard Query Language'], correctOptionIndex: 1 },
  { domain: 'MySQL', text: 'Which statement is used to extract data from a database?', options: ['GET', 'EXTRACT', 'SELECT', 'OPEN'], correctOptionIndex: 2 },
  { domain: 'MySQL', text: 'Which statement is used to update data?', options: ['UPDATE', 'MODIFY', 'SAVE', 'CHANGE'], correctOptionIndex: 0 },
  { domain: 'MySQL', text: 'Which keyword is used to sort the result-set?', options: ['SORT', 'ORDER BY', 'SORT BY', 'ALIGN'], correctOptionIndex: 1 },
  { domain: 'MySQL', text: 'Which statement is used to delete data from a database?', options: ['COLLAPSE', 'REMOVE', 'DELETE', 'DROP'], correctOptionIndex: 2 },
  { domain: 'MySQL', text: 'How do you select all columns from a table named "Persons"?', options: ['SELECT * FROM Persons', 'SELECT Persons', 'SELECT [all] FROM Persons', 'SELECT *.Persons'], correctOptionIndex: 0 },
  { domain: 'MySQL', text: 'Which operator is used to search for a specified pattern in a column?', options: ['GET', 'PATTERN', 'LIKE', 'MATCH'], correctOptionIndex: 2 },
  { domain: 'MySQL', text: 'What constraint enforces uniqueness of a column?', options: ['UNIQUE', 'NOT NULL', 'CHECK', 'PRIMARY KEY'], correctOptionIndex: 0 },
  { domain: 'MySQL', text: 'Which clause is used with aggregate functions?', options: ['ORDER BY', 'GROUP BY', 'HAVING', 'WHERE'], correctOptionIndex: 1 },
  { domain: 'MySQL', text: 'What does a INNER JOIN do?', options: ['Returns all records from the left table', 'Returns matching records from both tables', 'Returns all records from the right table', 'Returns all records when there is a match in either table'], correctOptionIndex: 1 },

  // C
  { domain: 'C', text: 'Who is known as the father of C language?', options: ['Bjarne Stroustrup', 'Dennis Ritchie', 'James Gosling', 'Guido van Rossum'], correctOptionIndex: 1 },
  { domain: 'C', text: 'Which of the following is not a valid C variable name?', options: ['int number;', 'float rate;', 'int variable_count;', 'int $main;'], correctOptionIndex: 3 },
  { domain: 'C', text: 'What is short int in C programming?', options: ['The basic data type of C', 'Qualifier', 'Short is the qualifier and int is the basic data type', 'All of the mentioned'], correctOptionIndex: 2 },
  { domain: 'C', text: 'Which keyword is used to prevent any changes in the variable within a C program?', options: ['immutable', 'mutable', 'const', 'volatile'], correctOptionIndex: 2 },
  { domain: 'C', text: 'What is the result of logical or relational expression in C?', options: ['True or False', '0 or 1', '0 if an expression is false and any positive number if an expression is true', 'None of the mentioned'], correctOptionIndex: 1 },
  { domain: 'C', text: 'Which of the following is not a logical operator?', options: ['&', '&&', '||', '!'], correctOptionIndex: 0 },
  { domain: 'C', text: 'What is the use of printf()?', options: ['It reads input', 'It prints output to the screen', 'It terminates the program', 'It declares variables'], correctOptionIndex: 1 },
  { domain: 'C', text: 'In C, what is a pointer?', options: ['A keyword', 'A variable that stores the address of another variable', 'A function', 'An array'], correctOptionIndex: 1 },
  { domain: 'C', text: 'How do you declare a pointer in C?', options: ['int *ptr;', 'ptr int;', '*int ptr;', 'int ptr*;'], correctOptionIndex: 0 },
  { domain: 'C', text: 'What does the sizeof operator return?', options: ['The value of the variable', 'The data type of the variable', 'The size of the variable or data type in bytes', 'The memory address of the variable'], correctOptionIndex: 2 },

  // C++
  { domain: 'C++', text: 'Who created C++?', options: ['Bjarne Stroustrup', 'Dennis Ritchie', 'Ken Thompson', 'Brian Kernighan'], correctOptionIndex: 0 },
  { domain: 'C++', text: 'Which of the following approach is used by C++?', options: ['Left-right', 'Right-left', 'Bottom-up', 'Top-down'], correctOptionIndex: 2 },
  { domain: 'C++', text: 'What is C++?', options: ['C++ is an object oriented programming language', 'C++ is a procedural programming language', 'C++ supports both procedural and object oriented programming language', 'C++ is a functional programming language'], correctOptionIndex: 2 },
  { domain: 'C++', text: 'Which of the following user-defined header file extension used in c++?', options: ['hg', 'cpp', 'h', 'hf'], correctOptionIndex: 2 },
  { domain: 'C++', text: 'Which of the following is a correct identifier in C++?', options: ['VAR_1234', '$var_name', '7VARNAME', '7var_name'], correctOptionIndex: 0 },
  { domain: 'C++', text: 'Which of the following is not a type of constructor in C++?', options: ['Default constructor', 'Parameterized constructor', 'Copy constructor', 'Friend constructor'], correctOptionIndex: 3 },
  { domain: 'C++', text: 'What is virtual inheritance in C++?', options: ['C++ technique to enhance multiple inheritance', 'C++ technique to ensure that a private member of the base class can be accessed somehow', 'C++ technique to avoid multiple inheritances of classes', 'C++ technique to avoid multiple copies of the base class into children/derived class'], correctOptionIndex: 3 },
  { domain: 'C++', text: 'What happens if the following C++ statement is compiled and executed? int *ptr = NULL; delete ptr;', options: ['The program is not semantically correct', 'The program is compiled and executed successfully', 'The program gives a compile-time error', 'The program crashes'], correctOptionIndex: 1 },
  { domain: 'C++', text: 'What is the role of the "this" pointer in C++?', options: ['It points to the base class', 'It points to the derived class', 'It points to the current object', 'It points to nothing'], correctOptionIndex: 2 },
  { domain: 'C++', text: 'Which function is used to read a single character from the console in C++?', options: ['getline()', 'read()', 'cin.get()', 'scanf()'], correctOptionIndex: 2 },

  // JavaScript
  { domain: 'JavaScript', text: 'Which type of JavaScript language is ___', options: ['Object-Oriented', 'Object-Based', 'Assembly-language', 'High-level'], correctOptionIndex: 1 },
  { domain: 'JavaScript', text: 'Which one of the following also known as Conditional Expression:', options: ['Alternative to if-else', 'Switch statement', 'If-then-else statement', 'immediate if'], correctOptionIndex: 3 },
  { domain: 'JavaScript', text: 'In JavaScript, what is a block of statement?', options: ['Conditional block', 'block that combines a number of statements into a single compound statement', 'both conditional block and a single statement', 'block that contains a single statement'], correctOptionIndex: 1 },
  { domain: 'JavaScript', text: 'When interpreter encounters an empty statements, what it will do:', options: ['Shows a warning', 'Prompts to complete the statement', 'Throws an error', 'Ignores the statements'], correctOptionIndex: 3 },
  { domain: 'JavaScript', text: 'The "function" and "var" are known as:', options: ['Keywords', 'Data types', 'Declaration statements', 'Prototypes'], correctOptionIndex: 2 },
  { domain: 'JavaScript', text: 'Which of the following variables takes precedence over the others if the names are the same?', options: ['Global variable', 'The local element', 'The two of the above', 'None of the above'], correctOptionIndex: 1 },
  { domain: 'JavaScript', text: 'Which one of the following is the correct way for calling the JavaScript code?', options: ['Preprocessor', 'Triggering Event', 'RMI', 'Function/Method'], correctOptionIndex: 3 },
  { domain: 'JavaScript', text: 'Which of the following type of a variable is volatile?', options: ['Mutable variable', 'Dynamic variable', 'Volatile variable', 'Immutable variable'], correctOptionIndex: 0 },
  { domain: 'JavaScript', text: 'Which of the following number object function returns the value of the number?', options: ['toString()', 'valueOf()', 'toLocaleString()', 'toPrecision()'], correctOptionIndex: 1 },
  { domain: 'JavaScript', text: 'In JavaScript the x===y statement implies that:', options: ['Both x and y are equal in value, type and reference address as well.', 'Both are x and y are equal in value only.', 'Both are equal in the value and data type.', 'Both are not same at all.'], correctOptionIndex: 2 },

  // HTML
  { domain: 'HTML', text: 'What does HTML stand for?', options: ['Hyper Text Preprocessor', 'Hyper Text Markup Language', 'Hyper Text Multiple Language', 'Hyper Tool Multi Language'], correctOptionIndex: 1 },
  { domain: 'HTML', text: 'Who is making the Web standards?', options: ['Mozilla', 'Microsoft', 'The World Wide Web Consortium', 'Google'], correctOptionIndex: 2 },
  { domain: 'HTML', text: 'Choose the correct HTML element for the largest heading:', options: ['<heading>', '<h6>', '<head>', '<h1>'], correctOptionIndex: 3 },
  { domain: 'HTML', text: 'What is the correct HTML element for inserting a line break?', options: ['<break>', '<br>', '<lb>', '<b>'], correctOptionIndex: 1 },
  { domain: 'HTML', text: 'What is the correct HTML for adding a background color?', options: ['<body bg="yellow">', '<body style="background-color:yellow;">', '<background>yellow</background>', '<body background="yellow">'], correctOptionIndex: 1 },
  { domain: 'HTML', text: 'Choose the correct HTML element to define important text', options: ['<important>', '<i>', '<strong>', '<b>'], correctOptionIndex: 2 },
  { domain: 'HTML', text: 'Choose the correct HTML element to define emphasized text', options: ['<italic>', '<i>', '<em>', '<strong>'], correctOptionIndex: 2 },
  { domain: 'HTML', text: 'Which character is used to indicate an end tag?', options: ['^', '*', '<', '/'], correctOptionIndex: 3 },
  { domain: 'HTML', text: 'How can you open a link in a new tab/browser window?', options: ['<a href="url" target="new">', '<a href="url" new>', '<a href="url" target="_blank">', '<a href="url" target="_new">'], correctOptionIndex: 2 },
  { domain: 'HTML', text: 'Which of these elements are all <table> elements?', options: ['<table><head><tfoot>', '<table><tr><td>', '<table><tr><tt>', '<thead><body><tr>'], correctOptionIndex: 1 },

  // CSS
  { domain: 'CSS', text: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'], correctOptionIndex: 2 },
  { domain: 'CSS', text: 'What is the correct HTML for referring to an external style sheet?', options: ['<stylesheet>mystyle.css</stylesheet>', '<link rel="stylesheet" type="text/css" href="mystyle.css">', '<style src="mystyle.css">', '<link src="mystyle.css">'], correctOptionIndex: 1 },
  { domain: 'CSS', text: 'Where in an HTML document is the correct place to refer to an external style sheet?', options: ['In the <body> section', 'At the end of the document', 'In the <head> section', 'In the <css> section'], correctOptionIndex: 2 },
  { domain: 'CSS', text: 'Which HTML tag is used to define an internal style sheet?', options: ['<style>', '<script>', '<css>', '<link>'], correctOptionIndex: 0 },
  { domain: 'CSS', text: 'Which HTML attribute is used to define inline styles?', options: ['font', 'style', 'styles', 'class'], correctOptionIndex: 1 },
  { domain: 'CSS', text: 'Which is the correct CSS syntax?', options: ['body:color=black;', '{body:color=black;}', 'body {color: black;}', '{body;color:black;}'], correctOptionIndex: 2 },
  { domain: 'CSS', text: 'How do you insert a comment in a CSS file?', options: ['// this is a comment', '/* this is a comment */', '\' this is a comment', '// this is a comment //'], correctOptionIndex: 1 },
  { domain: 'CSS', text: 'Which property is used to change the background color?', options: ['color', 'bgcolor', 'background-color', 'bg-color'], correctOptionIndex: 2 },
  { domain: 'CSS', text: 'How do you add a background color for all <h1> elements?', options: ['all.h1 {background-color:#FFFFFF;}', 'h1.all {background-color:#FFFFFF;}', 'h1 {background-color:#FFFFFF;}', 'h1 {bgcolor:#FFFFFF;}'], correctOptionIndex: 2 },
  { domain: 'CSS', text: 'Which CSS property is used to change the text color of an element?', options: ['text-color', 'fgcolor', 'color', 'background-color'], correctOptionIndex: 2 }
];

const seedDatabase = async () => {
  try {
    // Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root'
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'mock_interview_db'}\`;`);
    await connection.end();

    await sequelize.authenticate();
    console.log('MySQL connected');
    
    // Sync models
    await sequelize.sync({ force: true }); // Warning: `force: true` drops existing tables
    console.log('Database synced');

    await Question.bulkCreate(questions);
    console.log('Database seeded with questions successfully');
    
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed database:', err);
    process.exit(1);
  }
};

seedDatabase();
