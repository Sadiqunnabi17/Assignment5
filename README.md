Assignment 5

GitHub Issues Tracker

A simple GitHub Issues Tracker web application built using HTML, TailwindCSS, DaisyUI, and Vanilla JavaScript. The app allows users to log in, view issues, filter them by status, search issues, and view detailed issue information in a modal. HTML provides the structure of the web pages, while Tailwind CSS and DaisyUI are used to create a modern and responsive design with minimal custom styling. JavaScript handles the dynamic behavior of the application, including login validation, fetching issue data from the API, filtering issues, rendering issue cards, and opening modal windows for detailed views. The project uses the provided GitHub Issues API to retrieve issue information.

API Endpoints Used:
All Issues: https://phi-lab-server.vercel.app/api/v1/lab/issues
Single Issue: https://phi-lab-server.vercel.app/api/v1/lab/issue/{id}
Search Issues: https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q={searchText}

Live Demo
GitHub Link: https://github.com/Sadiqunnabi17/Assignment5.git
Live link: https://sadiqunnabi17.github.io/Assignment5/


Frequently Asked Questions (FAQs)

Q1 Difference between var, let, and const

Var is a function scoped that can be redeclared and updated, I can be hoisted with undefined

Let is block scoped that can be updated but not redeclared in the same scope

Const is block scoped that cannot be reassigned after declaration. If used for variables that should not change

Q2 What is the Spread Operator (...)

The spread operator (`...`) in JS is used to expand elements of an array or properties of an object.

Example: 
const numbers = [1,2,3];
const newNumbers = [...numbers,4,5];

It helps copy arrays or merge objects easily.

Q3 Difference between map(), filter(), and forEach()

map() Creates a new array by transforming each element.

Example: const doubled = numbers.map(n => n * 2);

filter() Creates a new array containing only elements that match a condition.

Example: const even = numbers.filter(n => n % 2 === 0);

forEach() Runs a function for each element but does not return a new array.

Example: numbers.forEach(n => console.log(n));

Q4 What is an Arrow Function?

Arrow functions are a shorter syntax for writing functions in JavaScript.

Example: const add = (a,b) => a + b;
They are commonly used in callbacks and array methods.

Q 5 What are Template Literals?

Template literals are strings written using backticks () that allow embedding variables and expressions.

Example: const name = "John";
const message = `Hello ${name}`;
