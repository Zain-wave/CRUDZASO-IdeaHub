//import { getIdeas } from "./ideas.js"
import { getSession } from "./auth.js";

import { getAllIdeas } from "./ideas.js";

const ideas = getAllIdeas();
const sessionUser = getSession();

const container = document.getElementById("ideasContainer");

const categoryFilter = document.getElementById("categoryFilter");

categoryFilter.addEventListener("change", () => {
  const selectedCategory = categoryFilter.value;

  if (selectedCategory === "all") {
    renderIdeas(ideas);
    return;
  }

  const filteredIdeas = ideas.filter(
    (idea) => idea.category === selectedCategory,
  );

  renderIdeas(filteredIdeas);
});

const authorFilter = document.getElementById("authorFilter");

const authors = [...new Set(ideas.map((idea) => idea.authorName))];

authors.forEach((author) => {
  const option = document.createElement("option");
  option.value = author;
  option.textContent = author;
  authorFilter.appendChild(option);
});

authorFilter.addEventListener("change", () => {
  const selectedAuthor = authorFilter.value;

  if (selectedAuthor === "all") {
    renderIdeas(ideas);
    return;
  }

  const filteredIdeas = ideas.filter(
    (idea) => idea.authorName === selectedAuthor,
  );

  renderIdeas(filteredIdeas);
});

container.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const ideaId = event.target.dataset.id;

    const confirmDelete = confirm("are you sure you want to delete this idea?");
    if (!confirmDelete) return;

    const index = ideas.findIndex((idea) => idea.id === ideaId);
    ideas.splice(index, 1);

    renderIdeas(ideas);
  }

  if (event.target.classList.contains("edit-btn")) {
    const ideaId = event.target.dataset.id;

    const ideaToedit = ideas.find((idea) => idea.id === ideaId);

    const newTitle = prompt("Edit title:", ideaToedit.title);
    if (!newTitle) return;

    const newDescription = prompt("Edit description:", ideaToedit.description);
    if (!newDescription) return;

    const newCategory = prompt(
      "Edit category (product / improvement):",
      ideaToedit.category,
    );
    if (!newCategory) return;

    ideaToedit.title = newTitle;
    ideaToedit.description = newDescription;
    ideaToedit.category = newCategory;

    renderIdeas(ideas);
  }
});
