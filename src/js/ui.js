//import { getIdeas } from "./ideas.js"
//import { getSession } from "./auth.js"

//mocks just to develop this file

export const mockIdeas = [
    {
        id:"1",
        title: "Dark Mode",
        description: "add dark mode to the platform",
        category: "product",
        authorId: "u1",
        authorName: "Andreina"
    },
    {
        id:"2",
        title: "Best onboarding",
        description: "tutorial for new users",
        category: "improvement",
        authorId: "u2",
        authorName: "Carlos",
    },
];

export const mockSessionUser = {
    id:"u2",
    name: "Carlos",
};

const ideas = mockIdeas;
const sessionUser = mockSessionUser;

const container = document.getElementById("ideasContainer");

//Render function
function renderIdeas(ideasToRender) {  
container.innerHTML= ideasToRender.map (
    (ideas) => `
    <div class="card">
        <h3>${ideas.title}</h3>
        <p>${ideas.description}</p>
        <small>${ideas.category} - ${ideas.authorName}</small>

        ${
            ideas.authorId === sessionUser.id 
            ? `
                <div class="actions">
                    <button class="edit-btn" data-id="${ideas.id}">Edit</button>
                    <button class="delete-btn" data-id="${ideas.id}">Delete</button>
                </div>
                `
                : ""
        }
    </div>
    `
    )
    .join("");
    }

    renderIdeas(ideas);

    const categoryFilter = document.getElementById("categoryFilter");

    categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;

        if (selectedCategory === "all") {
            renderIdeas(ideas);
            return;
        }

        const filteredIdeas = ideas.filter (
            (idea) => idea.category === selectedCategory
        );

        renderIdeas (filteredIdeas);
    });

    const authorFilter = document.getElementById("authorFilter");

    const authors = [...new Set(ideas.map((idea) => idea.authorName))]

    authors.forEach((author) => {
        const option = document.createElement("option");
        option.value =author;
        option.textContent =author;
        authorFilter.appendChild (option);
    });

    authorFilter.addEventListener("change", () => {
        const selectedAuthor =authorFilter.value;

        if(selectedAuthor === "all") {
            renderIdeas(ideas);
            return;
        }

        const filteredIdeas = ideas.filter (
            (idea) => idea.authorName === selectedAuthor
        );

        renderIdeas(filteredIdeas);
    });

    container.addEventListener("click", (event)=> {
        if(event.target.classList.contains("delete-btn")) {
            const ideaId = event.target.dataset.id;

            const confirmDelete =confirm("are you sure you want to delete this idea?");
            if (!confirmDelete) return;

            const index = ideas.findIndex((idea) => idea.id === ideaId);
            ideas.splice(index, 1);

            renderIdeas(ideas);
        }

        if (event.target.classList.contains("edit-btn")) {
            const ideaId = event.target.dataset.id;

            const ideaToedit = ideas.find((idea) =>
            idea.id === ideaId);

            const newTitle = prompt("Edit title:", ideaToedit.title);
            if(!newTitle) return;

            const newDescription = prompt ("Edit description:", ideaToedit.description);
            if (!newDescription) return;

            const newCategory = prompt(
                "Edit category (product / improvement):",
                ideaToedit.category
            );
            if (!newCategory) return;

            ideaToedit.title=newTitle;
            ideaToedit.description =newDescription;
            ideaToedit.category =newCategory;

            renderIdeas(ideas);
        };
    });
