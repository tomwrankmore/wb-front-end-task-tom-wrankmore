# Supermarket revenue aggregator component

You are creating a supermarket branch revenue aggregator. It's a React-based web application which displays a list of products from multiple supermarket branches in a table that is sorted, filterable and displays the total revenue from all branches.

## Setup

To get started:

1. `npm i` – install the dependencies
2. `npm test` – run all tests in watch mode (the tests will fail until you implement the app)
3. `npm start` – view the app running at [http://localhost:3000/](http://localhost:3000/)

# Tasks

- Request the data from 'api/branch{1, 2, 3}.json' and render it inside the table, where each row contains two columns: product name and total revenue from sales of the product.
- Branches may sell the same products, so you need to aggregate (sum) the revenue per branch
- The table should be sorted alphabetically by product name
- The table can be filtered by product name, the filter should be case insensitive
- At the bottom of the table the total revenue is shown for all the products that are displayed, i.e. if you filter the table, the total needs to update
- You should use the provided `formatNumber` function to display numbers
- You need to get all of the tests passing
- Make sure Search input is inline with the label and working, could this be more accessible?

# Notes

- You don't need to make branch data loading dynamic, you can hardcode the json names
- You don't need to display partial data, you can wait for all data to load first
- Make sure you are happy with the complete solution and it's done to the best of your ability
- The app only needs to work on the latest version Chrome
# wb-front-end-task-tom-wrankmore

# My notes on my approach

I used useEffect and fetch API to ensure the data would be fetched after first render.

I knew I needed to combine all the data into one large array, then return a new array that included a revenue entry with the sum of 'sold' and 'unitPrice'. Then I needed to return another new array that combined any entries with the same name and combine their 'revenue' field. Then rendering the data was simple.

The search was tricky at first because I was initially updating the original data, then got confused about how to use filteredData state if it's initial value was the 'data' state which would be empty before the fetch. I changed filteredData to have an empty array initially and get set at the same time as data. The handleChange function would always start with the full data set and then get populate the filteredData state.

Finally added a useEffect to update the total when filteredData changed.

I needed assistance in some of the array manipulation logic, primarily the combineProducts function and I employed the use of Github copilot to solve that issue, I knew what outcome the logic needed to create but I needed some refresher on how to get there. I sometimes just need to do overall refreshers on array methods that I don't use all the time.

For accessibility I connected the label and input via htmlFor and added some placeholder text for the input. 

I had misread case insensitive as case sensitive, so my code failed the test based on the word 'pear' but I worked that one out by entering the word into the input and then re reading the instruction. I added toLowerCase() in the handleSearch and it became case insensitive and returned the correct total figure of 60,681.02 when value was 'pear'.

Finally, fetchBranches() is currently handling multiple responsibilities at once, with more time to refine I would separate out the responsibilities into functions and execute them inside a try catch block. I wanted to turn this round quickly.