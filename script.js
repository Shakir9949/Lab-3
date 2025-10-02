const form = document.getElementById("surveyForm");
const downloadBtn = document.getElementById("downloadBtn");

// Load saved responses from localStorage (if any)
let responses = JSON.parse(localStorage.getItem("surveyResponses")) || [];

// Save responses to localStorage
function saveResponses() {
  localStorage.setItem("surveyResponses", JSON.stringify(responses));
}

// Handle form submission
form.addEventListener("submit", function(e) {
  e.preventDefault();

  // Collect form data
  const formData = new FormData(form);
  let entry = {};

  formData.forEach((value, key) => {
    if (entry[key]) {
      // handle multiple values (like checkboxes)
      entry[key] += `, ${value}`;
    } else {
      entry[key] = value;
    }
  });

  responses.push(entry);
  saveResponses(); // persist in localStorage

  alert("Thank you for completing the survey!");
  form.reset();
});

// Convert JSON to CSV
function convertToCSV(data) {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(row =>
    Object.values(row)
      .map(val => `"${val}"`) // wrap in quotes for safety
      .join(",")
  );

  return [headers, ...rows].join("\n");
}

// Download as CSV
downloadBtn.addEventListener("click", function() {
  if (responses.length === 0) {
    alert("No responses available to download yet.");
    return;
  }

  const csvContent = convertToCSV(responses);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "survey_responses.csv";
  a.click();
  URL.revokeObjectURL(url);
});