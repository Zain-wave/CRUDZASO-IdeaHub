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
        authorName: "Carlos"
    }
]

export const mockSessionUser = {
    id:"u1",
    name: "Andreina",
}

const ideas = mockIdeas
const sessionUser = mockSessionUser

const container = document.getElementById("ideasContainer");

container.innerHTML=mockIdeas.map(ideas => `
    <div class="card">
        <h3>${ideas.title}</h3>
        <p>${ideas.description}</p>
        <small>${ideas.category} - ${ideas.authorName}</small>

        ${
            ideas.authorId === mockSessionUser.id 
            ? `
                <div class="actions">
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
                `
                : ""
        }
    </div>
    `).join("");
