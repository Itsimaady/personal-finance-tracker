let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = localStorage.getItem("budget") || 0;

document.getElementById("budget").innerText = budget;

function setBudget() {

    budget = document.getElementById("budgetInput").value;

    localStorage.setItem("budget", budget);

    document.getElementById("budget").innerText = budget;

    updateSummary();
}

function addExpense() {

    const name = document.getElementById("expenseName").value;

    const amount = parseFloat(
        document.getElementById("expenseAmount").value
    );

    const category =
        document.getElementById("expenseCategory").value;

    if(!name || !amount){
        alert("Please enter valid data");
        return;
    }

    expenses.push({
        name,
        amount,
        category
    });

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    renderExpenses();
}

function deleteExpense(index){

    expenses.splice(index,1);

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    renderExpenses();
}

function renderExpenses(){

    const list =
        document.getElementById("expenseList");

    list.innerHTML = "";

    expenses.forEach((expense,index)=>{

        const li = document.createElement("li");

        li.innerHTML = `
            ${expense.name}
            (${expense.category})
            - ₹${expense.amount}

            <button
            class="delete-btn"
            onclick="deleteExpense(${index})">
            Delete
            </button>
        `;

        list.appendChild(li);
    });

    updateSummary();
    updateChart();
}

function updateSummary(){

    const total = expenses.reduce(
        (sum,item)=>sum + item.amount,
        0
    );

    document.getElementById(
        "totalExpense"
    ).innerText = total;

    document.getElementById(
        "remaining"
    ).innerText = budget - total;
}

let chart;

function updateChart(){

    const categories = {};
    
    expenses.forEach(expense=>{

        categories[expense.category] =
            (categories[expense.category] || 0)
            + expense.amount;
    });

    const labels = Object.keys(categories);

    const data = Object.values(categories);

    const ctx =
        document.getElementById(
            "expenseChart"
        );

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{
        type:"pie",
        data:{
            labels:labels,
            datasets:[{
                data:data
            }]
        }
    });
}

renderExpenses();