let updatedBalance = document.querySelector(".budget-value"); // Updated balance display element
let budgetExpenses = document.querySelector(".budget-expenses-value"); // Expenses total display element
let budgetIncome = document.querySelector(".budget-income-value"); // Total budget display element
let setBudgetBtn = document.querySelector(".income-section .add-btn"); // Set budget button
let addExpenseBtn = document.querySelector(".expenses-section .add-btn"); // Add expense button
let balanceAmount = 0; // Initial balance
let totalBudget = 0; // Initial budget
let expensesList = []; // Array to store expenses
let filterCategoryInput = document.querySelector(".filter-category"); // Filter input field

// Function to update budget display
function updateBudgetDisplay() {
  updatedBalance.textContent =
    (balanceAmount >= 0 ? "+ " : "- ") +
    formatNumberWithCommas(Math.abs(balanceAmount)); // Balance display update
  budgetExpenses.textContent =
    "- " + formatNumberWithCommas(calculateTotalExpenses()); // Total expenses display update
  budgetIncome.textContent = "+ " + formatNumberWithCommas(totalBudget); // Total budget display update
}

// Function to calculate total expenses
function calculateTotalExpenses() {
  let totalExpenses = 0;
  expensesList.forEach((expense) => {
    totalExpenses += expense.amount; // Total expenses calculate
  });
  return totalExpenses; // Total expenses return
}

// Function to add expense to the list
function addExpenseToList(value, category, date) {
  let expense = {
    amount: value,
    category: category,
    date: date,
  };
  expensesList.push(expense); // Expense ko list me add karta hai
  updateBudgetDisplay(); // Display update
  updateLocalStorage(); // Local storage update
  displayExpenseItem(expense); // Expense item display
}

// Function to display expense item
function displayExpenseItem(expense) {
  let expenseItem = document.createElement("div");
  expenseItem.classList.add("item");
  expenseItem.innerHTML = `
    <div class="item-category">${expense.category}</div>
    <div class="right">
      <div class="item-value"> ${formatNumberWithCommas(expense.amount)}</div>
      <div class="item-date">${expense.date}</div>
      <button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button>
      <button class="item-edit-btn"><i class="ion-ios-compose-outline"></i></button>
    </div>
  `;

  // Add delete button event listener
  expenseItem
    .querySelector(".item-delete-btn")
    .addEventListener("click", function () {
      let index = expensesList.indexOf(expense);
      if (index !== -1) {
        balanceAmount += expense.amount; // Balance update jab expense delete hota hai
        expensesList.splice(index, 1); // Expense list se remove
        updateBudgetDisplay(); // Display update
        updateLocalStorage(); // Local storage update
        expenseItem.remove(); // Expense item remove
      }
    });

  // Add edit button event listener
  expenseItem
    .querySelector(".item-edit-btn")
    .addEventListener("click", function () {
      // Populate input fields with expense item values for editing
      document.querySelector(".expenses-section .add-value").value =
        expense.amount; // Expense amount input field
      document.querySelector(".expenses-section .add-category").value =
        expense.category; // Expense category input field
      document.querySelector(".expenses-section .add-date").value =
        expense.date; // Expense date input field

      // Remove the item from the list
      let index = expensesList.indexOf(expense);
      if (index !== -1) {
        balanceAmount += expense.amount; // Balance update jab expense edit hota hai
        expensesList.splice(index, 1); // Expense list se remove
        updateBudgetDisplay(); // Display update
        updateLocalStorage(); // Local storage update
        expenseItem.remove(); // Expense item remove
      }
    });

  // Add expense item to the list
  document.querySelector(".expenses-list").appendChild(expenseItem); // Expense item list me add
}

// Function to update local storage
function updateLocalStorage() {
  localStorage.setItem("expensesList", JSON.stringify(expensesList)); // Expenses list local storage me save
  localStorage.setItem("balanceAmount", balanceAmount.toString()); // Balance amount local storage me save
  localStorage.setItem("totalBudget", totalBudget.toString()); // Total budget local storage me save
}

// Event listener to set budget
setBudgetBtn.addEventListener("click", function () {
  let budgetInput = document.querySelector(".income-section .add-value");
  let budgetValue = parseFloat(budgetInput.value);

  if (!isNaN(budgetValue)) {
    balanceAmount = budgetValue; // Balance amount set
    totalBudget = budgetValue; // Total budget set
    updateBudgetDisplay(); // Display update
    updateLocalStorage(); // Local storage update
    budgetInput.value = ""; // Input field clear
  } else {
    alert("Please enter a valid budget amount"); // Invalid budget amount alert
  }
});

// Event listener to add expense
addExpenseBtn.addEventListener("click", function () {
  let expenseValueInput = document.querySelector(
    ".expenses-section .add-value"
  );
  let expenseCategoryInput = document.querySelector(
    ".expenses-section .add-category"
  );
  let expenseDateInput = document.querySelector(".expenses-section .add-date");

  let expenseValue = parseFloat(expenseValueInput.value);
  let expenseCategory = expenseCategoryInput.value;
  let expenseDate = expenseDateInput.value;

  if (!isNaN(expenseValue) && expenseCategory !== "" && expenseDate !== "") {
    // Check if balance will go negative
    if (balanceAmount - expenseValue < 0) {
      alert("Check your Budget Balance"); // Negative balance alert
    } else {
      // Deduct expense from balance
      balanceAmount -= expenseValue; // Expense ko balance se minus
      updateBudgetDisplay(); // Display update
      updateLocalStorage(); // Local storage update

      // Add expense to list
      addExpenseToList(expenseValue, expenseCategory, expenseDate); // Expense list me add

      // Clear input fields after adding the expense
      expenseValueInput.value = ""; // Expense value input field clear
      expenseCategoryInput.value = ""; // Expense category input field clear
      expenseDateInput.value = ""; // Expense date input field clear
    }
  } else {
    alert("Please fill in all expense fields"); // Expense fields ko fill karne ka alert
  }
});

// Function to initialize from local storage
function initializeFromLocalStorage() {
  let storedExpenses = localStorage.getItem("expensesList");
  let storedBalanceAmount = localStorage.getItem("balanceAmount");
  let storedTotalBudget = localStorage.getItem("totalBudget");

  if (storedExpenses) {
    expensesList = JSON.parse(storedExpenses); // Local storage se expenses list ko fetch
    expensesList.forEach((expense) => {
      displayExpenseItem(expense); // Expense item display
    });
  }

  if (storedBalanceAmount) {
    balanceAmount = parseFloat(storedBalanceAmount); // Local storage se balance amount ko fetch
  }

  if (storedTotalBudget) {
    totalBudget = parseFloat(storedTotalBudget); // Local storage se total budget ko fetch
  }

  updateBudgetDisplay(); // Display update
}

// Function to filter expenses by category
function filterExpensesByCategory() {
  let filterValue = filterCategoryInput.value.toLowerCase();
  let expenseItems = document.querySelectorAll(".expenses-list .item");
  
  expenseItems.forEach((item) => {
    let category = item.querySelector(".item-category").textContent.toLowerCase();
    if (category.includes(filterValue)) {
      item.style.display = "block"; // Filtered expense items display
    } else {
      item.style.display = "none"; // Non-matching expense items hide
    }
  });
}

// Add event listener to filter input
filterCategoryInput.addEventListener("input", filterExpensesByCategory); 
// Filter input me changes detect aur filterExpensesByCategory function call

// Call initialize from local storage on page load
initializeFromLocalStorage(); // Page load par local storage se data initialize

// Function to format number with commas
function formatNumberWithCommas(num) {
  return num.toLocaleString(); // Number ko comma ke sath format
}
